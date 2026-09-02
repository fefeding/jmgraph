/**
 * jmGraph 官方组件（流程图）类型声明
 *
 * 与 `src/components/index.js` 的导出保持一一对应：
 * - 入口路径：`jmgraph/components`
 * - 覆盖：FlowGraphComponent / ComponentBase / createFlowGraph /
 *   normalize 工具 / 布局算法 / NODE_TYPES / STATUS_META / 各类数据结构
 *
 * @module jmgraph/components
 * @license MIT
 */

// ==================== 基础类型 ====================

/** 内置节点类型；允许传入自定义类型字符串（此时按未知类型渲染） */
export type FlowNodeType =
	| 'fetch'
	| 'script'
	| 'transform'
	| 'custom'
	| 'agent'
	| (string & {});

/** 交互模式 */
export type FlowMode = 'view' | 'edit';

/** 节点运行状态 */
export type RunStatus =
	| 'idle'
	| 'pending'
	| 'running'
	| 'success'
	| 'failed'
	| 'skipped';

/** 节点输入/输出项 */
export interface StageIO {
	/** 上游引用，形如 `${source}.${port}` */
	from?: string;
	/** 常量值（与 from 二选一） */
	value?: string;
	[key: string]: any;
}

/** 流程节点（stage）数据 */
export interface FlowStage {
	/** 唯一 id */
	id: string;
	/** 节点类型，见 NODE_TYPES */
	type?: FlowNodeType;
	/** 展示名称；缺省回退为 id */
	name?: string;
	/** 节点配置（透传，组件不解析） */
	config?: Record<string, any>;
	/** 输入引用 */
	inputs?: StageIO[];
	/** 输出字段 */
	outputs?: Array<string | StageIO>;
	/** 上游依赖 id 列表（DAG 边） */
	dependsOn?: string[];
	/** 重试配置 */
	retry?: { maxRetries?: number };
	/** 拖拽/摆放后的位置（世界坐标，节点左上角）；缺省由布局算法分配 */
	_pos?: { x: number; y: number };
	[key: string]: any;
}

/** 运行状态映射：节点 id -> 状态 */
export type RunStatusMap = Partial<Record<string, RunStatus>>;

/** 布局参数 */
export interface LayoutOptions {
	/** 纵向（层级间）间距 */
	vGap?: number;
	/** 横向（同层节点间）间距 */
	hGap?: number;
	/** 外边距 */
	pad?: number;
}

/** 节点类型元信息 */
export interface NodeTypeMeta {
	type: string;
	label: string;
	icon: string;
	desc: string;
}

/** 运行状态元信息 */
export interface StatusMeta {
	label: string;
	color: string;
	glyph: string;
}

/** 连线描述（对外事件使用的轻量结构） */
export interface FlowEdgeDatum {
	source: string;
	target: string;
	/** 连线标签文本（可能为空字符串） */
	label?: string;
	[key: string]: any;
}

/** 右键菜单命中的对象信息 */
export interface ContextMenuInfo {
	/** 命中类别 */
	type: 'node' | 'edge' | 'pane';
	/** 命中节点 id（type 为 node 时有值） */
	id: string | null;
	/** 命中节点原始 stage 数据 */
	stage: FlowStage | null;
	/** 命中连线（type 为 edge 时有值） */
	edge: FlowEdgeDatum | null;
	/** 命中点世界坐标 */
	x: number;
	y: number;
	/** 浏览器视口坐标 */
	clientX: number;
	clientY: number;
}

// ==================== 配置 ====================

/** 流程图组件配置 */
export interface FlowGraphOptions {
	stages?: FlowStage[];
	mode?: FlowMode;
	/** 挂载后自动适应视图 */
	autoFit?: boolean;
	/** 自动监听容器尺寸变化 */
	autoResize?: boolean;
	width?: number | null;
	height?: number | null;
	/** 透传底层 jmGraph 构造参数（dprScale / hitIndex / minZoom 等） */
	graphOptions?: Record<string, any> | null;
	layout?: LayoutOptions | null;
	/** 调试：将底层 api 挂到 window.__flowApi */
	debug?: boolean;
	onSelect?: (id: string | null) => void;
	onChange?: (stages: FlowStage[]) => void;
	onEdgeClick?: (edge: FlowEdgeDatum) => void;
	onNodeEdit?: (id: string) => void;
	onContextMenu?: (info: ContextMenuInfo) => void;
	onLog?: (msg: string, level?: string) => void;
	onReady?: (instance: FlowGraphComponent) => void;
	onError?: (err: Error, context: string) => void;
}

