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
 */
export interface GradientStop {
  offset: number;
  color: string;
}

/**
 * 渐变配置（线性或放射）
 */
export interface GradientOptions {
  type?: 'linear' | 'radial';
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
  r1?: number | string;
  r2?: number | string;
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
 */
export declare class jmGradient {
  type: 'linear' | 'radial';
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
  r1?: number | string;
  r2?: number | string;
  stops: jmList<GradientStop>;

  constructor(opt?: string | GradientOptions);

  addStop(offset: number, color: string): void;
  toGradient(control: jmControl): any;
  fromString(s: string): void;
  toString(): string;
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

export default jmGraph;
