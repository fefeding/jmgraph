/**
 * @fileoverview 基于 jmGraph 的工作流流程图（DAG）示例
 *
 * 对标 VueFlow 实现的流程图组件，包含：
 * - 分层布局（DAG 最长路径）、正交折线连线（smoothstep）+ 箭头
 * - 节点运行状态：idle / pending / running / success / failed / skipped
 * - 交互：滚轮缩放、空白拖拽平移、节点拖拽、连接点拖拽建边、右键菜单、点选
 * - 连线运行态「蚂蚁线」动画、运行中节点角标旋转
 * - 自动布局 / 适应视图 / 缩放控制 / 导出 PNG / 小地图
 */
import jmGraph, { jmControl, jmPath, jmLayer } from '../../../index.js';

// ==================== 常量与元数据 ====================

const NODE_W = 168;        // 节点宽度
const NODE_H = 66;         // 节点高度
const HEADER_H = 21;       // 节点头部高度
const GRID_GAP = 20;       // 网格间距（世界坐标）
const STUB = 20;           // 连线出入节点的直线段长度
const CORNER = 9;          // 连线折角圆角半径
const ARROW_L = 9;         // 箭头长度
const ARROW_W = 5;         // 箭头半宽
const FONT_FAMILY = '-apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif';

export const NODE_TYPES = [
	{ type: 'fetch', label: 'fetch', icon: '↓', desc: '通过 MCP 拉取数据' },
	{ type: 'script', label: 'script', icon: '❯', desc: '沙箱中执行脚本' },
	{ type: 'transform', label: 'transform', icon: '⇄', desc: '数据转换表达式' },
	{ type: 'custom', label: 'custom', icon: '✦', desc: '自定义处理器' },
	{ type: 'agent', label: 'agent', icon: '★', desc: '调用 Agent 推理' }
];

export const typeColor = {
	fetch: '#0ea5e9',
	script: '#6366f1',
	transform: '#f59e0b',
	custom: '#ec4899',
	agent: '#1677ff'
};

export const STATUS_META = {
	idle: { label: '待运行', color: '#94a3b8', glyph: '' },
	pending: { label: '排队中', color: '#f59e0b', glyph: '⋯' },
	running: { label: '运行中', color: '#3b82f6', glyph: '◑' },
	success: { label: '成功', color: '#22c55e', glyph: '✓' },
	failed: { label: '失败', color: '#ef4444', glyph: '✕' },
	skipped: { label: '已跳过', color: '#a78bfa', glyph: '»' }
};

// 连接点向外方向
const DIRS = {
	top: { x: 0, y: -1 },
	right: { x: 1, y: 0 },
	bottom: { x: 0, y: 1 },
	left: { x: -1, y: 0 }
};

