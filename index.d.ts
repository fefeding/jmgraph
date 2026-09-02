// Type definitions for jmgraph
// ========================

/**
 * 基础坐标点
 */
export interface Point {
  x: number;
  y: number;
  m?: boolean;
}

/**
 * 边界对象
 */
export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * 位置对象
 */
export interface Position {
  left: number;
  top: number;
  width?: number;
  height?: number;
  right?: number;
  bottom?: number;
}

/**
 * 圆角配置（支持数字或四角独立配置）
 */
export type Radius = number | {
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
};

/**
 * 规范化的圆角（四角独立）
 */
export interface NormalizedRadius {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
}

/**
 * 阴影样式
 */
export interface ShadowStyle {
  x: number;
  y: number;
  blur: number;
  color: string;
}

/**
 * 渐变色停止点
 *
 * @example
 * // 偏移量支持 0~1 小数 或 0%~100% 百分比
 * { offset: 0, color: '#e94560' }
 * { offset: 0.5, color: 'rgba(233,69,96,0.8)' }
 * { offset: 1, color: 'blue' }
 *
 * // 字符串格式中，偏移量也可以直接用数值（内部会自动归一化）
 * // 'rgba(233,69,96,0.8) 50'  等价于  { offset: 0.5, color: 'rgba(233,69,96,0.8)' }
 * // '#e94560 50%'              等价于  { offset: 0.5, color: '#e94560' }
 */
export interface GradientStop {
  offset: number;
  color: string;
}

/**
 * 渐变配置（线性或径向）
 *
 * @example
 * // 线性渐变 - 方式一：方向关键词
 * { type: 'linear', x1: '50%', y1: '0%', x2: '50%', y2: '100%' }
 *
 * // 线性渐变 - 方式二：绝对坐标（相对于控件边界）
 * { type: 'linear', x1: 0, y1: 0, x2: 0, y2: 200 }
 *
 * // 径向渐变
 * { type: 'radial', x1: '50%', y1: '50%', x2: '50%', y2: '50%', r1: 0, r2: '50%' }
 */
export interface GradientOptions {
  type?: 'linear' | 'radial';
  /** 起点 x 坐标，支持数字(像素)、百分比字符串(如 '50%')、小数(0~1 自动乘以尺寸) */
  x1?: number | string;
  /** 起点 y 坐标 */
  y1?: number | string;
  /** 终点 x 坐标 */
  x2?: number | string;
  /** 终点 y 坐标 */
  y2?: number | string;
  /** 径向渐变起始半径 */
  r1?: number | string;
  /** 径向渐变结束半径 */
  r2?: number | string;
  /** 形状参数（径向渐变） */
  shape?: 'circle' | 'ellipse';
  /** 位置参数（径向渐变） */
  position?: { x: string | number; y: string | number };
  /** 渐变颜色停止点 */
  stops?: GradientStop[];
}

/**
 * 变换配置
 */