export const DEFAULT_OPTIONS: FlowGraphOptions;

/** 规范化配置：非法值降级为默认（mode/stages/回调等） */
export function normalizeOptions(options?: Partial<FlowGraphOptions> | null): FlowGraphOptions;

// ==================== 生命周期与事件基类 ====================

export const STATE: {
	CREATED: 'created';
	MOUNTED: 'mounted';
	DESTROYED: 'destroyed';
};

/** 组件基类：生命周期（mount/update/destroy）+ 事件（on/off/emit）运行时基础设施 */
export class ComponentBase {
	constructor(options?: Record<string, any>);

	/** 订阅事件，返回取消订阅函数 */
	on(evt: string, fn: Function): () => void;
	/** 取消订阅；省略 fn 时清空该事件全部回调 */
	off(evt: string, fn?: Function): void;
	/** 触发事件（回调经错误边界包裹） */
	emit(evt: string, ...args: any[]): void;

	mount(container: ContainerType): object | null;
	update(partial: Record<string, any>): this;
	destroy(): void;

	readonly instance: object | null;
	readonly state: string;
	readonly mounted: boolean;
	readonly options: Record<string, any>;
	readonly errors: Array<{ label: string; error: Error; at: number }>;
}

/** 挂载容器：CSS 选择器 / DOM 元素 / 类数组（jQuery 风格） */
export type ContainerType = string | HTMLElement | ArrayLike<HTMLElement>;

/** 容器解析：无法解析时返回 null */
export function resolveContainer(target: ContainerType | null | undefined): HTMLElement | null;

/** stages 校验：仅做 id 存在性与唯一性检查 */
export function validateStages(stages: any): { valid: boolean; warnings: string[] };

/** 取容器可用尺寸（无尺寸时取兜底值） */
export function measureContainer(
	el: HTMLElement | null,
	fallback?: { width?: number; height?: number }
): { width: number; height: number };

// ==================== FlowGraphComponent ====================

/** 流程图组件：生命周期托管 + 配置热更新 + 事件系统 + API 代理 */
export class FlowGraphComponent extends ComponentBase {
	constructor(options?: FlowGraphOptions);

	// ---- 事件（与 options.onXxx 等价，可同时订阅）----
	on(evt: 'select', fn: (id: string | null) => void): () => void;
	on(evt: 'change', fn: (stages: FlowStage[]) => void): () => void;
	on(evt: 'edgeClick', fn: (edge: FlowEdgeDatum) => void): () => void;
	on(evt: 'nodeEdit', fn: (id: string) => void): () => void;
	on(evt: 'contextMenu', fn: (info: ContextMenuInfo) => void): () => void;
	on(evt: 'ready', fn: (instance: FlowGraphComponent) => void): () => void;
	on(evt: 'log', fn: (msg: string, level?: string) => void): () => void;
	on(evt: 'error', fn: (err: Error, context: string) => void): () => void;
	on(evt: string, fn: (...args: any[]) => void): () => void;

	// ---- 数据 ----
	/** 获取当前 stages 快照（与内部模型隔离，修改不影响画布） */
	getStages(): FlowStage[];
	/** 全量替换 stages */
	setStages(stages: FlowStage[]): void;
	/** 新增节点；返回新 id */
	addStage(type: string, position?: { x: number; y: number }): string;
	/** 删除节点并清理依赖引用 */
	removeStage(id: string): void;
	/** 重命名节点（自动修正依赖引用）；成功返回 true */
	renameStage(id: string, newId: string): boolean;
	/** 局部更新单个节点 */
	updateStage(id: string, patch: Partial<FlowStage>): void;