function opposite(dir) {
	return { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[dir] || 'top';
}

function typeMeta(type) {
	return NODE_TYPES.find(t => t.type === type) || { type: type, label: type, icon: '◆' };
}

function font(size, weight) {
	return (weight || 400) + ' ' + size + 'px ' + FONT_FAMILY;
}

function labelStyle(size, color, weight, align) {
	return {
		fill: color,
		font: font(size, weight),
		fontSize: size,
		fontFamily: FONT_FAMILY,
		textAlign: align || 'left',
		textBaseline: 'middle'
	};
}

/** 设置文本：jmLabel 会用测量的文本宽度覆盖 width，改文本后需重置 */
function setText(label, text) {
	text = text == null ? '' : String(text);
	if (label.text === text) return;
	label.text = text;
	label.__size = null;
	label.width = label.__boxW || 0;
	label.height = label.__boxH || 0;
	label.needUpdate = true;
}

function truncate(str, n) {
	str = String(str == null ? '' : str);
	return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

/** 根据节点边界与方向，取边界上的锚点 */
export function anchor(b, side) {
	switch (side) {
		case 'top': return { x: b.left + b.width / 2, y: b.top };
		case 'bottom': return { x: b.left + b.width / 2, y: b.bottom };
		case 'left': return { x: b.left, y: b.top + b.height / 2 };
		default: return { x: b.right, y: b.top + b.height / 2 };
	}
}

// ==================== 布局算法 ====================

/** 拓扑层级（DAG 最长路径），用于竖排分层布局 */
export function computeLevels(stages) {
	const levels = new Map();
	const map = new Map(stages.map(s => [s.id, s]));
	function level(id) {
		if (levels.has(id)) return levels.get(id);
		const s = map.get(id);
		const deps = (s && s.dependsOn) || [];
		if (!deps.length) { levels.set(id, 0); return 0; }
		let max = 0;
		deps.forEach(d => { if (map.has(d)) max = Math.max(max, level(d) + 1); });
		levels.set(id, max);
		return max;
	}
	stages.forEach(s => level(s.id));
	return levels;
}

/** 竖排分层布局：层从上到下（Y 轴），同层节点左右并排（X 轴） */
export function computeLayout(stages, opts) {
	opts = opts || {};
	const vGap = opts.vGap || 140;
	const hGap = opts.hGap || 210;
	const pad = opts.pad || 40;

	const levels = computeLevels(stages);
	const rows = new Map();
	let maxPerRow = 0;
	stages.forEach(s => {
		const lv = levels.get(s.id) || 0;
		if (!rows.has(lv)) rows.set(lv, []);
		const arr = rows.get(lv);
		arr.push(s.id);
		maxPerRow = Math.max(maxPerRow, arr.length);
	});

	const idToPos = {};
	[...rows.keys()].sort((a, b) => a - b).forEach((lv, ri) => {
		const ids = rows.get(lv);
		const y = pad + ri * vGap;
		const groupW = (ids.length - 1) * hGap;
		const startX = pad + (maxPerRow * hGap - groupW) / 2;
		ids.forEach((id, ci) => { idToPos[id] = { x: startX + ci * hGap, y: y }; });
	});
	return { idToPos: idToPos, levels: levels };
}

/** 根据 inputs.from 中以 `${source}.` 开头的引用，生成连线标签 */
export function edgeLabel(stages, source, target) {
	const t = stages.find(s => s.id === target);
	const refs = ((t && t.inputs) || [])
		.filter(i => i.from && String(i.from).indexOf(source + '.') === 0)
		.map(i => i.from);
	if (!refs.length) return '';
	return refs.map(r => String(r).split('.').slice(1).join('.') || r).join(' / ');
}

// ==================== 路径计算 ====================

/** 正交折线路由：根据起终点及其引出方向生成折点 */
function routePoints(start, end, startDir, endDir) {
	const p1 = { x: start.x + startDir.x * STUB, y: start.y + startDir.y * STUB };
	const p2 = { x: end.x + endDir.x * STUB, y: end.y + endDir.y * STUB };
	const pts = [start];

	if (startDir.y !== 0 && endDir.y !== 0) {
		// 起终点均为竖向引出：走一条水平中转线
		const midY = (p1.y + p2.y) / 2;
		pts.push({ x: start.x, y: midY }, { x: end.x, y: midY });
	}
	else if (startDir.x !== 0 && endDir.x !== 0) {
		// 起终点均为横向引出：走一条垂直中转线
		const midX = (p1.x + p2.x) / 2;
		pts.push({ x: midX, y: start.y }, { x: midX, y: end.y });
	}
	else if (startDir.y !== 0) {
		// 起点竖向、终点横向
		pts.push({ x: start.x, y: p2.y }, { x: p2.x, y: p2.y });
	}
	else {
		// 起点横向、终点竖向
		pts.push({ x: p1.x, y: start.y }, { x: p1.x, y: end.y });
	}
	pts.push(end);
	return pts;
}

/** 把折线拐角变成二次贝塞尔圆角 */
function roundCorners(points, radius) {
	if (!points || points.length < 3) return points || [];
	const out = [points[0]];
	for (let i = 1; i < points.length - 1; i++) {
		const p0 = points[i - 1], p1 = points[i], p2 = points[i + 1];
		const v1 = { x: p1.x - p0.x, y: p1.y - p0.y };
		const v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
		const l1 = Math.hypot(v1.x, v1.y), l2 = Math.hypot(v2.x, v2.y);
		if (l1 < 0.001 || l2 < 0.001) continue;
		const r = Math.min(radius, l1 / 2, l2 / 2);
		const a = { x: p1.x - v1.x / l1 * r, y: p1.y - v1.y / l1 * r };
		const b = { x: p1.x + v2.x / l2 * r, y: p1.y + v2.y / l2 * r };
		out.push(a);
		const N = 6;
		for (let k = 1; k < N; k++) {
			const t = k / N;
			out.push({
				x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * p1.x + t * t * b.x,
				y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * p1.y + t * t * b.y
			});
		}
		out.push(b);
	}
	out.push(points[points.length - 1]);
	return out;
}

// ==================== 网格 ====================

class FlowGrid extends jmPath {
	constructor(params) {
		params = Object.assign({ gap: GRID_GAP, style: { stroke: '#e2e8f0', lineWidth: 1 } }, params);
		super(params, 'FlowGrid');
		this.interactive = false;
		this.gap = params.gap;
	}

	/** 按当前视口（世界坐标）动态生成网格线，跟随缩放平移 */
	initPoints() {
		const g = this.graph;
		const gap = this.gap || GRID_GAP;
		const s = g.scaleFactor || 1;
		const t = g.translation || { x: 0, y: 0 };
		const left = Math.floor((-t.x) / s / gap) * gap;
		const right = (g.width - t.x) / s;
		const top = Math.floor((-t.y) / s / gap) * gap;
		const bottom = (g.height - t.y) / s;
		const pts = [];
		for (let x = left; x <= right + gap; x += gap) {
			pts.push({ x: x, y: top, m: true });
			pts.push({ x: x, y: bottom });
		}
		for (let y = top; y <= bottom + gap; y += gap) {
			pts.push({ x: left, y: y, m: true });
			pts.push({ x: right, y: y });
		}
		return (this.points = pts);
	}
}

// ==================== 连线 ====================

class FlowEdge extends jmPath {
	constructor(params) {
		params = Object.assign({
			style: {
				stroke: '#94a3b8',
				lineWidth: 1.8,
				lineJoin: 'round',
				lineCap: 'round',
				touchPadding: 10
			}
		}, params);
		super(params, 'FlowEdge');

		this.flowRole = 'edge';
		this.interactive = true;
		this.source = params.source;
		this.target = params.target;
		this.active = false;       // 运行中（蚂蚁线）
		this.hover = false;
		this.mid = { x: 0, y: 0 }; // 路径中点，用于放置标签
		this.start = { x: 0, y: 0 };
		this.end = { x: 0, y: 0 };
		this.startDir = { x: 0, y: 1 };
		this.endDir = { x: 0, y: -1 };
		this.points = [];
	}

	setRoute(start, end, startDir, endDir) {
		this.start = start;
		this.end = end;
		this.startDir = startDir;
		this.endDir = endDir;
		this.initPoints();
		this.needUpdate = true;
	}

	initPoints() {
		const raw = routePoints(this.start, this.end, this.startDir, this.endDir);
		const pts = roundCorners(raw, CORNER);
		const mid = pts[Math.floor(pts.length / 2)];
		if (mid) this.mid = { x: mid.x, y: mid.y };
		return (this.points = pts);
	}

	setHover(v) {
		if (this.hover === v) return;
		this.hover = v;
		this.refreshStyle();
	}

	setActive(v) {
		if (this.active === v) return;
		this.active = v;
		this.refreshStyle();
	}

	refreshStyle() {
		if (this.active) {
			this.style.stroke = '#3b82f6';
			this.style.lineWidth = 2.4;
			this.style.lineDash = [8, 6];
		}
		else if (this.hover) {
			this.style.stroke = '#475569';
			this.style.lineWidth = 2.4;
			this.style.lineDash = null;
		}
		else {
			this.style.stroke = '#94a3b8';
			this.style.lineWidth = 1.8;
			this.style.lineDash = null;
		}
		this.needUpdate = true;
	}

	/** 自绘：折线描边 + 末端实心箭头 */
	draw() {
		const ctx = this.context;
		const bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
		const ox = bounds ? bounds.left : 0;
		const oy = bounds ? bounds.top : 0;
		const pts = this.points;
		if (!pts || pts.length < 2) return;

		ctx.beginPath();
		ctx.moveTo(pts[0].x + ox, pts[0].y + oy);
		for (let i = 1; i < pts.length; i++) {
			const p = pts[i];
			if (p.m) ctx.moveTo(p.x + ox, p.y + oy);
			else ctx.lineTo(p.x + ox, p.y + oy);
		}
		ctx.stroke();

		// 箭头：沿最后一段方向
		const end = pts[pts.length - 1];
		let prev = pts[pts.length - 2];
		for (let i = pts.length - 2; i >= 0; i--) {
			if (Math.hypot(end.x - pts[i].x, end.y - pts[i].y) > 0.5) { prev = pts[i]; break; }
		}
		const ang = Math.atan2(end.y - prev.y, end.x - prev.x);
		const cos = Math.cos(ang), sin = Math.sin(ang);
		const p1 = { x: end.x - ARROW_L * cos + ARROW_W * sin, y: end.y - ARROW_L * sin - ARROW_W * cos };
		const p2 = { x: end.x - ARROW_L * cos - ARROW_W * sin, y: end.y - ARROW_L * sin + ARROW_W * cos };
		ctx.beginPath();
		ctx.moveTo(end.x + ox, end.y + oy);
		ctx.lineTo(p1.x + ox, p1.y + oy);
		ctx.lineTo(p2.x + ox, p2.y + oy);
		ctx.closePath();
		ctx.fillStyle = this.style.stroke;
		ctx.fill();
	}

	endDraw() {
		// 绘制已在 draw() 中完成，避免重复 fill/stroke
		this.needUpdate = false;
	}
}

// ==================== 节点 ====================

class FlowNode extends jmControl {
	constructor(params) {
		params = Object.assign({ width: NODE_W, height: NODE_H, position: { x: 0, y: 0 } }, params);
		super(params, 'FlowNode');

		this.stage = params.stage || { id: '', type: 'custom' };
		this.flowRole = 'node';
		this.interactive = true;
		// 容器本身不绘制，但需要 fill 让 checkPoint 命中整个矩形区域
		this.style.fill = 'rgba(0,0,0,0)';
		this.status = 'idle';
		this.selected = false;
		this.editable = false;
		this.ports = {};
		this.build();
	}

	get color() {
		return typeColor[this.stage.type] || '#64748b';
	}

	build() {
		const g = this.graph;
		const color = this.color;

		// 选中态外框
		this.selRing = g.createShape('rect', {
			position: { x: -5, y: -5 }, width: NODE_W + 10, height: NODE_H + 10, radius: 12,
			style: { fill: 'rgba(0,0,0,0)', stroke: 'rgba(37,99,235,0.55)', lineWidth: 2 }
		});
		this.selRing.interactive = false;
		this.selRing.visible = false;
		this.selRing.zIndex = 0;
		this.children.add(this.selRing);

		// 运行状态光圈
		this.ring = g.createShape('rect', {
			position: { x: -4, y: -4 }, width: NODE_W + 8, height: NODE_H + 8, radius: 11,
			style: { fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)', lineWidth: 3 }
		});
		this.ring.interactive = false;
		this.ring.zIndex = 1;
		this.children.add(this.ring);

		// 背景
		this.bg = g.createShape('rect', {
			position: { x: 0, y: 0 }, width: NODE_W, height: NODE_H, radius: 8,
			style: {
				fill: '#ffffff',
				stroke: color,
				lineWidth: 2,
				shadow: { x: 0, y: 2, blur: 8, color: 'rgba(16,24,40,0.18)' }
			}
		});
		this.bg.interactive = false;
		this.bg.zIndex = 2;
		this.children.add(this.bg);

		// 头部色块
		this.header = g.createShape('rect', {
			position: { x: 0, y: 0 }, width: NODE_W, height: HEADER_H,
			radius: { topLeft: 7, topRight: 7, bottomRight: 0, bottomLeft: 0 },
			style: { fill: color }
		});
		this.header.interactive = false;
		this.header.zIndex = 3;
		this.children.add(this.header);

		// 类型图标
		this.iconText = g.createShape('label', {
			position: { x: 6, y: 1 }, width: 15, height: HEADER_H - 2, text: typeMeta(this.stage.type).icon,
			style: labelStyle(12, '#ffffff', 700, 'center')
		});
		this.iconText.__boxW = 15;
		this.iconText.__boxH = HEADER_H - 2;
		this.iconText.interactive = false;
		this.iconText.zIndex = 4;
		this.children.add(this.iconText);

		// 类型名称
		this.typeText = g.createShape('label', {
			position: { x: 22, y: 1 }, width: 84, height: HEADER_H - 2, text: typeMeta(this.stage.type).label,
			style: labelStyle(11, '#ffffff', 700)
		});
		this.typeText.__boxW = 84;
		this.typeText.__boxH = HEADER_H - 2;
		this.typeText.interactive = false;
		this.typeText.zIndex = 4;
		this.children.add(this.typeText);

		// 重试次数
		this.retryText = g.createShape('label', {
			position: { x: 104, y: 1 }, width: 58, height: HEADER_H - 2, text: '',
			style: labelStyle(10, 'rgba(255,255,255,0.92)', 400, 'right')
		});
		this.retryText.__boxW = 58;
		this.retryText.__boxH = HEADER_H - 2;
		this.retryText.interactive = false;
		this.retryText.zIndex = 4;
		this.children.add(this.retryText);

		// 名称
		this.nameText = g.createShape('label', {
			position: { x: 9, y: 25 }, width: NODE_W - 18, height: 18, text: this.stage.name || this.stage.id,
			style: labelStyle(12, '#111827', 600)
		});
		this.nameText.__boxW = NODE_W - 18;
		this.nameText.__boxH = 18;
		this.nameText.style.maxWidth = NODE_W - 18;
		this.nameText.interactive = false;
		this.nameText.zIndex = 4;
		this.children.add(this.nameText);

		// in / out 标签
		this.tagIn = g.createShape('label', {
			position: { x: 9, y: 45 }, width: 46, height: 16, text: '',
			style: labelStyle(10, '#16a34a', 600)
		});
		this.tagIn.__boxW = 46;
		this.tagIn.__boxH = 16;
		this.tagIn.interactive = false;
		this.tagIn.zIndex = 4;
		this.children.add(this.tagIn);

		this.tagOut = g.createShape('label', {
			position: { x: 58, y: 45 }, width: 50, height: 16, text: '',
			style: labelStyle(10, '#4f46e5', 600)
		});
		this.tagOut.__boxW = 50;
		this.tagOut.__boxH = 16;
		this.tagOut.interactive = false;
		this.tagOut.zIndex = 4;
		this.children.add(this.tagOut);

		// 运行状态角标
		this.badge = g.createShape('circle', {
			center: { x: NODE_W, y: 0 }, radius: 9,
			style: { fill: STATUS_META.idle.color, stroke: '#ffffff', lineWidth: 2 }
		});
		this.badge.interactive = false;
		this.badge.visible = false;
		this.badge.zIndex = 5;
		this.children.add(this.badge);

		this.badgeText = g.createShape('label', {
			center: { x: NODE_W, y: 0 }, width: 14, height: 14, text: '',
			style: labelStyle(11, '#ffffff', 700, 'center')
		});
		this.badgeText.__boxW = 14;
		this.badgeText.__boxH = 14;
		this.badgeText.interactive = false;
		this.badgeText.visible = false;
		this.badgeText.zIndex = 6;
		this.children.add(this.badgeText);

		// 四向连接点
		const ports = [
			['top', NODE_W / 2, 0],
			['right', NODE_W, NODE_H / 2],
			['bottom', NODE_W / 2, NODE_H],
			['left', 0, NODE_H / 2]
		];
		ports.forEach(it => {
			const p = g.createShape('circle', {
				center: { x: it[1], y: it[2] }, radius: 4.5,
				style: { fill: color, stroke: '#ffffff', lineWidth: 2 }
			});
			p.interactive = false;
			p.zIndex = 7;
			p.flowRole = 'port';
			p.portDir = it[0];
			p.node = this;
			this.children.add(p);
			this.ports[it[0]] = p;
		});

		this.syncStage();
	}

	/** 同步 stage 数据到界面 */
	syncStage() {
		const s = this.stage;
		const meta = typeMeta(s.type);
		const color = this.color;
		this.bg.style.stroke = color;
		this.header.style.fill = color;
		setText(this.iconText, meta.icon);
		setText(this.typeText, meta.label);
		setText(this.nameText, this.fitName(s.name || s.id));
		const retries = s.retry && s.retry.maxRetries;
		setText(this.retryText, retries ? '↻' + retries : '');
		const inputs = (s.inputs || []).length;
		const outputs = (s.outputs || []).length;
		this.tagIn.visible = inputs > 0;
		this.tagOut.visible = outputs > 0;
		setText(this.tagIn, inputs ? 'in ' + inputs : '');
		setText(this.tagOut, outputs ? 'out ' + outputs : '');
		for (const dir in this.ports) {
			this.ports[dir].style.fill = color;
			this.ports[dir].needUpdate = true;
		}
		this.needUpdate = true;
	}

	/**
	 * 名称按像素宽度截断为单行省略号
	 *
	 * canvas 文本没有 CSS 式的自动省略，旧的「按 24 字符截断」对中英文
	 * 宽度差异不敏感，这里改为基于 measureText 的像素级省略。
	 */
	fitName(text) {
		const maxW = NODE_W - 18;
		const g = this.graph;
		if (g && g.canvas && g.canvas.getContext) {
			const ctx = g.canvas.getContext('2d');
			if (ctx && typeof ctx.measureText === 'function') {
				// 与 nameText 实际绘制字体保持一致，保证测量准确
				ctx.font = (this.nameText.style && this.nameText.style.font) || font(12, 600);
				text = String(text == null ? '' : text);
				if (ctx.measureText(text).width <= maxW) return text;
				const ell = '…';
				const ellW = ctx.measureText(ell).width;
				let lo = 0, hi = text.length, best = 0;
				while (lo <= hi) {
					const mid = (lo + hi) >> 1;
					if (ctx.measureText(text.slice(0, mid)).width + ellW <= maxW) { best = mid; lo = mid + 1; }
					else hi = mid - 1;
				}
				return (best > 0 ? text.slice(0, best) : (text[0] || '')) + ell;
			}
		}
		return truncate(text, 24);
	}

	setStatus(status) {
		status = status || 'idle';
		this.status = status;
		const meta = STATUS_META[status] || STATUS_META.idle;
		const has = status !== 'idle';
		this.badge.visible = has;
		this.badgeText.visible = has;
		this.badge.style.fill = meta.color;
		delete this.badgeText.style.rotation;
		setText(this.badgeText, meta.glyph);

		switch (status) {
			case 'running': this.ring.style.stroke = 'rgba(59,130,246,0.45)'; break;
			case 'success': this.ring.style.stroke = 'rgba(34,197,94,0.35)'; break;
			case 'failed': this.ring.style.stroke = 'rgba(239,68,68,0.5)'; break;
			case 'pending': this.ring.style.stroke = 'rgba(245,158,11,0.4)'; break;
			case 'skipped': this.ring.style.stroke = 'rgba(167,139,250,0.35)'; break;
			default: this.ring.style.stroke = 'rgba(0,0,0,0)';
		}
		this.style.opacity = status === 'skipped' ? 0.6 : 1;
		this.needUpdate = true;
	}

	setSelected(v) {
		const val = !!v;
		if (this.selected === val) return;
		this.selected = val;
		this.selRing.visible = this.selected;
		this.needUpdate = true;
	}

	setHover(v) {
		this.bg.style.shadow.blur = v ? 14 : 8;
		this.cursor = v ? 'pointer' : 'default';
		this.needUpdate = true;
	}

	setEditable(v) {
		this.editable = !!v;
		this.canMove(this.editable, this.graph);
		for (const dir in this.ports) {
			this.ports[dir].interactive = this.editable;
		}
		this.needUpdate = true;
	}
}

// ==================== 流程图控制器 ====================

/**
 * 创建流程图
 * @param {HTMLElement} container 画布容器
 * @param {object} options
 * @param {Array} [options.stages] 初始 stage 列表
 * @param {string} [options.mode] view | edit
 * @param {function} [options.onSelect] 选中变化 (id)
 * @param {function} [options.onChange] 数据变化 (stages)
 * @param {function} [options.onEdgeClick] 连线点击 (edge)
 * @param {function} [options.onLog] 运行日志 (msg, level)
 */
export function createFlowGraph(container, options) {
	options = options || {};
	const log = (msg, level) => options.onLog && options.onLog(msg, level || 'info');

	const size = {
		width: options.width || container.clientWidth || 800,
		height: options.height || container.clientHeight || 600
	};
	// graphOptions 为高级逃生舱：直接透传给 jmGraph 构造函数，
	// 覆盖除 shapes 注册外的全部底层参数（如 dprScale / hitIndex / autoRefresh）。
	const g = new jmGraph(container, Object.assign({
		width: Math.max(320, size.width),
		height: Math.max(240, size.height),
		autoRefresh: true,
		style: { fill: '#f8fafc' }
	}, options.graphOptions || {}));
	g.registerShape('flowgrid', FlowGrid);
	g.registerShape('flowedge', FlowEdge);
	g.registerShape('flownode', FlowNode);

	// 分层：网格 < 连线 < 连线标签 < 节点 < 临时连线
	const grid = g.createShape('flowgrid', {});
	grid.zIndex = 0;
	g.children.add(grid);

	const edgeLayer = new jmLayer({ name: 'edges', graph: g });
	edgeLayer.zIndex = 1;
	g.children.add(edgeLayer);

	const labelLayer = new jmLayer({ name: 'edge-labels', graph: g });
	labelLayer.zIndex = 2;
	g.children.add(labelLayer);

	const nodeLayer = new jmLayer({ name: 'nodes', graph: g });
	nodeLayer.zIndex = 3;
	g.children.add(nodeLayer);

	const overlay = new jmLayer({ name: 'overlay', graph: g });
	overlay.zIndex = 4;
	g.children.add(overlay);

	const state = {
		stages: (options.stages || []).map(s => Object.assign({}, s)),
		runStatus: {},
		mode: options.mode || 'view',
		selectedId: null
	};
	const nodeMap = new Map();  // id -> FlowNode
	let edges = [];             // { shape, label, source, target }
	let linking = null;         // 连线拖拽中 { id, dir, node }
	let pan = null;             // 画布平移中
	let dragging = false;       // 节点拖拽中
	let running = false;
	let dashOffset = 0;
	let spinAngle = 0;

	// 临时连线
	const linkLine = g.createShape('flowedge', {
		style: { stroke: '#3b82f6', lineWidth: 2, lineDash: [6, 5], touchPadding: 1 }
	});
	linkLine.interactive = false;
	linkLine.visible = false;
	overlay.children.add(linkLine);

	function clearLayer(layer) {
		const list = layer.children;
		for (let i = list.length - 1; i >= 0; i--) list.remove(list[i]);
	}

	// ---------- 视图操作 ----------

	function fit(padding) {
		g.fitView(padding == null ? 0.15 : padding, shape => shape !== grid);
	}

	function zoomBy(factor) {
		g.setZoom(g.scaleFactor * factor, g.width / 2, g.height / 2);
	}

	function resetView() {
		g.resetTransform();
	}

	/** DOM 事件坐标 -> 世界坐标 */
	function toWorld(e) {
		const pos = g.getPosition();
		return g.screenToWorld({ x: e.pageX - pos.left, y: e.pageY - pos.top });
	}

	// ---------- 数据操作 ----------

	/**
	 * 快照当前 stages（隔离外部修改）
	 *
	 * onChange / getStages 均返回副本，宿主无论怎么改返回值
	 * 都不会污染内部模型，避免出现「改了返回值但画布不变」的疑难问题。
	 */
	function cloneStages() {
		return state.stages.map(s => {
			const c = Object.assign({}, s);
			if (Array.isArray(c.dependsOn)) c.dependsOn = c.dependsOn.slice();
			if (Array.isArray(c.inputs)) c.inputs = c.inputs.map(i => (i && typeof i === 'object') ? Object.assign({}, i) : i);
			if (Array.isArray(c.outputs)) c.outputs = c.outputs.map(o => (o && typeof o === 'object') ? Object.assign({}, o) : o);
			if (c.config && typeof c.config === 'object') c.config = Object.assign({}, c.config);
			if (c._pos) c._pos = { x: c._pos.x, y: c._pos.y };
			return c;
		});
	}

	function emitChange() {
		options.onChange && options.onChange(cloneStages());
	}

	/** b 是否可以沿着 dependsOn 到达 a */
	function hasPath(fromId, toId) {
		const map = new Map(state.stages.map(s => [s.id, s]));
		const seen = new Set();
		const stack = [fromId];
		while (stack.length) {
			const cur = stack.pop();
			if (cur === toId) return true;
			if (seen.has(cur)) continue;
			seen.add(cur);
			const s = map.get(cur);
			((s && s.dependsOn) || []).forEach(d => stack.push(d));
		}
		return false;
	}

	function addDependency(fromId, toId) {
		if (fromId === toId) return false;
		const target = state.stages.find(s => s.id === toId);
		if (!target || !state.stages.some(s => s.id === fromId)) return false;
		target.dependsOn = target.dependsOn || [];
		if (target.dependsOn.indexOf(fromId) >= 0) return false;
		if (hasPath(toId, fromId)) {
			log('无法连线：会造成循环依赖 ' + fromId + ' → ' + toId, 'error');
			return false;
		}
		target.dependsOn.push(fromId);
		rebuild();
		emitChange();
		log('新增依赖：' + toId + ' ← ' + fromId, 'ok');
		return true;
	}

	function addStage(type, worldPos) {
		const base = typeMeta(type).label;
		let id = base + '_' + (state.stages.length + 1);
		let i = state.stages.length + 1;
		while (state.stages.some(s => s.id === id)) id = base + '_' + (++i);
		const stage = { id: id, type: type, config: {}, inputs: [], outputs: [], dependsOn: [] };
		if (worldPos) stage._pos = { x: worldPos.x - NODE_W / 2, y: worldPos.y - NODE_H / 2 };
		state.stages.push(stage);
		rebuild();
		emitChange();
		select(id);
		log('新增节点：' + id);
		return id;
	}

	function removeStage(id) {
		state.stages = state.stages.filter(s => s.id !== id);
		state.stages.forEach(s => {
			if (s.dependsOn) s.dependsOn = s.dependsOn.filter(d => d !== id);
			// 清理指向被删节点输出端口的 inputs（形如 `${id}.port`）
			if (s.inputs) s.inputs = s.inputs.filter(i => !(i && i.from && String(i.from).indexOf(id + '.') === 0));
		});
		delete state.runStatus[id];
		if (state.selectedId === id) state.selectedId = null;
		rebuild();
		emitChange();
		log('删除节点：' + id, 'warn');
	}

	function renameStage(id, name) {
		const stage = state.stages.find(s => s.id === id);
		name = String(name || '').trim();
		if (!stage || !name || name === stage.id) return false;
		if (state.stages.some(s => s.id === name)) {
			log('重命名失败：' + name + ' 已存在', 'error');
			return false;
		}
		const old = stage.id;
		stage.id = name;
		state.stages.forEach(s => {
			if (s.dependsOn) s.dependsOn = s.dependsOn.map(d => (d === old ? name : d));
			// 同步改写 inputs.from 的 `${old}.` 前缀（保留端口部分）
			if (s.inputs) s.inputs = s.inputs.map(i => {
				if (i && i.from && String(i.from).indexOf(old + '.') === 0) {
					return Object.assign({}, i, { from: name + String(i.from).slice(old.length) });
				}
				return i;
			});
		});
		state.runStatus[name] = state.runStatus[old];
		delete state.runStatus[old];
		if (state.selectedId === old) state.selectedId = name;
		rebuild();
		emitChange();
		log('重命名：' + old + ' → ' + name);
		return true;
	}

	function updateStage(id, patch) {
		const stage = state.stages.find(s => s.id === id);
		if (!stage) return;
		Object.assign(stage, patch);
		const node = nodeMap.get(id);
		if (node) node.syncStage();
		layoutEdges();
		g.needUpdate = true;
	}

	function autoLayout() {
		state.stages.forEach(s => { delete s._pos; });
		rebuild();
		fit();
	}

	// ---------- 选中 ----------

	function select(id) {
		state.selectedId = id || null;
		nodeMap.forEach((node, key) => node.setSelected(key === state.selectedId));
		g.needUpdate = true;
		options.onSelect && options.onSelect(state.selectedId);
	}

	// ---------- 构建 ----------

	function bindNode(node) {
		node.__movedDist = 0;
		node.on('movestart', () => { node.__movedDist = 0; dragging = true; });
		node.on('move', evt => {
			node.__movedDist += Math.abs(evt.offsetX) + Math.abs(evt.offsetY);
			layoutEdgesFor(node.stage.id);
		});
		node.on('moveend', () => {
			dragging = false;
			node.stage._pos = { x: node.position.x, y: node.position.y };
			emitChange();
		});
		node.on('click', () => {
			if (node.__movedDist > 4) { node.__movedDist = 0; return; }
			select(node.stage.id);
		});
		node.on('dblclick', () => {
			options.onNodeEdit && options.onNodeEdit(node.stage.id);
		});
		node.on('mouseover', () => node.setHover(true));
		node.on('mouseleave', () => node.setHover(false));

		for (const dir in node.ports) {
			const port = node.ports[dir];
			port.on('mousedown', evt => {
				if (!node.editable) return;
				linking = { id: node.stage.id, dir: dir, node: node };
				node.cursor = 'crosshair';
				const b = node.getBounds(true);
				linkLine.setRoute(anchor(b, dir), anchor(b, dir), DIRS[dir], DIRS[opposite(dir)]);
				linkLine.visible = true;
				g.needUpdate = true;
				return false; // 阻止节点拖动
			});
			port.on('mouseover', () => { if (node.editable) node.cursor = 'crosshair'; });
			port.on('mouseleave', () => { if (node.editable) node.cursor = 'pointer'; });
		}
	}

	function bindEdge(item) {
		item.shape.on('click', () => options.onEdgeClick && options.onEdgeClick(item));
		item.shape.on('mouseover', () => { item.shape.setHover(true); g.css('cursor', 'pointer'); });
		item.shape.on('mouseleave', () => { item.shape.setHover(false); g.css('cursor', 'default'); });
	}

	function rebuild(opts) {
		opts = opts || {};
		const layout = computeLayout(state.stages);

		clearLayer(nodeLayer);
		clearLayer(edgeLayer);
		clearLayer(labelLayer);
		nodeMap.clear();
		edges = [];

		state.stages.forEach(s => {
			const p = s._pos || layout.idToPos[s.id] || { x: 0, y: 0 };
			const node = g.createShape('flownode', { stage: s, position: { x: p.x, y: p.y } });
			node.zIndex = 3;
			nodeLayer.children.add(node);
			nodeMap.set(s.id, node);
			bindNode(node);
		});

		state.stages.forEach(s => {
			(s.dependsOn || []).forEach(dep => {
				if (!nodeMap.has(dep)) return;
				const edge = g.createShape('flowedge', { source: dep, target: s.id });
				edgeLayer.children.add(edge);
				const text = edgeLabel(state.stages, dep, s.id);
				const label = g.createShape('label', {
					text: text,
					style: Object.assign(labelStyle(10, '#64748b', 500, 'center'), {
						shadow: { x: 0, y: 0, blur: 3, color: 'rgba(248,250,252,0.95)' }
					})
				});
				label.interactive = false;
				label.zIndex = 1;
				labelLayer.children.add(label);
				const item = { shape: edge, label: text ? label : null, source: dep, target: s.id };
				if (!text) label.visible = false;
				edges.push(item);
				bindEdge(item);
			});
		});

		layoutEdges();
		applyStatus();
		applyMode();
		select(state.selectedId);
		g.needUpdate = true;
		if (opts.fit) fit();
	}

	function layoutEdgesFor(id) {
		edges.forEach(item => {
			if (item.source !== id && item.target !== id) return;
			layoutEdge(item);
		});
		g.needUpdate = true;
	}

	function layoutEdge(item) {
		const s = nodeMap.get(item.source);
		const t = nodeMap.get(item.target);
		if (!s || !t) return;
		s.bounds = null;
		t.bounds = null;
		const sb = s.getBounds(true);
		const tb = t.getBounds(true);
		const dx = (tb.left + tb.width / 2) - (sb.left + sb.width / 2);
		const dy = (tb.top + tb.height / 2) - (sb.top + sb.height / 2);
		let ss, ts;
		if (Math.abs(dx) >= Math.abs(dy)) {
			ss = dx >= 0 ? 'right' : 'left';
			ts = dx >= 0 ? 'left' : 'right';
		}
		else {
			ss = dy >= 0 ? 'bottom' : 'top';
			ts = dy >= 0 ? 'top' : 'bottom';
		}
		item.shape.setRoute(anchor(sb, ss), anchor(tb, ts), DIRS[ss], DIRS[ts]);
		if (item.label) {
			item.label.center = { x: item.shape.mid.x, y: item.shape.mid.y - 9 };
			item.label.needUpdate = true;
		}
	}

	function layoutEdges() {
		edges.forEach(layoutEdge);
		g.needUpdate = true;
	}

	// ---------- 状态 ----------

	function applyStatus() {
		nodeMap.forEach((node, id) => node.setStatus(state.runStatus[id] || 'idle'));
		g.needUpdate = true;
	}

	function setRunStatus(map) {
		state.runStatus = map || {};
		applyStatus();
	}

	function setStatus(id, status) {
		state.runStatus[id] = status;
		const node = nodeMap.get(id);
		if (node) node.setStatus(status);
		g.needUpdate = true;
	}

	function resetRun() {
		state.runStatus = {};
		edges.forEach(e => e.shape.setActive(false));
		applyStatus();
		log('已重置运行状态');
	}

	// ---------- 运行模拟 ----------

	function topoOrder() {
		const map = new Map(state.stages.map(s => [s.id, s]));
		const indeg = new Map();
		state.stages.forEach(s => indeg.set(s.id, ((s.dependsOn || []).filter(d => map.has(d))).length));
		const queue = state.stages.filter(s => indeg.get(s.id) === 0).map(s => s.id);
		const out = [];
		while (queue.length) {
			const id = queue.shift();
			out.push(id);
			state.stages.forEach(s => {
				if ((s.dependsOn || []).indexOf(id) >= 0 && indeg.has(s.id)) {
					indeg.set(s.id, indeg.get(s.id) - 1);
					if (indeg.get(s.id) === 0) queue.push(s.id);
				}
			});
		}
		return out;
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function run() {
		if (running) return;
		if (!state.stages.length) return;
		running = true;
		log('▶ 开始执行流程（' + state.stages.length + ' 个节点）');
		nodeMap.forEach((n, id) => setStatus(id, 'pending'));
		edges.forEach(e => e.shape.setActive(false));

		const order = topoOrder();
		for (const id of order) {
			const stage = state.stages.find(s => s.id === id);
			const deps = (stage && stage.dependsOn) || [];
			const blocked = deps.some(d => state.runStatus[d] === 'failed' || state.runStatus[d] === 'skipped');
			if (blocked) {
				setStatus(id, 'skipped');
				log('⏭ ' + id + ' 因上游失败被跳过', 'warn');
				continue;
			}
			setStatus(id, 'running');
			edges.forEach(e => { if (e.target === id) e.shape.setActive(true); });
			log('… ' + id + ' 运行中');
			await sleep(600 + Math.random() * 700);
			edges.forEach(e => { if (e.target === id) e.shape.setActive(false); });
			const ok = Math.random() > 0.12;
			setStatus(id, ok ? 'success' : 'failed');
			log((ok ? '✔ ' : '✖ ') + id + (ok ? ' 执行成功' : ' 执行失败'), ok ? 'ok' : 'error');
		}
		running = false;
		log('■ 执行结束');
	}

	// ---------- 模式 ----------

	function applyMode() {
		nodeMap.forEach(n => n.setEditable(state.mode === 'edit'));
		if (state.mode !== 'edit') {
			linking = null;
			linkLine.visible = false;
		}
		g.needUpdate = true;
	}

	function setMode(mode) {
		state.mode = mode === 'edit' ? 'edit' : 'view';
		applyMode();
		return state.mode;
	}

	// ---------- 交互：缩放 / 平移 / 连线 ----------

	g.bind('wheel', evt => {
		const raw = evt.event || {};
		if (raw.preventDefault) raw.preventDefault();
		const sx = evt.position.offsetX * g.scaleFactor + g.translation.x;
		const sy = evt.position.offsetY * g.scaleFactor + g.translation.y;
		const factor = (raw.deltaY || 0) < 0 ? 1.12 : 1 / 1.12;
		g.setZoom(g.scaleFactor * factor, sx, sy);
		return false;
	});

	g.bind('mousedown', evt => {
		if (evt.target && evt.target !== g) return;
		const raw = evt.event || {};
		if (raw.button === 2) return; // 右键交由 contextmenu 处理，不触发画布平移
		pan = { x: evt.position.pageX, y: evt.position.pageY, moved: false };
		g.css('cursor', 'grabbing');
	});

	g.bind('mousemove', evt => {
		// 拖拽连线预览
		if (linking) {
			const b = linking.node.getBounds(true);
			const start = anchor(b, linking.dir);
			const cur = { x: evt.position.offsetX, y: evt.position.offsetY };
			linkLine.setRoute(start, cur, DIRS[linking.dir], DIRS[opposite(linking.dir)]);
			linkLine.visible = true;
			g.needUpdate = true;
			return;
		}
		// 节点拖拽中不处理画布平移
		if (dragging) return;
		// 平移画布
		if (pan) {
			const dx = evt.position.pageX - pan.x;
			const dy = evt.position.pageY - pan.y;
			if (Math.abs(dx) + Math.abs(dy) > 2) pan.moved = true;
			pan.x = evt.position.pageX;
			pan.y = evt.position.pageY;
			g.pan(dx, dy);
		}
	});

	g.bind('mouseup', evt => {
		// 结束连线
		if (linking) {
			const p = { x: evt.position.offsetX, y: evt.position.offsetY };
			const target = nodeAt(p);
			if (target && target !== linking.node) {
				addDependency(linking.id, target.stage.id);
			}
			linking = null;
			linkLine.visible = false;
			g.css('cursor', 'default');
			g.needUpdate = true;
			return;
		}
		// 结束平移：点在空白处则取消选中
		if (pan) {
			g.css('cursor', 'default');
			if (!pan.moved) select(null);
			pan = null;
		}
	});

	g.bind('mouseleave', () => {
		if (pan) { pan = null; g.css('cursor', 'default'); }
	});

	// ---------- 右键菜单（命中节点/连线/空白画布） ----------

	/** 命中检测：世界坐标 -> 连线（按折线段最近距离） */
	function edgeAt(p) {
		const threshold = 12;
		let best = null, bestD = threshold;
		for (let i = 0; i < edges.length; i++) {
			const item = edges[i];
			const pts = item.shape.points || [];
			for (let j = 1; j < pts.length; j++) {
				const a = pts[j - 1], b = pts[j];
				if (a.m || b.m) continue;
				const abx = b.x - a.x, aby = b.y - a.y;
				const len2 = abx * abx + aby * aby;
				let t = len2 ? ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2 : 0;
				t = Math.max(0, Math.min(1, t));
				const d = Math.hypot(p.x - (a.x + t * abx), p.y - (a.y + t * aby));
				if (d < bestD) { bestD = d; best = item; }
			}
		}
		return best;
	}

	/** 计算右键命中的对象信息（世界坐标换算见 contextMenuAt） */
	function contextMenuAt(clientX, clientY) {
		const pos = g.getPosition();
		const world = g.screenToWorld({ x: clientX - pos.left, y: clientY - pos.top });
		const node = nodeAt(world);
		const edge = node ? null : edgeAt(world);
		const info = {
			type: node ? 'node' : (edge ? 'edge' : 'pane'),
			id: node ? node.stage.id : null,
			stage: node ? node.stage : null,
			edge: edge ? { source: edge.source, target: edge.target, label: (edge.label && edge.label.text) || '' } : null,
			x: world.x,
			y: world.y,
			clientX: clientX,
			clientY: clientY
		};
		if (typeof options.onContextMenu === 'function') options.onContextMenu(info);
		return info;
	}

	// jmEvents 未绑定 contextmenu，这里在画布 DOM 元素上自行挂载
	const domCanvas = (g.canvas && g.canvas.canvas) || g.canvas;
	const ctxHandler = e => {
		if (e.preventDefault) e.preventDefault();
		contextMenuAt(e.clientX, e.clientY);
		return false;
	};
	if (domCanvas && typeof domCanvas.addEventListener === 'function') {
		domCanvas.addEventListener('contextmenu', ctxHandler);
	}

	// ---------- 键盘快捷键（Delete 删除选中节点 / Esc 取消选中） ----------
	const keyHandler = e => {
		e = e || {};
		// 焦点在输入框/可编辑区域时不拦截按键
		if (typeof document !== 'undefined' && document && document.activeElement) {
			const ae = document.activeElement;
			if (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable) return;
		}
		const code = e.key != null ? String(e.key).toLowerCase() : String(e.keyCode || e.which || '');
		if ((code === 'delete' || code === 'del' || code === '46') && state.mode === 'edit' && state.selectedId) {
			if (e.preventDefault) e.preventDefault();
			removeStage(state.selectedId);
		}
		else if (code === 'escape' || code === '27') {
			if (e.preventDefault) e.preventDefault();
			if (state.selectedId) select(null);
		}
	};
	if (typeof document !== 'undefined' && document && typeof document.addEventListener === 'function') {
		document.addEventListener('keydown', keyHandler);
	}

	/** 命中检测：世界坐标 -> 节点 */
	function nodeAt(p) {
		let found = null;
		nodeMap.forEach(node => {
			if (found) return;
			node.bounds = null;
			if (node.checkPoint(p)) found = node;
		});
		return found;
	}

	// ---------- 动画（蚂蚁线 / 角标旋转） ----------

	g.on('update', () => {
		let dirty = false;
		for (let i = 0; i < edges.length; i++) {
			const e = edges[i];
			if (e.shape.active) {
				e.shape.style.lineDashOffset = dashOffset;
				dirty = true;
			}
		}
		nodeMap.forEach(node => {
			if (node.status === 'running' && node.badgeText.visible) {
				node.badgeText.style.rotation = { x: '50%', y: '50%', angle: spinAngle };
				dirty = true;
			}
		});
		if (dirty) {
			dashOffset -= 0.9;
			spinAngle += 0.22;
			g.needUpdate = true;
		}
		// 小地图随视口/内容变化刷新
		if (miniEl) drawMinimap(miniEl);
	});

	// ---------- 小地图 ----------

	let miniCtx = null;
	let miniEl = null;
	function attachMinimap(el) {
		miniEl = el;
		miniCtx = el.getContext('2d');
		el.onmousedown = e => {
			const rect = el.getBoundingClientRect();
			const b = contentBounds();
			if (!b || !b.width || !b.height) return;
			const scale = miniScale(el, b);
			const wx = (e.clientX - rect.left - miniOffset.x) / scale;
			const wy = (e.clientY - rect.top - miniOffset.y) / scale;
			g.translation.x = g.width / 2 - wx * g.scaleFactor;
			g.translation.y = g.height / 2 - wy * g.scaleFactor;
			g.needUpdate = true;
		};
	}

	let miniOffset = { x: 0, y: 0 };
	function miniScale(el, b) {
		const pad = 8;
		return Math.min((el.width - pad * 2) / b.width, (el.height - pad * 2) / b.height);
	}

	function drawMinimap(el) {
		if (!miniCtx || !el) return;
		const ctx = miniCtx;
		const w = el.width, h = el.height;
		ctx.clearRect(0, 0, w, h);
		ctx.fillStyle = '#f1f5f9';
		ctx.fillRect(0, 0, w, h);

		const b = contentBounds();
		if (!b || !b.width || !b.height) return;
		const pad = 8;
		const s = miniScale(el, b);
		miniOffset.x = pad + ((w - pad * 2) - b.width * s) / 2 - b.left * s;
		miniOffset.y = pad + ((h - pad * 2) - b.height * s) / 2 - b.top * s;
		const X = x => miniOffset.x + x * s;
		const Y = y => miniOffset.y + y * s;

		// 连线
		ctx.strokeStyle = '#cbd5e1';
		ctx.lineWidth = 1;
		edges.forEach(e => {
			ctx.beginPath();
			ctx.moveTo(X(e.shape.start.x), Y(e.shape.start.y));
			ctx.lineTo(X(e.shape.end.x), Y(e.shape.end.y));
			ctx.stroke();
		});

		// 节点
		nodeMap.forEach(node => {
			const nb = node.getBounds();
			const meta = STATUS_META[node.status] || STATUS_META.idle;
			ctx.fillStyle = node.status === 'idle' ? (node.color) : meta.color;
			ctx.fillRect(X(nb.left), Y(nb.top), Math.max(2, nb.width * s), Math.max(2, nb.height * s));
		});

		// 当前视口
		const tl = g.screenToWorld({ x: 0, y: 0 });
		const br = g.screenToWorld({ x: g.width, y: g.height });
		ctx.strokeStyle = 'rgba(37,99,235,0.9)';
		ctx.lineWidth = 1.5;
		ctx.strokeRect(X(tl.x), Y(tl.y), (br.x - tl.x) * s, (br.y - tl.y) * s);
	}

	function contentBounds() {
		return g.getContentBounds(shape => shape !== grid && shape !== linkLine);
	}

	// ---------- 对外接口 ----------

	const api = {
		graph: g,
		setStages(stages) {
			state.stages = (stages || []).map(s => Object.assign({}, s));
			rebuild({ fit: true });
		},
		getStages: () => cloneStages(),
		setRunStatus: setRunStatus,
		getRunStatus: () => state.runStatus,
		setMode: setMode,
		getMode: () => state.mode,
		select: select,
		getSelected: () => state.selectedId,
		addStage: addStage,
		removeStage: removeStage,
		renameStage: renameStage,
		updateStage: updateStage,
		autoLayout: autoLayout,
		run: run,
		isRunning: () => running,
		resetRun: resetRun,
		fit: fit,
		zoomIn: () => zoomBy(1.12),
		zoomOut: () => zoomBy(1 / 1.12),
		resetView: resetView,
		getZoom: () => g.scaleFactor,
		resize() {
			const w = Math.max(320, container.clientWidth || g.width);
			const h = Math.max(240, container.clientHeight || g.height);
			g.resize(w, h);
			layoutEdges();
		},
		exportPNG(name) {
			g.exportToPNG(name || 'jmgraph-flow');
		},
		attachMinimap: attachMinimap,
		nodeAt: nodeAt,
		refresh: () => rebuild(),
		destroy() {
			if (typeof document !== 'undefined' && document && typeof document.removeEventListener === 'function') {
				document.removeEventListener('keydown', keyHandler);
			}
			if (domCanvas && typeof domCanvas.removeEventListener === 'function') {
				domCanvas.removeEventListener('contextmenu', ctxHandler);
			}
			g.destroy();
		}
	};

	rebuild({ fit: true });
	// 便于在控制台调试；默认关闭，避免多实例场景互相覆盖全局引用
	if (options.debug && typeof window !== 'undefined') window.__flowApi = api;
	return api;
}

export { FlowNode, FlowEdge, FlowGrid };