export interface TransformStyle {
  scaleX?: number;
  skewX?: number;
  skewY?: number;
  scaleY?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * 旋转配置
 */
export interface RotationStyle {
  angle: number;
  x?: number | string;
  y?: number | string;
}

/**
 * 控件样式
 */
export interface jmStyle {
  fill?: string | jmGradient;
  fillImage?: string;
  fillStyle?: string;
  stroke?: string;
  strokeStyle?: string;
  close?: boolean;
  lineWidth?: number;
  miterLimit?: number;
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  globalAlpha?: number;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  shadow?: string | ShadowStyle;
  shadowBlur?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  lineDash?: number[] | string;
  lineDashOffset?: number;
  lineType?: 'solid' | 'dotted';
  dashLength?: number;
  filter?: string | jmFilter;
  globalCompositeOperation?: GlobalCompositeOperation;
  rotation?: RotationStyle;
  translate?: { x: number | string; y: number | string };
  transform?: number[] | TransformStyle;
  clipPath?: jmControl;
  mask?: jmControl;
  cursor?: string;
  close?: boolean;
  zIndex?: number | string;
  margin?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
  touchPadding?: number;
  maxWidth?: number;
  lineHeight?: number;
  radius?: number;
  borderRadius?: number;
  lineJoin?: CanvasLineJoin;
  lineCap?: CanvasLineCap;
  color?: string;
  image?: string;
  [key: string]: any;
}

/**
 * jmGraph 构造选项
 */
export interface jmGraphOptions {
  width?: number;
  height?: number;
  mode?: '2d' | 'webgl';
  autoRefresh?: boolean;
  interactive?: boolean;
  style?: jmStyle;
  shapes?: Record<string, new (...args: any[]) => any>;
  /** 缩放范围下限，默认 0.1 */
  minZoom?: number;
  /** 缩放范围上限，默认 10 */
  maxZoom?: number;
  /** 高DPI渲染倍数。false 关闭（性能优先），或指定具体倍数，默认取设备像素比（>=1）或 2 */
  dprScale?: number | false;
  /** 是否启用空间命中索引（大图交互优化），默认 true */
  hitIndex?: boolean;
  /** 空间索引网格单元大小（世界坐标单位），默认 100 */
  hitIndexCellSize?: number;
  [key: string]: any;
}

/**
 * 控件构造参数
 */
export interface jmControlParams {
  style?: jmStyle;
  width?: number | string;
  height?: number | string;
  position?: Point;
  center?: Point;
  start?: Point;
  end?: Point;
  graph?: jmGraph;
  zIndex?: number;
  interactive?: boolean;
  hitArea?: { x: number; y: number; width: number; height: number };
  isRegular?: boolean;
  needCut?: boolean;
  points?: Point[];
  mode?: string;
  radius?: Radius;
  [key: string]: any;
}

/**
 * 路径构造参数
 */
export interface jmPathParams extends jmControlParams {
  points?: Point[];
}

/**
 * 事件参数
 */
export interface jmEventArgs {
  position: Point & {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    layerX: number;
    layerY: number;
    screenX: number;
    screenY: number;
    x: number;
    y: number;
    isTouch: boolean;
    touches?: TouchList;
    isWXMiniApp?: boolean;
  };
  button?: number;
  keyCode?: number;
  ctrlKey?: boolean;
  cancel?: boolean;
  event: Event;
  srcElement?: Element;
  target?: jmControl;
  path?: jmControl[];
  eventName?: string;
  offsetX?: number;
  offsetY?: number;
  trans?: boolean;
}

/**
 * 事件属性变更参数
 */
export interface PropertyChangeArgs {
  oldValue: any;
  newValue: any;
}

/**
 * 基础对象类
 */
export declare class jmObject {
  id: number;
  graph?: jmGraph;

  constructor(g?: any);

  is(type: string | (new (...args: any[]) => any)): boolean;

  animate(handle: (...args: any[]) => boolean | void, millisec?: number, ...params: any[]): void;
}

/**
 * 列表类，扩展自Array
 */
export declare class jmList<T = any> extends Array<T> {
  option: Record<string, any>;
  type: string;

  constructor(items?: T[]);

  add(obj: T | T[]): T | T[];
  remove(obj: T): void;
  removeAt(index: number): void;
  contain(obj: T): boolean;
  get(index: number | ((item: T, index: number) => boolean)): T | undefined;
  each(cb: (index: number, item: T) => boolean | void, inverse?: boolean): void;
  count(handler?: (item: T) => boolean): number;
  clear(): void;
  sort(compareFn?: (a: T, b: T) => number): number;
  splice(start: number, deleteCount?: number, ...items: T[]): T[];
  includes(searchElement: T, fromIndex?: number): boolean;
  find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
}

/**
 * 属性基类
 */
export declare class jmProperty extends jmObject {
  constructor(params?: { mode?: string });

  property(name: string): any;
  property(name: string, value: any): any;

  needUpdate: boolean;
  graph: jmGraph;
  mode: '2d' | 'webgl';

  requestAnimationFrame(handler: FrameRequestCallback): number;
  cancelAnimationFrame(handler: number): void;