	// ---- 运行态 ----
	setRunStatus(map: RunStatusMap): void;
	getRunStatus(): RunStatusMap;
	/** 本地模拟执行（拓扑序推进） */
	run(): Promise<any>;
	isRunning(): boolean;
	resetRun(): void;

	// ---- 视图 ----
	autoLayout(): void;
	fit(padding?: number): void;
	zoomIn(): void;
	zoomOut(): void;
	resetView(): void;
	getZoom(): number;
	resize(width?: number, height?: number): void;
	exportPNG(name?: string): void;
	attachMinimap(canvas: HTMLCanvasElement): void;

	// ---- 选中 / 模式 ----
	select(id: string | null): void;
	getSelected(): string | null;
	/** 世界坐标命中测试 -> 节点 id */
	nodeAt(world: { x: number; y: number }): string | null;
	setMode(mode: FlowMode): FlowMode;
	getMode(): FlowMode;

	/** 底层 jmGraph 实例（逃生舱） */
	readonly graph: any;
}

/** 创建并挂载流程图组件；即使挂载失败也返回实例（错误见 onError/errors） */
export function createFlowGraph(container: ContainerType, options?: FlowGraphOptions): FlowGraphComponent;

// ==================== 底层（createFlowGraphCore 返回的原始 api） ====================

/** 底层 createFlowGraph 返回的原始 api（无生命周期托管，高级场景使用） */
export interface FlowGraphApi {
	graph: any;
	setStages(stages: FlowStage[]): void;
	getStages(): FlowStage[];
	setRunStatus(map: RunStatusMap): void;
	getRunStatus(): RunStatusMap;
	setMode(mode: FlowMode): FlowMode;
	getMode(): FlowMode;
	select(id: string | null): void;
	getSelected(): string | null;
	addStage(type: string, position?: { x: number; y: number }): string;
	removeStage(id: string): void;
	renameStage(id: string, newId: string): boolean;
	updateStage(id: string, patch: Partial<FlowStage>): void;
	autoLayout(): void;
	run(): Promise<any>;
	isRunning(): boolean;
	resetRun(): void;
	fit(padding?: number): void;
	zoomIn(): void;
	zoomOut(): void;
	resetView(): void;
	getZoom(): number;
	resize(width?: number, height?: number): void;
	exportPNG(name?: string): void;
	attachMinimap(canvas: HTMLCanvasElement): void;
	nodeAt(world: { x: number; y: number }): any;
	refresh(): void;
	destroy(): void;
}

/** 底层工厂：返回原始 api，无生命周期托管 */
export function createFlowGraphCore(container: ContainerType, options?: FlowGraphOptions): FlowGraphApi;

// ==================== 元数据与算法 ====================

export const NODE_TYPES: NodeTypeMeta[];
export const STATUS_META: Record<RunStatus, StatusMeta>;
/** 节点类型 -> 主题色 */
export const typeColor: Record<string, string>;

/** DAG 最长路径层级（id -> level） */
export function computeLevels(stages: FlowStage[]): Map<string, number>;
/** 竖排分层布局 */
export function computeLayout(
	stages: FlowStage[],
	opts?: LayoutOptions
): { idToPos: Record<string, { x: number; y: number }>; levels: Map<string, number> };
/** 依据 inputs.from 的 `${source}.` 前缀生成连线标签 */
export function edgeLabel(stages: FlowStage[], source: string, target: string): string;
/** 节点边界锚点 */
export function anchor(
	b: { left: number; top: number; right: number; bottom: number; width: number; height: number },
	side: 'top' | 'right' | 'bottom' | 'left'
): { x: number; y: number };

// ==================== 底层图形类（逃生舱场景） ====================

/** 流程图节点图形（jmControl 子类） */
export class FlowNode {
	stage?: FlowStage;
	status?: RunStatus;
	flowRole: 'node';
	editable: boolean;
	[key: string]: any;
}
/** 流程图连线图形（jmPath 子类） */
export class FlowEdge {
	source?: string;
	target?: string;
	flowRole: 'edge';
	hover: boolean;
	active: boolean;
	[key: string]: any;
}
/** 背景网格图形 */
export class FlowGrid {
	[key: string]: any;
}

export default createFlowGraph;