  on(name: string, handle: (...args: any[]) => any): void;
  bind(name: string, handle: (...args: any[]) => any): void;
  unbind(name: string, handle?: (...args: any[]) => any): void;
  emit(name: string, ...args: any[]): this;
  getEvent(name: string): jmList;
  runEventHandle(name: string, args: any[]): boolean | undefined;
}

/**
 * 控件基类
 */
export declare class jmControl extends jmProperty {
  constructor(params?: jmControlParams, t?: string);

  readonly type: string;
  context: CanvasRenderingContext2D;
  style: jmStyle;
  visible: boolean;
  interactive: boolean;
  hitArea: { x: number; y: number; width: number; height: number } | null;
  children: jmList<jmControl>;
  width: number | string;
  height: number | string;
  zIndex: number;
  parent: jmControl | null;
  option: jmControlParams;
  cursor: string;
  focused?: boolean;
  bounds: Bounds | null;
  absoluteBounds: Bounds | null;
  location: any;
  points?: Point[];
  destroyed?: boolean;

  initializing(): void;
  setStyle(style?: jmStyle): void;

  getBounds(isReset?: boolean): Bounds;
  getRotationBounds(rotation?: any, bounds?: Bounds | null): Bounds & { oldBounds?: Bounds };
  getLocation(reset?: boolean): any;
  getRotation(rotation?: any, bounds?: Bounds | null): { angle: number; x?: number; y?: number; bounds?: Bounds };
  getTranslate(translate?: any, bounds?: Bounds | null): { x: number; y: number };

  remove(): void;
  offset(x: number, y: number, trans?: boolean, evt?: any): void;

  getAbsoluteBounds(): Bounds;
  toAbsolutePoint(point: Point): Point;
  toLocalPosition(point: Point): Point | false;

  beginDraw(): void;
  endDraw(): void;
  draw(): void;
  paint(v?: boolean): void;
  initPoints?(): Point[];

  bind(name: string, handle: (...args: any[]) => any): void;
  on(name: string, handle: (...args: any[]) => any): void;
  unbind(name: string, handle?: (...args: any[]) => any): void;
  emit(name: string, ...args: any[]): this;
  getEvent(name: string): jmList;
  runEventHandle(name: string, args: any[]): boolean | undefined;

  checkPoint(p: Point, pad?: number): boolean;
  raiseEvent(name: string, args: any): boolean | undefined;
  runEventAndPopEvent(name: string, args: any): void;
  clearEvents(name: string): void;

  findParent(type: string | (new (...args: any[]) => any)): jmControl | null;
  canMove(m: boolean, graph?: jmGraph): this;
}

/**
 * 基础路径类
 */
export declare class jmPath extends jmControl {
  constructor(params?: jmPathParams, t?: string);

  points: Point[];

  toSVG(): string;
}

/**
 * 圆弧图形
 */
export declare class jmArc extends jmPath {
  constructor(params?: jmControlParams & {
    center?: Point;
    radius?: number;
    start?: number;
    startAngle?: number;
    end?: number;
    endAngle?: number;
    anticlockwise?: boolean;
    isFan?: boolean;
  }, t?: string);

  center: Point;
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
  isFan: boolean;

  initPoints(): Point[];
}

/**
 * 空心圆弧
 */
export declare class jmHArc extends jmArc {
  constructor(params?: jmControlParams & {
    minRadius?: number;
    maxRadius?: number;
  }, t?: string);

  minRadius: number;
  maxRadius: number;
}

/**
 * 圆形
 */
export declare class jmCircle extends jmArc {
  constructor(params?: jmControlParams & {
    center?: Point;
    radius?: number;
    width?: number;
    height?: number;
  }, t?: string);

  initPoints(): Point[];
  draw(): void;
}

/**
 * 椭圆
 */
export declare class jmEllipse extends jmArc {
  constructor(params?: jmControlParams & {
    center?: Point;
    width?: number;
    height?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
  }, t?: string);

  initPoints(): Point[];
}

/**
 * 直线
 */
export declare class jmLine extends jmPath {
  constructor(params?: jmControlParams & {
    start?: Point;
    end?: Point;
    lineType?: 'solid' | 'dotted';
    dashLength?: number;
  }, t?: string);

  start: Point;
  end: Point;

  initPoints(): Point[];
}

/**
 * 矩形
 */
export declare class jmRect extends jmPath {
  constructor(params?: jmControlParams & {
    radius?: Radius;
  }, t?: string);

  radius: Radius;
  position: Point;

  getNormalizedRadius(): NormalizedRadius;
  hasRadius(): boolean;
  getBounds(isReset?: boolean): Bounds;
  initPoints(): Point[];
}

/**
 * 箭头
 */
export declare class jmArrow extends jmPath {
  constructor(params?: jmControlParams & {
    start?: Point;
    end?: Point;
    angle?: number;
    offsetX?: number;
    offsetY?: number;
  }, t?: string);

  start: Point;
  end: Point;
  angle: number;
  offsetX: number;
  offsetY: number;

  initPoints(): Point[];
}

/**
 * 带箭头直线
 */
export declare class jmArrowLine extends jmLine {
  constructor(params?: jmControlParams & {
    start?: Point;
    end?: Point;
  }, t?: string);

  arrow: jmArrow;
  arrowVisible?: boolean;

  initPoints(): Point[];
}

/**
 * 贝塞尔曲线
 */
export declare class jmBezier extends jmPath {
  constructor(params?: jmPathParams, t?: string);

  cpoints: Point[];

  initPoints(): Point[];
  getPoint(ps: Point[], t: number): Point;
  offset(x: number, y: number, trans?: boolean): void;
}

/**
 * 棱形
 */
export declare class jmPrismatic extends jmPath {
  constructor(params?: jmControlParams & {
    center?: Point;
  }, t?: string);

  center: Point;

  initPoints(): Point[];
}

/**
 * 文字标签
 */
export declare class jmLabel extends jmControl {
  constructor(params?: jmControlParams & {
    text?: string;
    value?: string;
    center?: Point;
  }, t?: string);

  text: string;
  center: Point | null;
  position: Point;

  getLocation(): any;
  initPoints(): Point[];
  testSize(): { width: number; height: number };
  wrapText(text: string, maxWidth: number): string[];
  draw(): void;
  endDraw(): void;
}

/**
 * 图片控件
 */
export declare class jmImage extends jmControl {
  constructor(params?: jmControlParams & {
    image?: string | HTMLImageElement;
    sourcePosition?: Point;
    sourceWidth?: number;
    sourceHeight?: number;
    fill?: string;
  }, t?: string);

  sourcePosition: Point;
  sourceWidth: number;
  sourceHeight: number;
  image: string | HTMLImageElement;
}

/**
 * 可缩放控件
 */
export declare class jmResize extends jmRect {
  constructor(params?: jmControlParams & {
    resizable?: boolean;
    movable?: boolean;
    rectSize?: number;
  }, t?: string);

  resizable: boolean;
  movable: boolean;
  rectSize: number;
}

/**
 * 多边形
 */
export declare class jmPolygon extends jmPath {
  constructor(params?: jmControlParams & {
    sides?: number;
    radius?: number;
    center?: Point;
  }, t?: string);

  sides: number;
  radius: number;
  center: Point;

  initPoints(): Point[];
}

/**
 * 星形
 */
export declare class jmStar extends jmPath {
  constructor(params?: jmControlParams & {
    points?: number;
    radius?: number;
    innerRadius?: number;
    center?: Point;
  }, t?: string);

  pointsCount: number;
  radius: number;
  innerRadius: number;
  center: Point;

  initPoints(): Point[];
}

/**
 * 阴影对象
 */
export declare class jmShadow {
  x: number;
  y: number;
  blur: number;
  color: string;

  constructor(x: number | string, y?: number, blur?: number, color?: string);

  fromString(s: string): this;
  toString(): string;
}

/**
 * 渐变对象
 *
 * 支持完整的 CSS 渐变语法解析，同时也可以通过对象参数或方法链式调用创建渐变。
 *
 * @example
 * // ===== 方式一：CSS 字符串格式 =====
 *
 * // 角度格式（deg/rad/grad/turn）
 * const g1 = new jmGradient('linear-gradient(180deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)');
 *
 * // 方向关键词
 * const g2 = new jmGradient('linear-gradient(to top, #e94560, #00d4ff)');
 * const g3 = new jmGradient('linear-gradient(to right bottom, #ffd93d, #e94560)');
 *
 * // 坐标格式（x1 y1 x2 y2）—— 注意坐标用空格分隔
 * const g4 = new jmGradient('linear-gradient(50% 0 50% 100%, rgba(36,159,218,0) 1, rgba(36,159,218,0.8) 0)');
 *
 * // 径向渐变
 * const g5 = new jmGradient('radial-gradient(circle, #e94560, #8b5cf6)');
 * const g6 = new jmGradient('radial-gradient(ellipse at top, #06b6d4, #8b5cf6)');
 *
 * // ===== 方式二：对象参数 =====
 * const g7 = new jmGradient({
 *   type: 'linear',
 *   x1: '50%', y1: '0%',
 *   x2: '50%', y2: '100%',
 *   stops: [
 *     { offset: 0, color: 'rgba(36,159,218,0)' },
 *     { offset: 1, color: 'rgba(36,159,218,0.8)' }
 *   ]
 * });
 *
 * // ===== 方式三：链式调用 =====
 * const g8 = new jmGradient();
 * g8.type = 'linear';
 * g8.x1 = '50%'; g8.y1 = '0%';
 * g8.x2 = '50%'; g8.y2 = '100%';
 * g8.addStop(0, '#e94560');
 * g8.addStop(1, '#00d4ff');
 *
 * // ===== 方式四：使用 jmGraph 便捷方法 =====
 * const lg = graph.createLinearGradient(0, 0, 0, 100);
 * lg.addStop(0, '#e94560');
 * lg.addStop(1, '#00d4ff');
 *
 * const rg = graph.createRadialGradient(100, 100, 0, 100, 100, 50);
 * rg.addStop(0, '#ffd93d');
 * rg.addStop(1, '#f59e0b');
 *
 * @example
 * // ===== 应用到图形样式 =====
 * const rect = graph.createShape('rect', {
 *   position: { x: 100, y: 100 }, width: 200, height: 100,
 *   style: { fill: 'linear-gradient(180deg, #e94560 0%, #00d4ff 100%)' }
 * });
 *
 * // 也可以传 jmGradient 实例
 * rect.style.fill = g1;
 */
export declare class jmGradient {
  /** 渐变类型：'linear' 线性渐变 | 'radial' 径向渐变 */
  type: 'linear' | 'radial';
  /**
   * 起点/终点坐标，支持多种格式：
   * - 数字：绝对像素值
   * - 百分比字符串（如 '50%'）：相对于控件边界尺寸
   * - 0~1 小数：自动乘以控件尺寸
   */
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
  /** 径向渐变半径 */
  r1?: number | string;
  r2?: number | string;
  /** 径向渐变形状（'circle' | 'ellipse'） */
  shape?: string;
  /** 径向渐变中心位置 */
  position?: { x: string | number; y: string | number };
  /** 颜色停止点列表 */
  stops: jmList<GradientStop>;

  /**
   * 构造函数
   * @param opt 渐变字符串（CSS格式）或渐变配置对象
   *
   * @example
   * new jmGradient('linear-gradient(180deg, #e94560 0%, #00d4ff 100%)')
   * new jmGradient({ type: 'linear', x1: 0, y1: 0, x2: 0, y2: 100, stops: [...] })
   */
  constructor(opt?: string | GradientOptions);

  /**
   * 添加颜色停止点
   * @param offset 偏移量（0~1 之间）
   * @param color 颜色值，支持 hex、rgb/rgba、hsl/hsla、命名颜色
   */
  addStop(offset: number, color: string): void;

  /**
   * 生成 canvas/WebGL 可用的渐变对象
   * @param control 当前渐变对应的控件
   */
  toGradient(control: jmControl): any;

  /**
   * 从 CSS 渐变字符串解析渐变参数
   * @param s CSS 渐变字符串
   *
   * @example
   * gradient.fromString('linear-gradient(180deg, #e94560 0%, #00d4ff 100%)');
   * gradient.fromString('radial-gradient(circle, #e94560, #8b5cf6)');
   * gradient.fromString('linear-gradient(50% 0 50% 100%, rgba(36,159,218,0) 1, rgba(36,159,218,0.8) 0)');
   */
  fromString(s: string): void;

  /**
   * 转换为渐变字符串表达
   * @returns 线性: 'linear-gradient(x1 y1 x2 y2, color1 offset, color2 offset, ...)'
   *          径向: 'radial-gradient(x1 y1 r1 x2 y2 r2, color1 offset, color2 offset, ...)'
   */
  toString(): string;

  /**
   * 验证渐变配置是否有效
   * @returns 是否包含必要的渐变参数和至少一个颜色停止点
   */
  isValid(): boolean;
}

/**
 * CSS滤镜对象
 */
export declare class jmFilter {
  filters: Array<{ name: string; value: number }>;

  constructor(opt?: string | Record<string, number>);

  addFilter(name: string, value: number | string): void;
  fromString(s: string): void;
  toString(): string;
  toCanvasFilter(): string;
  has(name: string): boolean;
  get(name: string): number | undefined;
  remove(name: string): void;
  clear(): void;
}

/**
 * 工具类
 */
export declare class jmUtils {
  static clone(source: any, target?: any | boolean, deep?: boolean, copyHandler?: Function): any;
  static bindEvent(target: any, name: string, fun: EventListener, opt?: any): { name: string; target: any; fun: EventListener };
  static removeEvent(target: any, name: string, fun: EventListener): void;
  static getElementPosition(el: Element): { top: number; left: number };
  static getEventPosition(evt: any, scale?: Point): Point & {
    pageX: number;
    pageY: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
    layerX: number;
    layerY: number;
    screenX: number;
    screenY: number;
    isTouch: boolean;
    touches?: TouchList;
    isWXMiniApp?: boolean;
  };
  static isType(target: any, type: new (...args: any[]) => any): boolean;
  static pointInPolygon(pt: Point, polygon: Point[], offset?: number): number;
  static pointOnLine(pt: Point, p1: Point, p2: Point, offset: number): number;
  static checkOutSide(parentBounds: Bounds, targetBounds: Bounds, offset: Point): { left: number; right: number; top: number; bottom: number };
  static rotatePoints(p: Point[] | Point, rp: Point, r: number): Point[] | Point;
  static trimStart(source: string, c?: string): string;
  static trimEnd(source: string, c?: string): string;
  static trim(source: string, c?: string): string;
  static checkPercent(per: string): string | undefined;
  static percentToNumber(per: string): number;
  static hexToNumber(h: string): number;
  static numberToHex(v: number): string;
  static hexToRGBA(hex: string): string | { r: number; g: number; b: number; a: number };
  static rgbToDecimal(color: { r: number; g: number; b: number; a: number }): { r: number; g: number; b: number; a: number };
  static toColor(r: string | number | { r: number; g: number; b: number; a?: number }, g?: number, b?: number, a?: number): string;
  static requestAnimationFrame(callback: FrameRequestCallback, win?: any): number;
  static cancelAnimationFrame(handler: number, win?: any): void;
}

/**
 * 事件处理器
 */
export declare class jmEvents {
  container: jmGraph;
  target: any;

  constructor(container: jmGraph, target?: any);

  touchStart(evt: any): boolean | undefined;
  touchMove(evt: any): boolean | undefined;
  touchEnd(evt: any): boolean | undefined;
  touchCancel(evt: any): boolean | undefined;
  tap(evt: any): boolean | undefined;
  destroy(): void;
}

/**
 * 已注册的图形类型映射
 */
export type ShapeTypes = {
  'path': typeof jmPath;
  'arc': typeof jmArc;
  'arrow': typeof jmArrow;
  'arrowline': typeof jmArrowLine;
  'bezier': typeof jmBezier;
  'circle': typeof jmCircle;
  'harc': typeof jmHArc;
  'line': typeof jmLine;
  'prismatic': typeof jmPrismatic;
  'rect': typeof jmRect;
  'image': typeof jmImage;
  'img': typeof jmImage;
  'label': typeof jmLabel;
  'resize': typeof jmResize;
  'ellipse': typeof jmEllipse;
  'polygon': typeof jmPolygon;
  'star': typeof jmStar;
};

/**
 * jmGraph 画图类库主类
 */
/**
 * 视口管理器：统一负责缩放/平移/坐标转换/视口剔除
 */
export declare class jmViewport {
  width: number;
  height: number;
  scaleFactor: number;
  translation: { x: number; y: number };
  minZoom: number;
  maxZoom: number;
  /** 变换版本号，任何缩放/平移变化都会自增 */
  readonly stamp: number;
  /** 是否发生过缩放或平移 */
  readonly transformed: boolean;

  constructor(width?: number, height?: number, option?: {
    scaleFactor?: number;
    x?: number;
    y?: number;
    minZoom?: number;
    maxZoom?: number;
  });

  reset(): this;
  pan(dx: number, dy: number): this;
  zoomAt(zoom: number, cx?: number, cy?: number): this;
  setTranslation(x: number, y: number): this;
  clampZoom(zoom: number): number;
  screenToWorld(p: Point): Point;
  worldToScreen(p: Point): Point;
  worldRectToScreen(bounds: Bounds): Bounds;
  getVisibleWorldRect(): Bounds;
  isVisible(bounds: Bounds, pad?: number): boolean;
  containsPoint(p: Point): boolean;
  fitBounds(bounds: Bounds, padding?: number): this;
  toJSON(): { scaleFactor: number; translation: Point; width: number; height: number };
}

/**
 * 空间命中索引（均匀网格），用于大图事件命中加速
 */
export declare class jmSpatialIndex {
  cellSize: number;
  readonly size: number;

  constructor(cellSize?: number);

  upsert(control: jmControl): void;
  remove(control: jmControl): void;
  query(p: Point): Set<jmControl> | null;
  queryRect(rect: Bounds): Set<jmControl>;
  clear(): void;
}

/**
 * 渲染器抽象基类
 */
export declare class jmRenderer {
  graph: jmGraph;
  constructor(graph: jmGraph);
  readonly context: CanvasRenderingContext2D | any;
  begin(): void;
  end(): void;
  clear(w: number, h: number): void;
  save(): void;
  restore(): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  fill(): void;
  stroke(): void;
}

/**
 * Canvas 2D 渲染器
 */
export declare class Canvas2DRenderer extends jmRenderer {
}

/**
 * 平台适配层（浏览器/微信小程序/Node 差异隔离）
 */
export declare class jmPlatform {
  static isWX(): boolean;
  static getDocument(): Document | null;
  static getWindow(): Window | null;
  static getDevicePixelRatio(): number;
  static resolveCanvas(canvas: HTMLElement | string): HTMLElement | null;
  static createCanvas(): HTMLCanvasElement | null;
  static createObjectURL(blob: Blob): string;
  static revokeObjectURL(url: string): void;
  static download(url: string, fileName: string): void;
}

export declare class jmGraph extends jmControl {
  constructor(canvas: HTMLElement | string, option?: jmGraphOptions | ((graph: jmGraph) => void), callback?: (graph: jmGraph) => void);

  option: jmGraphOptions & Record<string, any>;
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  mode: '2d' | 'webgl';
  scaleFactor: number;
  translation: Point;
  devicePixelRatio: number;
  dprScaleSize: number;
  isWXMiniApp?: boolean;
  shapes: Record<string, new (...args: any[]) => any>;
  eventHandler: jmEvents;
  util: typeof jmUtils;
  utils: typeof jmUtils;
  normalSize?: { width: number; height: number };
  scaleSize?: { x: number; y: number };
  destroyed?: boolean;
  /** 视口管理器（缩放/平移/坐标转换/视口剔除的唯一入口） */
  viewport: jmViewport;
  /** 空间命中索引（option.hitIndex === false 时为 null） */
  hitIndex: jmSpatialIndex | null;
  /** 渲染器实例 */
  renderer: jmRenderer;

  static create(...args: ConstructorParameters<typeof jmGraph>): jmGraph;

  resize(w?: number, h?: number): void;
  getPosition(): Position;
  registerShape(name: string, shape: new (...args: any[]) => any): void;
  createShape<T extends jmControl = jmControl>(shape: string | (new (...args: any[]) => T), args?: any): T;
  createShadow(x: number, y: number, blur: number, color: string): jmShadow;
  createLinearGradient(x1: number, y1: number, x2: number, y2: number, stops?: GradientStop[]): jmGradient;
  createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number, stops?: GradientStop[]): jmGradient;
  refresh(): void;
  redraw(w?: number, h?: number): void;
  clear(w?: number, h?: number): void;
  css(name: string, value?: string): string | undefined;
  createPath(points: Point[], style?: jmStyle, option?: object): jmPath;
  createLine(start: Point, end: Point, style?: jmStyle): jmLine;
  zoomOut(): void;
  zoomIn(): void;
  zoomActual(): void;
  scale(dx: number, dy: number): void;
  setZoom(zoom: number, x?: number, y?: number): this;
  pan(dx: number, dy: number): this;
  resetTransform(): this;
  screenToWorld(point: Point): Point;
  worldToScreen(point: Point): Point;
  getContentBounds(filter?: (shape: jmControl) => boolean): Bounds | null;
  fitView(padding?: number, filter?: (shape: jmControl) => boolean): this;
  toDataURL(): string;
  exportToPNG(fileName?: string, format?: string, quality?: number): void;
  exportToJPEG(fileName?: string, quality?: number): void;
  exportToSVG(fileName?: string): void;
  toSVG(): string;
  autoRefresh(callback?: () => void): this;
  destroy(): void;
}

/**
 * 创建 jmGraph 实例的便捷函数
 */
export declare function create(...args: ConstructorParameters<typeof jmGraph>): jmGraph;

// ===================== 官方组件（流程图 / flow-graph） =====================

/** 组件生命周期状态机常量 */
export declare const STATE: Record<string, string>;

/** 组件默认配置 */
export declare const DEFAULT_OPTIONS: any;

/** 组件基类（FlowGraphComponent 等可子类化） */
export declare class ComponentBase {
  constructor(options?: any);
  mount(container: string | HTMLElement): void;
  update(partial: any): void;
  destroy(): void;
  on(event: string, fn: (...args: any[]) => void): () => void;
  [key: string]: any;
}

/** 流程图组件实例 */
export declare class FlowGraphComponent extends ComponentBase {
  graph: jmGraph;
  errors: any[];
  stage?: any;
}

/** 创建并挂载流程图组件 */
export declare function createFlowGraph(container: string | HTMLElement, options?: any): FlowGraphComponent;

/** 底层工厂（无生命周期托管） */
export declare function createFlowGraphCore(container: string | HTMLElement, options?: any): any;

/** 节点类型元数据 */
export declare const NODE_TYPES: Array<{ type: string; label: string; icon: string; desc: string }>;
/** 运行状态元数据 */
export declare const STATUS_META: Record<string, { label: string; color: string; glyph: string }>;
/** 类型配色 */
export declare const typeColor: Record<string, string>;

export declare function normalizeOptions(options?: any): any;
export declare function resolveContainer(container: string | HTMLElement): HTMLElement | null;
export declare function validateStages(stages: any): any;
export declare function measureContainer(el: HTMLElement): { width: number; height: number };
export declare function computeLevels(stages: any): Map<string, number>;
export declare function computeLayout(stages: any, opts?: any): any;
export declare function edgeLabel(edge: any): string;
export declare function anchor(side: string, bounds: any): any;

export declare class FlowNode extends jmControl {
  constructor(params?: any, t?: string);
}
export declare class FlowEdge extends jmPath {
  constructor(params?: any, t?: string);
}
export declare class FlowGrid extends jmPath {
  constructor(params?: any, t?: string);
}

export default jmGraph;
