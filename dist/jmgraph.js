(function(_g){(function(f){if(typeof exports==='object'&&typeof module!=='undefined'){module.exports=f()}else if(typeof define==='function'&&define.amd){define([],f.bind(_g))}else{f()}})(function(define,module,exports){var _m =(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.create = void 0;
Object.defineProperty(exports, "jmArc", {
  enumerable: true,
  get: function get() {
    return _jmArc.jmArc;
  }
});
Object.defineProperty(exports, "jmArrow", {
  enumerable: true,
  get: function get() {
    return _jmArrow.jmArrow;
  }
});
Object.defineProperty(exports, "jmArrowLine", {
  enumerable: true,
  get: function get() {
    return _jmArrowLine.jmArrowLine;
  }
});
Object.defineProperty(exports, "jmBezier", {
  enumerable: true,
  get: function get() {
    return _jmBezier.jmBezier;
  }
});
Object.defineProperty(exports, "jmCircle", {
  enumerable: true,
  get: function get() {
    return _jmCircle.jmCircle;
  }
});
Object.defineProperty(exports, "jmControl", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmControl;
  }
});
Object.defineProperty(exports, "jmGradient", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmGradient;
  }
});
exports.jmGraph = void 0;
Object.defineProperty(exports, "jmHArc", {
  enumerable: true,
  get: function get() {
    return _jmHArc.jmHArc;
  }
});
Object.defineProperty(exports, "jmImage", {
  enumerable: true,
  get: function get() {
    return _jmImage.jmImage;
  }
});
Object.defineProperty(exports, "jmLabel", {
  enumerable: true,
  get: function get() {
    return _jmLabel.jmLabel;
  }
});
Object.defineProperty(exports, "jmLine", {
  enumerable: true,
  get: function get() {
    return _jmLine.jmLine;
  }
});
Object.defineProperty(exports, "jmList", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmList;
  }
});
Object.defineProperty(exports, "jmPath", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmPath;
  }
});
Object.defineProperty(exports, "jmPrismatic", {
  enumerable: true,
  get: function get() {
    return _jmPrismatic.jmPrismatic;
  }
});
Object.defineProperty(exports, "jmRect", {
  enumerable: true,
  get: function get() {
    return _jmRect.jmRect;
  }
});
Object.defineProperty(exports, "jmResize", {
  enumerable: true,
  get: function get() {
    return _jmResize.jmResize;
  }
});
Object.defineProperty(exports, "jmShadow", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmShadow;
  }
});
Object.defineProperty(exports, "jmUtils", {
  enumerable: true,
  get: function get() {
    return _jmGraph.jmUtils;
  }
});
var _jmArc = require("./src/shapes/jmArc.js");
var _jmArrow = require("./src/shapes/jmArrow.js");
var _jmBezier = require("./src/shapes/jmBezier.js");
var _jmCircle = require("./src/shapes/jmCircle.js");
var _jmHArc = require("./src/shapes/jmHArc.js");
var _jmLine = require("./src/shapes/jmLine.js");
var _jmPrismatic = require("./src/shapes/jmPrismatic.js");
var _jmRect = require("./src/shapes/jmRect.js");
var _jmArrowLine = require("./src/shapes/jmArrowLine.js");
var _jmImage = require("./src/shapes/jmImage.js");
var _jmLabel = require("./src/shapes/jmLabel.js");
var _jmResize = require("./src/shapes/jmResize.js");
var _jmGraph = require("./src/core/jmGraph.js");
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var shapes = {
  "arc": _jmArc.jmArc,
  "arrow": _jmArrow.jmArrow,
  "bezier": _jmBezier.jmBezier,
  "circle": _jmCircle.jmCircle,
  "harc": _jmHArc.jmHArc,
  "line": _jmLine.jmLine,
  "prismatic": _jmPrismatic.jmPrismatic,
  "rect": _jmRect.jmRect,
  "arrowline": _jmArrowLine.jmArrowLine,
  "image": _jmImage.jmImage,
  "img": _jmImage.jmImage,
  "label": _jmLabel.jmLabel,
  "resize": _jmResize.jmResize
};
var jmGraph = exports.jmGraph = exports["default"] = /*#__PURE__*/function (_jmGraphCore) {
  function jmGraph(canvas, option, callback) {
    var _this;
    _classCallCheck(this, jmGraph);
    var targetType = this instanceof jmGraph ? this.constructor : void 0;

    // 合并shapes
    option = Object.assign({}, option);
    option.shapes = Object.assign(shapes, option.shapes || {});

    //不是用new实例化的话，返回一个promise
    if (!targetType || !(targetType.prototype instanceof _jmGraph.jmGraph)) {
      return _possibleConstructorReturn(_this, new Promise(function (resolve, reject) {
        var g = new jmGraph(canvas, option, callback);
        if (resolve) resolve(g);
      }));
    }
    if (typeof option == 'function') {
      callback = option;
      option = {};
    }
    return _callSuper(this, jmGraph, [canvas, option, callback]);
  }
  _inherits(jmGraph, _jmGraphCore);
  return _createClass(jmGraph, null, [{
    key: "create",
    value: function create() {
      return createJmGraph.apply(void 0, arguments);
    }
  }]);
}(_jmGraph.jmGraph); //创建实例
var createJmGraph = exports.create = function createJmGraph() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return _construct(jmGraph, args);
};

},{"./src/core/jmGraph.js":5,"./src/shapes/jmArc.js":22,"./src/shapes/jmArrow.js":23,"./src/shapes/jmArrowLine.js":24,"./src/shapes/jmBezier.js":25,"./src/shapes/jmCircle.js":26,"./src/shapes/jmHArc.js":27,"./src/shapes/jmImage.js":28,"./src/shapes/jmLabel.js":29,"./src/shapes/jmLine.js":30,"./src/shapes/jmPrismatic.js":31,"./src/shapes/jmRect.js":32,"./src/shapes/jmResize.js":33}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmControl = exports["default"] = void 0;
var _jmUtils = require("./jmUtils.js");
var _jmList = require("./jmList.js");
var _jmGradient = require("./jmGradient.js");
var _jmShadow = require("./jmShadow.js");
var _jmProperty2 = require("./jmProperty.js");
var _path = _interopRequireDefault(require("../lib/webgl/path.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
//样式名称，也当做白名单使用		
var jmStyleMap = {
  'fill': 'fillStyle',
  'fillImage': 'fillImage',
  'stroke': 'strokeStyle',
  'shadow.blur': 'shadowBlur',
  'shadow.x': 'shadowOffsetX',
  'shadow.y': 'shadowOffsetY',
  'shadow.color': 'shadowColor',
  'lineWidth': 'lineWidth',
  'miterLimit': 'miterLimit',
  'fillStyle': 'fillStyle',
  'strokeStyle': 'strokeStyle',
  'font': 'font',
  'opacity': 'globalAlpha',
  'textAlign': 'textAlign',
  'textBaseline': 'textBaseline',
  'shadowBlur': 'shadowBlur',
  'shadowOffsetX': 'shadowOffsetX',
  'shadowOffsetY': 'shadowOffsetY',
  'shadowColor': 'shadowColor',
  'lineJoin': 'lineJoin',
  //线交汇处的形状,miter(默认，尖角),bevel(斜角),round（圆角）
  'lineCap': 'lineCap' //线条终端点,butt(默认，平),round(圆),square（方）
};

/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @extends jmProperty
 */
var jmControl = exports.jmControl = exports["default"] = /*#__PURE__*/function (_jmProperty) {
  function jmControl(params, t) {
    var _this2;
    _classCallCheck(this, jmControl);
    params = params || {};
    _this2 = _callSuper(this, jmControl, [params]);
    _this2.property('type', t || (this instanceof jmControl ? this.constructor : void 0).name);
    _this2.style = params && params.style ? params.style : {};
    //this.position = params.position || {x:0,y:0};
    _this2.width = params.width || 0;
    _this2.height = params.height || 0;
    if (params.position) {
      _this2.position = params.position;
    }
    _this2.graph = params.graph || null;
    _this2.zIndex = params.zIndex || 0;
    _this2.interactive = typeof params.interactive == 'undefined' ? false : params.interactive;

    // webgl模式
    if (_this2.mode === 'webgl') {
      _this2.webglControl = new _path["default"](_this2.graph, {
        style: _this2.style,
        control: _this2,
        isRegular: params.isRegular,
        needCut: params.needCut
      });
    }
    _this2.initializing();
    _this2.on = _this2.bind;
    _this2.option = params;
    return _this2;
  }

  //# region 定义属性
  /**
   * 当前对象类型名jmRect
   *
   * @property type
   * @type string
   */
  _inherits(jmControl, _jmProperty);
  return _createClass(jmControl, [{
    key: "type",
    get: function get() {
      return this.property('type');
    }

    /**
     * 当前canvas的context
     * @property context
     * @type {object}
     */
  }, {
    key: "context",
    get: function get() {
      var s = this.property('context');
      if (s) return s;else if (this.is('jmGraph') && this.canvas && this.canvas.getContext) {
        return this.context = this.canvas.getContext(this.mode || '2d');
      }
      var g = this.graph;
      if (g) return g.context;
      return g.canvas.getContext(this.mode || '2d');
    },
    set: function set(v) {
      return this.property('context', v);
    }

    /**
     * 样式
     * @property style
     * @type {object}
     */
  }, {
    key: "style",
    get: function get() {
      var s = this.property('style');
      if (!s) s = this.property('style', {});
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('style', v);
    }

    /**
     * 当前控件是否可见
     * @property visible
     * @default true
     * @type {boolean}
     */
  }, {
    key: "visible",
    get: function get() {
      var s = this.property('visible');
      if (typeof s == 'undefined') s = this.property('visible', true);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('visible', v);
    }

    /**
     * 当前控件是否是交互式的，如果是则会响应鼠标或touch事件。
     * 如果false则不会主动响应，但冒泡的事件依然会得到回调
     * @property interactive
     * @default false
     * @type {boolean}
     */
  }, {
    key: "interactive",
    get: function get() {
      var s = this.property('interactive');
      return s;
    },
    set: function set(v) {
      return this.property('interactive', v);
    }

    /**
     * 当前控件的子控件集合
     * @property children
     * @type {list}
     */
  }, {
    key: "children",
    get: function get() {
      var s = this.property('children');
      if (!s) s = this.property('children', new _jmList.jmList());
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('children', v);
    }

    /**
     * 宽度
     * @property width
     * @type {number}
     */
  }, {
    key: "width",
    get: function get() {
      var s = this.property('width');
      if (typeof s == 'undefined') s = this.property('width', 0);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('width', v);
    }

    /**
     * 高度
     * @property height
     * @type {number}
     */
  }, {
    key: "height",
    get: function get() {
      var s = this.property('height');
      if (typeof s == 'undefined') s = this.property('height', 0);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('height', v);
    }

    /**
     * 控件层级关系，发生改变时，需要重新调整排序
     * @property zIndex
     * @type {number}
     */
  }, {
    key: "zIndex",
    get: function get() {
      var s = this.property('zIndex');
      if (!s) s = this.property('zIndex', 0);
      return s;
    },
    set: function set(v) {
      this.property('zIndex', v);
      this.children.sort(); //层级发生改变，需要重新排序
      this.needUpdate = true;
      return v;
    }

    /**
     * 设置鼠标指针
     * css鼠标指针标识,例如:pointer,move等
     * 
     * @property cursor
     * @type {string}
     */
  }, {
    key: "cursor",
    get: function get() {
      var graph = this.graph;
      if (graph) {
        return graph.css('cursor');
      }
    }

    //# end region

    /**
     * 初始化对象，设定样式，初始化子控件对象
     * 此方法为所有控件需调用的方法
     *
     * @method initializing
     * @for jmControl
     */,
    set: function set(cur) {
      var graph = this.graph;
      if (graph) {
        graph.css('cursor', cur);
      }
    }
  }, {
    key: "initializing",
    value: function initializing() {
      var self = this;
      //定义子元素集合
      this.children = this.children || new _jmList.jmList();
      var oadd = this.children.add;
      //当把对象添加到当前控件中时，设定其父节点
      this.children.add = function (obj) {
        if (_typeof(obj) === 'object') {
          if (obj.parent && obj.parent != self && obj.parent.children) {
            obj.parent.children.remove(obj); //如果有父节点则从其父节点中移除
          }
          obj.parent = self;
          //如果存在先移除
          if (this.contain(obj)) {
            this.oremove(obj);
          }
          oadd.call(this, obj);
          obj.emit('add', obj);
          self.needUpdate = true;
          if (self.graph) obj.graph = self.graph;
          this.sort(); //先排序
          //self.emit('addChild', obj);
          return obj;
        }
      };
      this.children.oremove = this.children.remove;
      //当把对象从此控件中移除时，把其父节点置为空
      this.children.remove = function (obj) {
        if (_typeof(obj) === 'object') {
          obj.parent = null;
          obj.graph = null;
          obj.remove(true);
          this.oremove(obj);
          self.needUpdate = true;
          //self.emit('removeChild', obj, index);
        }
      };
      /**
       * 根据控件zIndex排序，越大的越高
       */
      //const osort = this.children.sort;
      this.children.sort = function () {
        var levelItems = {};
        //提取zindex大于0的元素
        //为了保证0的层级不改变，只能把大于0的提出来。
        this.each(function (i, obj) {
          if (!obj) return;
          var zindex = obj.zIndex;
          if (!zindex && obj.style && obj.style.zIndex) {
            zindex = Number(obj.style.zIndex);
            if (isNaN(zindex)) zindex = obj.style.zIndex || 0;
          }
          var items = levelItems[zindex] || (levelItems[zindex] = []);
          items.push(obj);
        });
        this.splice(0, this.length);
        for (var index in levelItems) {
          oadd.call(this, levelItems[index]);
        }
        /*
        osort.call(this, (c1, c2) => {
        	let zindex1 = c1.zIndex || c1.style.zIndex || 0;
        	let zindex2 = c2.zIndex || c2.style.zIndex || 0;
        	return zindex1 - zindex2;
        });*/
      };
      this.children.clear = function () {
        this.each(function (i, obj) {
          this.remove(obj);
        }, true);
      };
      this.needUpdate = true;
    }

    /**
     * 设定样式到context
     * 处理样式映射，转换渐变和阴影对象为标准canvas属性
     * 样式一览
    	| 简化名称 | 原生名称 | 说明
    	| :- | :- | :- | 
    	| fill | fillStyle | 用于填充绘画的颜色、渐变或模式
    	| stroke | strokeStyle | 用于笔触的颜色、渐变或模式
    	| shadow | 没有对应的 | 最终会解析成以下几个属性，格式：'0,0,10,#fff'或g.createShadow(0,0,20,'#000');
    	| shadow.blur | shadowBlur | 用于阴影的模糊级别
    	| shadow.x | shadowOffsetX | 阴影距形状的水平距离
    	| shadow.y | shadowOffsetY | 阴影距形状的垂直距离
    	| shadow.color | shadowColor | 阴影颜色，格式：'#000'、'#46BF86'、'rgb(255,255,255)'或'rgba(39,72,188,0.5)'
    	| lineWidth | lineWidth | 当前的线条宽度
    	| miterLimit | miterLimit | 最大斜接长度
    	| font | font | 请使用下面的 fontSize 和 fontFamily
    	| fontSize | font | 字体大小
    	| fontFamily | font | 字体
    	| opacity | globalAlpha | 绘图的当前 alpha 或透明值
    	| textAlign | textAlign | 文本内容的当前对齐方式
    	| textBaseline | textBaseline | 在绘制文本时使用的当前文本基线
    	| lineJoin | lineJoin | 两条线相交时，所创建的拐角类型：miter(默认，尖角),bevel(斜角),round（圆角）
    	| lineCap | lineCap | 线条的结束端点样式：butt(默认，平),round(圆),square（方）
     * 
     * @method setStyle
     * @for jmControl
     * @private
     * @param {style} style 样式对象，如:{fill:'black',stroke:'red'}
     */
  }, {
    key: "setStyle",
    value: function setStyle(style) {
      var _this3 = this;
      style = style || _jmUtils.jmUtils.clone(this.style, true);
      if (!style) return;

      /**
       * 样式设定
       * 
       * @method __setStyle
       * @private
       * @param {jmControl} control 当前样式对应的控件对象
       * @param {style} style 样式
       * @param {string} name 样式名称
       * @param {string} mpkey 样式名称在映射中的key(例如：shadow.blur为模糊值)
       */
      var _setStyle = function __setStyle(style, name, mpkey) {
        if (style) {
          var styleValue = style;
          if (typeof styleValue === 'function') {
            try {
              styleValue = styleValue.call(_this3);
            } catch (e) {
              console.warn(e);
              return;
            }
          }
          var t = _typeof(styleValue);
          var mpname = jmStyleMap[mpkey || name];

          //如果为渐变对象
          if (styleValue instanceof _jmGradient.jmGradient || t == 'string' && styleValue.indexOf('-gradient') > -1) {
            //如果是渐变，则需要转换
            if (t == 'string' && styleValue.indexOf('-gradient') > -1) {
              styleValue = new _jmGradient.jmGradient(styleValue);
            }
            _setStyle(styleValue.toGradient(_this3), mpname || name);
          } else if (mpname) {
            if (_this3.webglControl) {
              _this3.webglControl.setStyle(mpname, styleValue);
            } else {
              //只有存在白名单中才处理
              //颜色转换
              if (t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
                styleValue = _jmUtils.jmUtils.toColor(styleValue);
              }
              _this3.context[mpname] = styleValue;
            }
          } else {
            switch (name) {
              //阴影样式
              case 'shadow':
                {
                  if (t == 'string') {
                    _setStyle(new _jmShadow.jmShadow(styleValue), name);
                    break;
                  }
                  for (var k in styleValue) {
                    _setStyle(styleValue[k], k, name + '.' + k);
                  }
                  break;
                }
              //平移
              case 'translate':
                {
                  break;
                }
              //旋转
              case 'rotation':
                {
                  if (typeof styleValue.angle === 'undefined' || isNaN(styleValue.angle)) break;
                  styleValue = _this3.getRotation(styleValue);
                  _this3.__translateAbsolutePosition = _this3.toAbsolutePoint({
                    x: styleValue.x,
                    y: styleValue.y
                  });
                  //旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
                  //这里只有style中的旋转才能生效，不然会导至子控件多次旋转
                  _this3.context.translate && _this3.context.translate(_this3.__translateAbsolutePosition.x, _this3.__translateAbsolutePosition.y);
                  _this3.context.rotate && _this3.context.rotate(styleValue.angle);
                  _this3.context.translate && _this3.context.translate(-_this3.__translateAbsolutePosition.x, -_this3.__translateAbsolutePosition.y);
                  break;
                }
              case 'transform':
                {
                  if (!_this3.context.transform) break;
                  if (Array.isArray(styleValue)) {
                    _this3.context.transform.apply(_this3.context, styleValue);
                  } else if (_typeof(styleValue) == 'object') {
                    _this3.context.transform(styleValue.scaleX || 1,
                    //水平缩放
                    styleValue.skewX || 0,
                    //水平倾斜
                    styleValue.skewY || 0,
                    //垂直倾斜
                    styleValue.scaleY || 1,
                    //垂直缩放
                    styleValue.offsetX || 0,
                    //水平位移
                    styleValue.offsetY || 0 //垂直位移
                    );
                  }
                  break;
                }
              //鼠标指针
              case 'cursor':
                {
                  _this3.cursor = styleValue;
                  break;
                }
            }
          }
        }
      };

      //一些特殊属性要先设置，否则会导致顺序不对出现错误的效果
      if (this.translate) {
        _setStyle(this.translate, 'translate');
      }
      if (this.transform) {
        _setStyle(this.transform, 'transform');
      }
      //设置样式
      for (var k in style) {
        if (k === 'constructor') continue;
        var t = _typeof(style[k]);
        //先处理部分样式，以免每次都需要初始化解析
        if (t == 'string' && style[k].indexOf('-gradient') > -1) {
          style[k] = new _jmGradient.jmGradient(style[k]);
        } else if (t == 'string' && k == 'shadow') {
          style[k] = new _jmShadow.jmShadow(style[k]);
        }
        _setStyle(style[k], k);
      }
    }

    /**
     * 获取当前控件的边界
     * 通过分析控件的描点或位置加宽高得到为方形的边界
     *
     * @method getBounds
     * @for jmControl
     * @param {boolean} [isReset=false] 是否强制重新计算
     * @return {object} 控件的边界描述对象(left,top,right,bottom,width,height)
     */
  }, {
    key: "getBounds",
    value: function getBounds(isReset) {
      //如果当次计算过，则不重复计算
      if (this.bounds && !isReset) return this.bounds;
      var rect = {}; // left top
      //jmGraph，特殊处理
      if (this.type == 'jmGraph' && this.canvas) {
        if (typeof this.canvas.width === 'function') {
          rect.right = this.canvas.width();
        } else if (this.width) {
          rect.right = this.width;
        }
        if (typeof this.canvas.height === 'function') {
          rect.bottom = this.canvas.height();
        } else if (this.height) {
          rect.bottom = this.height;
        }
      } else if (this.points && this.points.length > 0) {
        var _iterator = _createForOfIteratorHelper(this.points),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var p = _step.value;
            if (typeof rect.left === 'undefined' || rect.left > p.x) {
              rect.left = p.x;
            }
            if (typeof rect.top === 'undefined' || rect.top > p.y) {
              rect.top = p.y;
            }
            if (typeof rect.right === 'undefined' || rect.right < p.x) {
              rect.right = p.x;
            }
            if (typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
              rect.bottom = p.y;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else if (this.getLocation) {
        var _p = this.getLocation();
        if (_p) {
          rect.left = _p.left;
          rect.top = _p.top;
          rect.right = _p.left + _p.width;
          rect.bottom = _p.top + _p.height;
        }
      }
      if (!rect.left) rect.left = 0;
      if (!rect.top) rect.top = 0;
      if (!rect.right) rect.right = 0;
      if (!rect.bottom) rect.bottom = 0;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      return this.bounds = rect;
    }

    /**
     * 获取被旋转后的边界
     */
  }, {
    key: "getRotationBounds",
    value: function getRotationBounds() {
      var rotation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      rotation = rotation || this.getRotation();
      var bounds = this.getBounds();
      if (!rotation || !rotation.angle) return bounds;
      var rect = {
        width: 0,
        height: 0,
        oldBounds: bounds
      }; // left top
      var points = [];
      if (this.points && this.points.length > 0) {
        points = _jmUtils.jmUtils.clone(this.points, true); // 深度拷贝			
      } else if (this.getLocation) {
        var local = this.getLocation();
        if (local) {
          points.push({
            x: local.left,
            y: local.top
          }, {
            x: local.left + local.width,
            y: local.top
          }, {
            x: local.left + local.width,
            y: local.top + local.height
          }, {
            x: local.left,
            y: local.top + local.height
          });
        }
      }
      points = _jmUtils.jmUtils.rotatePoints(points, {
        x: rotation.x + bounds.left,
        y: rotation.y + bounds.top
      }, rotation.angle); // 对现在点进行旋转
      var _iterator2 = _createForOfIteratorHelper(points),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var p = _step2.value;
          if (typeof rect.left === 'undefined' || rect.left > p.x) {
            rect.left = p.x;
          }
          if (typeof rect.top === 'undefined' || rect.top > p.y) {
            rect.top = p.y;
          }
          if (typeof rect.right === 'undefined' || rect.right < p.x) {
            rect.right = p.x;
          }
          if (typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
            rect.bottom = p.y;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      if (!rect.left) rect.left = 0;
      if (!rect.top) rect.top = 0;
      if (!rect.right) rect.right = 0;
      if (!rect.bottom) rect.bottom = 0;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      return rect;
    }

    /**
     * 获取当前控件的位置相关参数
     * 解析百分比和margin参数
     *
     * @method getLocation
     * @return {object} 当前控件位置参数，包括中心点坐标，右上角坐标，宽高
     */
  }, {
    key: "getLocation",
    value: function getLocation() {
      var clone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      //如果已经计算过则直接返回
      //在开画之前会清空此对象
      //if(reset !== true && this.location) return this.location;

      var local = this.location = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
      local.position = typeof this.position == 'function' ? this.position() : _jmUtils.jmUtils.clone(this.position);
      local.center = this.center && typeof this.center === 'function' ? this.center() : _jmUtils.jmUtils.clone(this.center); //中心
      local.start = this.start && typeof this.start === 'function' ? this.start() : _jmUtils.jmUtils.clone(this.start); //起点
      local.end = this.end && typeof this.end === 'function' ? this.end() : _jmUtils.jmUtils.clone(this.end); //起点
      local.radius = this.radius; //半径
      local.width = this.width;
      local.height = this.height;
      var margin = _jmUtils.jmUtils.clone(this.style.margin, {});
      margin.left = margin.left || 0;
      margin.top = margin.top || 0;
      margin.right = margin.right || 0;
      margin.bottom = margin.bottom || 0;

      //如果没有指定位置，但指定了margin。则位置取margin偏移量
      if (local.position) {
        local.left = local.position.x;
        local.top = local.position.y;
      } else {
        local.left = margin.left;
        local.top = margin.top;
      }
      if (this.parent) {
        var parentBounds = this.parent.getBounds();

        //处理百分比参数
        if (_jmUtils.jmUtils.checkPercent(local.left)) {
          local.left = _jmUtils.jmUtils.percentToNumber(local.left) * parentBounds.width;
        }
        if (_jmUtils.jmUtils.checkPercent(local.top)) {
          local.top = _jmUtils.jmUtils.percentToNumber(local.top) * parentBounds.height;
        }

        //如果没有指定宽度或高度，则按百分之百计算其父宽度或高度
        if (_jmUtils.jmUtils.checkPercent(local.width)) {
          local.width = _jmUtils.jmUtils.percentToNumber(local.width) * parentBounds.width;
        }
        if (_jmUtils.jmUtils.checkPercent(local.height)) {
          local.height = _jmUtils.jmUtils.percentToNumber(local.height) * parentBounds.height;
        }
        //处理中心点
        if (local.center) {
          //处理百分比参数
          if (_jmUtils.jmUtils.checkPercent(local.center.x)) {
            local.center.x = _jmUtils.jmUtils.percentToNumber(local.center.x) * parentBounds.width;
          }
          if (_jmUtils.jmUtils.checkPercent(local.center.y)) {
            local.center.y = _jmUtils.jmUtils.percentToNumber(local.center.y) * parentBounds.height;
          }
        }
        if (local.radius) {
          //处理百分比参数
          if (_jmUtils.jmUtils.checkPercent(local.radius)) {
            local.radius = _jmUtils.jmUtils.percentToNumber(local.radius) * Math.min(parentBounds.width, parentBounds.height);
          }
        }
      }
      return local;
    }

    /**
     * 获取当前控制的旋转信息
     * @returns {object} 旋转中心和角度
     */
  }, {
    key: "getRotation",
    value: function getRotation(rotation) {
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      rotation = rotation || _jmUtils.jmUtils.clone(this.style.rotation);
      if (!rotation) {
        //如果本身没有，则可以继承父级的
        rotation = this.parent && this.parent.getRotation ? this.parent.getRotation() : null;
        //如果父级有旋转，则把坐标转换为当前控件区域
        if (rotation) {
          bounds = bounds || this.getBounds();
          rotation.x -= bounds.left;
          rotation.y -= bounds.top;
        }
      } else {
        bounds = bounds || this.getBounds();
        if (typeof rotation.x === 'undefined') rotation.x = '50%';
        if (typeof rotation.y === 'undefined') rotation.y = '50%';
        if (_jmUtils.jmUtils.checkPercent(rotation.x)) {
          rotation.x = _jmUtils.jmUtils.percentToNumber(rotation.x) * bounds.width;
        }
        if (_jmUtils.jmUtils.checkPercent(rotation.y)) {
          rotation.y = _jmUtils.jmUtils.percentToNumber(rotation.y) * bounds.height;
        }
      }
      return _objectSpread(_objectSpread({}, rotation), {}, {
        bounds: bounds
      });
    }

    // 计算位移偏移量
  }, {
    key: "getTranslate",
    value: function getTranslate(translate) {
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      translate = translate || this.style.translate;
      if (!translate) return {
        x: 0,
        y: 0
      };
      var result = {
        x: translate.x || 0,
        y: translate.y || 0
      };
      if (_jmUtils.jmUtils.checkPercent(result.x)) {
        if (!bounds && this.parent) bounds = this.parent.getBounds();
        result.x = _jmUtils.jmUtils.percentToNumber(result.x) * bounds.width;
      }
      if (_jmUtils.jmUtils.checkPercent(result.y)) {
        if (!bounds && this.parent) bounds = this.parent.getBounds();
        result.y = _jmUtils.jmUtils.percentToNumber(result.y) * bounds.height;
      }
      return result;
    }

    /**
     * 移除当前控件
     * 如果是VML元素，则调用其删除元素
     *
     * @method remove 
     */
  }, {
    key: "remove",
    value: function remove() {
      if (this.parent) {
        this.parent.children.remove(this);
      }
    }

    /**
     * 对控件进行平移
     * 遍历控件所有描点或位置，设置其偏移量。
     *
     * @method offset
     * @param {number} x x轴偏移量
     * @param {number} y y轴偏移量
     * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
     * @param {object} [evt] 如果是事件触发，则传递move事件参数
     */
  }, {
    key: "offset",
    value: function offset(x, y, trans, evt) {
      trans = trans === false ? false : true;
      var local = this.getLocation(true);
      var offseted = false;
      if (local.position) {
        local.left += x;
        local.top += y;
        // 由于local是clone出来的对象，为了保留位移，则要修改原属性
        this.position.x = local.left;
        this.position.y = local.top;
        offseted = true;
      }
      if (local.center) {
        this.center.x = local.center.x + x;
        this.center.y = local.center.y + y;
        offseted = true;
      }
      if (local.start && _typeof(local.start) == 'object') {
        this.start.x = local.start.x + x;
        this.start.y = local.start.y + y;
        offseted = true;
      }
      if (local.end && _typeof(local.end) == 'object') {
        this.end.x = local.end.x + x;
        this.end.y = local.end.y + y;
        offseted = true;
      }
      if (offseted == false && this.cpoints) {
        var p = typeof this.cpoints == 'function' ? this.cpoints : this.cpoints;
        if (p) {
          var len = p.length;
          for (var i = 0; i < len; i++) {
            p[i].x += x;
            p[i].y += y;
          }
          offseted = true;
        }
      }
      if (offseted == false && this.points) {
        var _len = this.points.length;
        for (var _i = 0; _i < _len; _i++) {
          this.points[_i].x += x;
          this.points[_i].y += y;
        }
        offseted = true;
      }

      //触发控件移动事件	
      this.emit('move', {
        offsetX: x,
        offsetY: y,
        trans: trans,
        evt: evt
      });
      this.needUpdate = true;
    }

    /**
     * 获取控件相对于画布的绝对边界，
     * 与getBounds不同的是：getBounds获取的是相对于父容器的边界.
     *
     * @method getAbsoluteBounds
     * @return {object} 边界对象(left,top,right,bottom,width,height)
     */
  }, {
    key: "getAbsoluteBounds",
    value: function getAbsoluteBounds() {
      //当前控件的边界，
      var rec = this.getBounds();
      if (this.parent && this.parent.absoluteBounds) {
        //父容器的绝对边界
        var prec = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
        return {
          left: prec.left + rec.left,
          top: prec.top + rec.top,
          right: prec.left + rec.right,
          bottom: prec.top + rec.bottom,
          width: rec.width,
          height: rec.height
        };
      }
      return rec;
    }

    /**
     * 把当前控制内部坐标转为canvas绝对定位坐标
     * 
     * @method toAbsolutePoint
     * @param {x: number, y: number} 内部坐标
     */
  }, {
    key: "toAbsolutePoint",
    value: function toAbsolutePoint(point) {
      if (point.x || point.y) {
        var bounds = this.absoluteBounds ? this.absoluteBounds : this.getAbsoluteBounds();
        point.x = (point.x || 0) + bounds.left;
        point.y = (point.y || 0) + bounds.top;
      }
      return point;
    }

    /**
     * 把绝对定位坐标转为当前控件坐标系内
     * @param {*} point 
     */
  }, {
    key: "toLocalPosition",
    value: function toLocalPosition(point) {
      var bounds = this.absoluteBounds ? this.absoluteBounds : this.getAbsoluteBounds();
      if (!bounds) return false;
      return {
        x: point.x - bounds.left,
        y: point.y - bounds.top
      };
    }

    /**
     * 画控件前初始化
     * 执行beginPath开始控件的绘制
     * 
     * @method beginDraw
     */
  }, {
    key: "beginDraw",
    value: function beginDraw() {
      this.getLocation(true); //重置位置信息
      this.context.beginPath && this.context.beginPath();
      if (this.webglControl && this.webglControl.beginDraw) this.webglControl.beginDraw();
    }

    /**
     * 结束控件绘制
     *
     * @method endDraw
     */
  }, {
    key: "endDraw",
    value: function endDraw() {
      //如果当前为封闭路径
      if (this.style.close) {
        if (this.webglControl) this.webglControl.closePath();
        this.context.closePath && this.context.closePath();
      }
      var fill = this.style['fill'] || this.style['fillStyle'];
      if (fill) {
        if (this.webglControl) {
          var bounds = this.getBounds();
          this.webglControl.fill(bounds);
        }
        this.context.fill && this.context.fill();
      }
      if (this.style['stroke'] || !fill && !this.is('jmGraph')) {
        if (this.webglControl) this.webglControl.stroke();
        this.context.stroke && this.context.stroke();
      }
      if (this.webglControl && this.webglControl.endDraw) this.webglControl.endDraw();
      this.needUpdate = false;
    }

    /**
     * 绘制控件
     * 在画布上描点
     * 
     * @method draw
     */
  }, {
    key: "draw",
    value: function draw() {
      if (this.points && this.points.length > 0) {
        //获取当前控件的绝对位置
        var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
        if (this.webglControl) {
          this.webglControl.setParentBounds(bounds);
          this.webglControl.draw(_toConsumableArray(this.points));
        } else if (this.context && this.context.moveTo) {
          this.context.moveTo(this.points[0].x + bounds.left, this.points[0].y + bounds.top);
          var len = this.points.length;
          for (var i = 1; i < len; i++) {
            var p = this.points[i];
            //移至当前坐标
            if (p.m) {
              this.context.moveTo(p.x + bounds.left, p.y + bounds.top);
            } else {
              this.context.lineTo(p.x + bounds.left, p.y + bounds.top);
            }
          }
        }
      }
    }

    /**
     * 绘制当前控件
     * 协调控件的绘制，先从其子控件开始绘制，再往上冒。
     *
     * @method paint
     */
  }, {
    key: "paint",
    value: function paint(v) {
      if (v !== false && this.visible !== false) {
        if (this.initPoints) this.initPoints();
        //计算当前边界
        this.bounds = null;
        this.absoluteBounds = this.getAbsoluteBounds();
        var needDraw = true; //是否需要绘制
        if (!this.is('jmGraph') && this.graph) {
          if (this.absoluteBounds.left >= this.graph.width) needDraw = false;else if (this.absoluteBounds.top >= this.graph.height) needDraw = false;else if (this.absoluteBounds.right <= 0) needDraw = false;else if (this.absoluteBounds.bottom <= 0) needDraw = false;
        }
        this.context.save && this.context.save();
        this.emit('beginDraw', this);
        this.setStyle(); //设定样式

        if (needDraw && this.beginDraw) this.beginDraw();
        if (needDraw && this.draw) this.draw();
        if (needDraw && this.endDraw) this.endDraw();
        if (this.children) {
          this.children.each(function (i, item) {
            if (item && item.paint) item.paint();
          });
        }
        this.emit('endDraw', this);
        this.context.restore && this.context.restore();
        this.needUpdate = false;
      }
    }

    /**
     * 获取指定事件的集合
     * 比如mousedown,mouseup等
     *
     * @method getEvent
     * @param {string} name 事件名称
     * @return {list} 事件委托的集合
     */
  }, {
    key: "getEvent",
    value: function getEvent(name) {
      return this.__events ? this.__events[name] : null;
    }

    /**
     * 绑定控件的事件
     *
     * @method bind
     * @param {string} name 事件名称
     * @param {function} handle 事件委托
     */
  }, {
    key: "bind",
    value: function bind(name, handle) {
      if (name && name.indexOf(' ') > -1) {
        name = name.split(' ');
        var _iterator3 = _createForOfIteratorHelper(name),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var n = _step3.value;
            n && this.bind(n, handle);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        return;
      }
      /**
       * 添加事件的集合
       *
       * @method _setEvent
       * @private
       */
      function _setEvent(name, events) {
        if (!this.__events) this.__events = {};
        return this.__events[name] = events;
      }
      var eventCollection = this.getEvent(name) || _setEvent.call(this, name, new _jmList.jmList());
      if (!eventCollection.contain(handle)) {
        eventCollection.add(handle);
      }
    }

    /**
     * 移除控件的事件
     *
     * @method unbind 
     * @param {string} name 事件名称
     * @param {function} handle 从控件中移除事件的委托
     */
  }, {
    key: "unbind",
    value: function unbind(name, handle) {
      if (name && name.indexOf(' ') > -1) {
        name = name.split(' ');
        var _iterator4 = _createForOfIteratorHelper(name),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var n = _step4.value;
            n && this.unbind(n, handle);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        return;
      }
      var eventCollection = this.getEvent(name);
      if (eventCollection) {
        if (handle) eventCollection.remove(handle);else eventCollection.clear();
      }
    }

    /**
     * 执行监听回调
     * 
     * @method emit
     * @for jmControl
     * @param {string} name 触发事件的名称
     * @param {array} args 事件参数数组
     */
  }, {
    key: "emit",
    value: function emit() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key = 0; _key < _len2; _key++) {
        args[_key] = arguments[_key];
      }
      this.runEventHandle(args[0], args.slice(1));
      return this;
    }

    /**
     * 独立执行事件委托
     *
     * @method runEventHandle
     * @param {string} 将执行的事件名称
     * @param {object} 事件执行的参数，包括触发事件的对象和位置
     */
  }, {
    key: "runEventHandle",
    value: function runEventHandle(name, args) {
      var events = this.getEvent(name);
      if (events) {
        var self = this;
        if (!Array.isArray(args)) args = [args];
        events.each(function (i, handle) {
          //只要有一个事件被阻止，则不再处理同级事件，并设置冒泡被阻断
          if (false === handle.apply(self, args)) {
            args.cancel = true;
          }
        });
      }
      return args.cancel;
    }

    /**
     * 检 查坐标是否落在当前控件区域中..true=在区域内
     *
     * @method checkPoint
     * @param {point} p 位置参数
     * @param {number} [pad] 可选参数，表示线条多远内都算在线上
     * @return {boolean} 当前位置如果在区域内则为true,否则为false。
     */
  }, {
    key: "checkPoint",
    value: function checkPoint(p, pad) {
      //jmGraph 需要判断dom位置
      if (this.type == 'jmGraph') {
        //获取dom位置
        var position = this.getPosition();
        // 由于高清屏会有放大坐标，所以这里用pagex就只能用真实的canvas大小
        var right = position.left + this.width;
        var bottom = position.top + this.height;
        if (p.pageX > right || p.pageX < position.left) {
          return false;
        }
        if (p.pageY > bottom || p.pageY < position.top) {
          return false;
        }
        return true;
      }
      var bounds = this.getBounds();
      var ps = this.points;
      //如果不是路径组成，则采用边界做为顶点
      if (!ps || !ps.length) {
        ps = [];
        ps.push({
          x: bounds.left,
          y: bounds.top
        }); //左上角
        ps.push({
          x: bounds.right,
          y: bounds.top
        }); //右上角
        ps.push({
          x: bounds.right,
          y: bounds.bottom
        }); //右下角
        ps.push({
          x: bounds.left,
          y: bounds.bottom
        }); //左下
        ps.push({
          x: bounds.left,
          y: bounds.top
        }); //左上角   //闭合
      }
      //如果有指定padding 表示接受区域加宽，命中更易
      pad = Number(pad || this.style['touchPadding'] || this.style['lineWidth'] || 1);
      if (ps && ps.length) {
        var rotation = this.getRotation(null, bounds); //获取当前旋转参数
        //如果有旋转参数，则需要转换坐标再处理
        if (rotation && rotation.angle) {
          ps = _jmUtils.jmUtils.clone(ps, true); //拷贝一份数据
          //rotateX ,rotateY 是相对当前控件的位置
          ps = _jmUtils.jmUtils.rotatePoints(ps, {
            x: rotation.x + bounds.left,
            y: rotation.y + bounds.top
          }, rotation.angle || 0);
        }
        //如果当前路径不是实心的
        //就只用判断点是否在边上即可	
        if (ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
          var i = 0;
          var count = ps.length;
          for (var j = i + 1; j <= count; j = ++i + 1) {
            //如果j超出最后一个
            //则当为封闭图形时跟第一点连线处理.否则直接返回false
            if (j == count) {
              if (this.style.close) {
                var _r = _jmUtils.jmUtils.pointInPolygon(p, [ps[i], ps[0]], pad);
                if (_r) return true;
              }
            } else {
              //判断是否在点i,j连成的线上
              var s = _jmUtils.jmUtils.pointInPolygon(p, [ps[i], ps[j]], pad);
              if (s) return true;
            }
          }
          //不是封闭的图形，则直接返回
          if (!this.style['fill']) return false;
        }
        var r = _jmUtils.jmUtils.pointInPolygon(p, ps, pad);
        return r;
      }
      if (p.x > bounds.right || p.x < bounds.left) {
        return false;
      }
      if (p.y > bounds.bottom || p.y < bounds.top) {
        return false;
      }
      return true;
    }

    /**
     * 触发控件事件，组合参数并按控件层级关系执行事件冒泡。
     *
     * @method raiseEvent
     * @param {string} name 事件名称
     * @param {object} args 事件执行参数
     * @return {boolean} 如果事件被组止冒泡则返回false,否则返回true
     */
  }, {
    key: "raiseEvent",
    value: function raiseEvent(name, args) {
      if (this.visible === false) return; //如果不显示则不响应事件	
      if (!args.position) {
        var graph = this.graph;
        args.isWXMiniApp = graph.isWXMiniApp;
        var srcElement = args.srcElement || args.target;
        var position = _jmUtils.jmUtils.getEventPosition(args); //初始化事件位置

        args = {
          position: position,
          button: args.button == 0 || position.isTouch ? 1 : args.button,
          keyCode: args.keyCode || args.charCode || args.which,
          ctrlKey: args.ctrlKey,
          cancel: false,
          event: args,
          // 原生事件
          srcElement: srcElement,
          isWXMiniApp: graph.isWXMiniApp
        };
      }
      args.path = args.path || []; //事件冒泡路径

      //先执行子元素事件，如果事件没有被阻断，则向上冒泡
      var stoped = false;
      if (this.children) {
        this.children.each(function (j, el) {
          //未被阻止才执行			
          if (args.cancel !== true) {
            //如果被阻止冒泡，
            stoped = el.raiseEvent(name, args) === false ? true : stoped;
            // 不再响应其它元素
            if (stoped) return false;
          }
        }, true); //按逆序处理
      }
      // 如果已被阻止，不再响应上级事件
      if (stoped) return false;

      //获取当前对象的父元素绝对位置
      //生成当前坐标对应的父级元素的相对位置
      var abounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      if (!abounds) return false;
      //args = jmUtils.clone(args);//参数副本
      args.position.x = args.position.offsetX - abounds.left;
      args.position.y = args.position.offsetY - abounds.top;

      // 是否在当前控件内操作
      var inpos = this.interactive !== false && this.checkPoint(args.position);

      //事件发生在边界内或健盘事件发生在画布中才触发
      if (inpos) {
        //如果没有指定触发对象，则认为当前为第一触发对象
        if (!args.target) {
          args.target = this;
        }
        this.runEventAndPopEvent(name, args);
        if (!this.focused && (name === 'mousemove' || name === 'touchmove')) {
          this.focused = true; //表明当前焦点在此控件中
          this.raiseEvent(name === 'mousemove' ? 'mouseover' : 'touchover', args);
        }
      } else {
        //如果焦点不在，且原焦点在，则触发mouseleave事件
        if (this.interactive !== false && !inpos && this.focused && (name === 'mousemove' || name === 'touchmove')) {
          this.focused = false; //表明当前焦点离开
          this.runEventHandle(name === 'mousemove' ? 'mouseleave' : 'touchleave', args); //执行事件	
        }
      }
      return args.cancel === false; //如果被阻止则返回false,否则返回true
    }

    /**
     * 执行事件，并进行冒泡
     * @param {string} name 事件名称 
     * @param {object} args 事件参数
     */
  }, {
    key: "runEventAndPopEvent",
    value: function runEventAndPopEvent(name, args) {
      if (args.cancel !== true) {
        // 添加到触发路径
        args.path.push(this);

        //如果返回true则阻断冒泡
        this.runEventHandle(name, args); //执行事件

        // // 向父节点冒泡事件		
        // if(args.cancel !== true && this.parent && this.parent.runEventAndPopEvent) {
        // 	// 相对位置需要改为父节点的
        // 	if(args.position) {
        // 		let bounds = this.parent.getBounds();
        // 		args.position.x += bounds.left;
        // 		args.position.y += bounds.top;
        // 	}
        // 	this.parent.runEventAndPopEvent(name, args);
        // }		
      }
    }

    /**
     * 清空控件指定事件
     *
     * @method clearEvents
     * @param {string} name 需要清除的事件名称
     */
  }, {
    key: "clearEvents",
    value: function clearEvents(name) {
      var eventCollection = this.getEvent(name);
      if (eventCollection) {
        eventCollection.clear;
      }
    }

    /**
     * 查找其父级类型为type的元素，直到找到指定的对象或到最顶级控件后返回空。
     *
     * @method findParent 
     * @param {object} 类型名称或类型对象
     * @return {object} 指定类型的实例
     */
  }, {
    key: "findParent",
    value: function findParent(type) {
      //如果为类型名称，则返回名称相同的类型对象
      if (typeof type === 'string') {
        if (this.type == type) return this;
      } else if (this.is(type)) {
        return this;
      }
      if (this.parent) {
        return this.parent.findParent(type);
      }
      return null;
    }

    /**
     * 设定是否可以移动
     * 此方法需指定jmgraph或在控件添加到jmgraph后再调用才能生效。
     *
     * @method canMove
     * @param {boolean} m true=可以移动，false=不可移动或清除移动。
     * @param {jmGraph} [graph] 当前画布，如果为空的话必需是已加入画布的控件，否则得指定画布。
     */
  }, {
    key: "canMove",
    value: function canMove(m, graph) {
      if (!this.__mvMonitor) {
        /**
         * 控制控件移动对象
         * 
         * @property __mvMonitor
         * @private
         */
        this.__mvMonitor = {};
        this.__mvMonitor.mouseDown = false;
        this.__mvMonitor.curposition = {
          x: 0,
          y: 0
        };
        var self = this;
        /**
         * 控件移动鼠标事件
         *
         * @method mv
         * @private
         */
        this.__mvMonitor.mv = function (evt) {
          var _this = self;
          //如果鼠标经过当前可移动控件，则显示可移动指针
          //if(evt.path && evt.path.indexOf(_this)>-1) {
          //	_this.cursor('move');	
          //}

          if (_this.__mvMonitor.mouseDown) {
            _this.parent.bounds = null;
            var parentbounds = _this.parent.getAbsoluteBounds();
            var offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
            var offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y;
            //console.log(offsetx + ',' + offsety);
            //如果锁定边界
            if (_this.lockSide) {
              var thisbounds = _this.bounds || _this.getAbsoluteBounds();
              //检查边界出界
              var outside = _jmUtils.jmUtils.checkOutSide(parentbounds, thisbounds, {
                x: offsetx,
                y: offsety
              });
              if (outside.left < 0) {
                if (_this.lockSide.left) offsetx -= outside.left;
              } else if (outside.right > 0) {
                if (_this.lockSide.right) offsetx -= outside.right;
              }
              if (outside.top < 0) {
                if (_this.lockSide.top) offsety -= outside.top;
              } else if (outside.bottom > 0) {
                if (_this.lockSide.bottom) offsety -= outside.bottom;
              }
            }
            if (offsetx || offsety) {
              _this.offset(offsetx, offsety, true, evt);
              _this.__mvMonitor.curposition.x = evt.position.offsetX;
              _this.__mvMonitor.curposition.y = evt.position.offsetY;
              //console.log(offsetx + '.' + offsety);
            }
            return false;
          }
        };
        /**
         * 控件移动鼠标松开事件
         *
         * @method mu
         * @private
         */
        this.__mvMonitor.mu = function (evt) {
          var _this = self;
          if (_this.__mvMonitor.mouseDown) {
            _this.__mvMonitor.mouseDown = false;
            //_this.cursor('default');
            _this.emit('moveend', {
              position: _this.__mvMonitor.curposition
            });
            //return false;
          }
        };
        /**
         * 控件移动鼠标离开事件
         *
         * @method ml
         * @private
         */
        this.__mvMonitor.ml = function () {
          var _this = self;
          if (_this.__mvMonitor.mouseDown) {
            _this.__mvMonitor.mouseDown = false;
            //_this.cursor('default');	
            _this.emit('moveend', {
              position: _this.__mvMonitor.curposition
            });
            return false;
          }
        };
        /**
         * 控件移动鼠标按下事件
         *
         * @method md
         * @private
         */
        this.__mvMonitor.md = function (evt) {
          if (this.__mvMonitor.mouseDown) return;
          if (evt.button == 0 || evt.button == 1) {
            this.__mvMonitor.mouseDown = true;
            //this.cursor('move');
            //var parentbounds = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();	
            this.__mvMonitor.curposition.x = evt.position.offsetX; //evt.position.x + parentbounds.left;
            this.__mvMonitor.curposition.y = evt.position.offsetY; //evt.position.y + parentbounds.top;
            //触发控件移动事件
            this.emit('movestart', {
              position: this.__mvMonitor.curposition
            });
            evt.cancel = true;
            return false;
          }
        };
      }
      graph = graph || this.graph; //获取最顶级元素画布

      if (m !== false) {
        graph.bind('mousemove', this.__mvMonitor.mv);
        graph.bind('mouseup', this.__mvMonitor.mu);
        graph.bind('mouseleave', this.__mvMonitor.ml);
        this.bind('mousedown', this.__mvMonitor.md);
        graph.bind('touchmove', this.__mvMonitor.mv);
        graph.bind('touchend', this.__mvMonitor.mu);
        this.bind('touchstart', this.__mvMonitor.md);
      } else {
        graph.unbind('mousemove', this.__mvMonitor.mv);
        graph.unbind('mouseup', this.__mvMonitor.mu);
        graph.unbind('mouseleave', this.__mvMonitor.ml);
        this.unbind('mousedown', this.__mvMonitor.md);
        graph.unbind('touchmove', this.__mvMonitor.mv);
        graph.unbind('touchend', this.__mvMonitor.mu);
        this.unbind('touchstart', this.__mvMonitor.md);
      }
      this.interactive = true; // 如果可以移动，则响应事件
      return this;
    }
  }]);
}(_jmProperty2.jmProperty);
;

},{"../lib/webgl/path.js":21,"./jmGradient.js":4,"./jmList.js":6,"./jmProperty.js":9,"./jmShadow.js":10,"./jmUtils.js":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmEvents = exports["default"] = void 0;
var _jmUtils = require("./jmUtils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 事件模型
 *
 * @class jmEvents
 * @for jmGraph
 */
var jmEvents = exports.jmEvents = exports["default"] = /*#__PURE__*/function () {
  function jmEvents(container, target) {
    _classCallCheck(this, jmEvents);
    this.container = container;
    this.target = target || container;
    this.mouseHandler = new jmMouseEvent(this, container, target);
    this.keyHandler = new jmKeyEvent(this, container, target);
  }
  return _createClass(jmEvents, [{
    key: "touchStart",
    value: function touchStart(evt) {
      evt = evt || window.event;
      evt.eventName = 'touchstart';
      this.container.raiseEvent('touchstart', evt);
      var t = evt.target || evt.srcElement;
      if (t == this.target) {
        //if(evt.preventDefault) evt.preventDefault();
        return false;
      }
    }
  }, {
    key: "touchMove",
    value: function touchMove(evt) {
      evt = evt || window.event;
      evt.eventName = 'touchmove';
      this.container.raiseEvent('touchmove', evt);
      var t = evt.target || evt.srcElement;
      if (t == this.target) {
        //if(evt.preventDefault) evt.preventDefault();
        return false;
      }
    }
  }, {
    key: "touchEnd",
    value: function touchEnd(evt) {
      evt = evt || window.event;
      evt.eventName = 'touchend';
      this.container.raiseEvent('touchend', evt);
      var t = evt.target || evt.srcElement;
      if (t == this.target) {
        //if(evt.preventDefault) evt.preventDefault();
        return false;
      }
    }
  }, {
    key: "touchCancel",
    value: function touchCancel(evt) {
      evt = evt || window.event;
      evt.eventName = 'touchcancel';
      this.container.raiseEvent('touchcancel', evt);
      var t = evt.target || evt.srcElement;
      if (t == this.target) {
        //if(evt.preventDefault) evt.preventDefault();
        return false;
      }
    }
  }, {
    key: "destroy",
    value:
    // 销毁
    function destroy() {
      this.mouseHandler.destroy();
      this.keyHandler.destroy();
    }
  }]);
}();
/**
 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
 */
var jmMouseEvent = /*#__PURE__*/function () {
  function jmMouseEvent(instance, container, target) {
    _classCallCheck(this, jmMouseEvent);
    this.instance = instance;
    this.container = container;
    this.target = target || container;
    this.eventEvents = {}; // 所有绑定的事件

    this.init(instance, container, target);
  }
  return _createClass(jmMouseEvent, [{
    key: "init",
    value: function init(instance, container, target) {
      var canvas = this.target;
      var doc = typeof document != 'undefined' ? document : null;
      //禁用鼠标右健系统菜单
      //canvas.oncontextmenu = function() {
      //	return false;
      //};

      this.eventEvents['mousedown'] = _jmUtils.jmUtils.bindEvent(this.target, 'mousedown', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mousedown';
        var r = container.raiseEvent('mousedown', evt);
        //if(r === false) {
        //if(evt.preventDefault) evt.preventDefault();
        //return false;
        //}				
      });
      this.eventEvents['mousemove'] = _jmUtils.jmUtils.bindEvent(this.target, 'mousemove', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mousemove';
        var target = evt.target || evt.srcElement;
        if (target == canvas) {
          var r = container.raiseEvent('mousemove', evt);
          //if(r === false) {
          if (evt.preventDefault) evt.preventDefault();
          return false;
          //}		
        }
      });
      this.eventEvents['mouseover'] = _jmUtils.jmUtils.bindEvent(this.target, 'mouseover', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mouseover';
        container.raiseEvent('mouseover', evt);
      });
      this.eventEvents['mouseleave'] = _jmUtils.jmUtils.bindEvent(this.target, 'mouseleave', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mouseleave';
        container.raiseEvent('mouseleave', evt);
      });
      this.eventEvents['mouseout'] = _jmUtils.jmUtils.bindEvent(this.target, 'mouseout', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mouseout';
        container.raiseEvent('mouseout', evt);
      });
      doc && (this.eventEvents['mouseup'] = _jmUtils.jmUtils.bindEvent(doc, 'mouseup', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'mouseup';
        //let target = evt.target || evt.srcElement;
        //if(target == canvas) {						
        var r = container.raiseEvent('mouseup', evt);
        if (r === false) {
          if (evt.preventDefault) evt.preventDefault();
          return false;
        }
        //}
      }));
      this.eventEvents['dblclick'] = _jmUtils.jmUtils.bindEvent(this.target, 'dblclick', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'dblclick';
        container.raiseEvent('dblclick', evt);
      });
      this.eventEvents['click'] = _jmUtils.jmUtils.bindEvent(this.target, 'click', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'click';
        container.raiseEvent('click', evt);
      });
      doc && (this.eventEvents['resize'] = _jmUtils.jmUtils.bindEvent(doc, 'resize', function (evt) {
        evt = evt || window.event;
        evt.eventName = 'resize';
        return container.raiseEvent('resize', evt);
      }));

      // passive: false 为了让浏览器不告警并且preventDefault有效
      // 另一种处理：touch-action: none; 这样任何触摸事件都不会产生默认行为，但是 touch 事件照样触发。
      this.eventEvents['touchstart'] = _jmUtils.jmUtils.bindEvent(this.target, 'touchstart', function (evt) {
        evt.eventName = 'touchstart';
        return instance.touchStart(evt);
      }, {
        passive: false
      });
      this.eventEvents['touchmove'] = _jmUtils.jmUtils.bindEvent(this.target, 'touchmove', function (evt) {
        evt.eventName = 'touchmove';
        return instance.touchMove(evt);
      }, {
        passive: false
      });
      doc && (this.eventEvents['touchend'] = _jmUtils.jmUtils.bindEvent(doc, 'touchend', function (evt) {
        evt.eventName = 'touchend';
        return instance.touchEnd(evt);
      }, {
        passive: false
      }));
      doc && (this.eventEvents['touchcancel'] = _jmUtils.jmUtils.bindEvent(doc, 'touchcancel', function (evt) {
        evt.eventName = 'touchcancel';
        return instance.touchCancel(evt);
      }, {
        passive: false
      }));
    }

    // 销毁所有事件
  }, {
    key: "destroy",
    value: function destroy() {
      for (var name in this.eventEvents) {
        var event = this.eventEvents[name];
        if (!event || !event.fun) continue;
        _jmUtils.jmUtils.removeEvent(event.target, name, event.fun);
      }
    }
  }]);
}();
/**
 * 健盘事件处理对象，container 为事件主体，target为响应事件对象
 */
var jmKeyEvent = /*#__PURE__*/function () {
  function jmKeyEvent(instance, container, target) {
    _classCallCheck(this, jmKeyEvent);
    this.instance = instance;
    this.container = container;
    this.target = target || container;
    this.eventEvents = {}; // 所有绑定的事件

    this.init(container, target);
  }

  /**
   * 初始化健盘事件
   */
  return _createClass(jmKeyEvent, [{
    key: "init",
    value: function init(container, target) {
      var doc = typeof document != 'undefined' ? document : null;
      /**
       * 检查是否触发健盘事件至画布
       * 如果触发对象为输入框等对象则不响应事件
       *  
       */
      var checkKeyEvent = function checkKeyEvent(evt) {
        var target = evt.srcElement || evt.target;
        if (target && (target.tagName == 'INPUT' || target.tagName == 'TEXTAREA' || target.tagName == 'ANCHOR' || target.tagName == 'FORM' || target.tagName == 'FILE' || target.tagName == 'IMG' || target.tagName == 'HIDDEN' || target.tagName == 'RADIO' || target.tagName == 'TEXT')) {
          return false;
        }
        return true;
      };
      doc && (this.eventEvents['keypress'] = _jmUtils.jmUtils.bindEvent(doc, 'keypress', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应
        var r = container.raiseEvent('keypress', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      }));
      doc && (this.eventEvents['keydown'] = _jmUtils.jmUtils.bindEvent(doc, 'keydown', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应
        var r = container.raiseEvent('keydown', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      }));
      doc && (this.eventEvents['keyup'] = _jmUtils.jmUtils.bindEvent(doc, 'keyup', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应
        var r = container.raiseEvent('keyup', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      }));
    }

    // 销毁所有事件
  }, {
    key: "destroy",
    value: function destroy() {
      for (var name in this.eventEvents) {
        var event = this.eventEvents[name];
        if (!event || !event.fun) continue;
        _jmUtils.jmUtils.removeEvent(event.target, name, event.fun);
      }
    }
  }]);
}();

},{"./jmUtils.js":11}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmGradient = exports["default"] = void 0;
var _jmUtils = require("./jmUtils.js");
var _jmList = require("./jmList.js");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 渐变类
 *
 * @class jmGradient
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
var jmGradient = exports.jmGradient = exports["default"] = /*#__PURE__*/function () {
  function jmGradient(opt) {
    _classCallCheck(this, jmGradient);
    this.stops = new _jmList.jmList();
    if (opt && _typeof(opt) == 'object') {
      for (var k in opt) {
        if (k === 'stops') continue;
        this[k] = opt[k];
      }
      if (opt.stops && Array.isArray(opt.stops)) {
        var _this$stops;
        (_this$stops = this.stops).push.apply(_this$stops, _toConsumableArray(opt.stops));
      }
    }
    //解析字符串格式
    //linear-gradient(direction, color-stop1, color-stop2, ...);
    //radial-gradient(center, shape size, start-color, ..., last-color);
    else if (typeof opt == 'string') {
      this.fromString(opt);
    }
  }
  /**
   * 添加渐变色
   * 
   * @method addStop
   * @for jmGradient
   * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
   * @param {string} color 当前偏移颜色值
   */
  return _createClass(jmGradient, [{
    key: "addStop",
    value: function addStop(offset, color) {
      this.stops.add({
        offset: Number(offset),
        color: color
      });
    }

    /**
     * 生成为canvas的渐变对象
     *
     * @method toGradient
     * @for jmGradient
     * @param {jmControl} control 当前渐变对应的控件
     * @return {gradient} canvas渐变对象
     */
  }, {
    key: "toGradient",
    value: function toGradient(control) {
      var gradient;
      var context = control.context || control;
      var bounds = control.absoluteBounds ? control.absoluteBounds : control.getAbsoluteBounds();
      var x1 = this.x1 || 0;
      var y1 = this.y1 || 0;
      var x2 = this.x2;
      var y2 = this.y2;
      var location = control.getLocation();
      var d = 0;
      if (location.radius) {
        d = location.radius * 2;
      }
      if (!d) {
        d = Math.min(location.width, location.height);
      }

      //let offsetLine = 1;//渐变长度或半径
      //处理百分比参数
      if (_jmUtils.jmUtils.checkPercent(x1)) {
        x1 = _jmUtils.jmUtils.percentToNumber(x1) * (bounds.width || d);
      }
      if (_jmUtils.jmUtils.checkPercent(x2)) {
        x2 = _jmUtils.jmUtils.percentToNumber(x2) * (bounds.width || d);
      }
      if (_jmUtils.jmUtils.checkPercent(y1)) {
        y1 = _jmUtils.jmUtils.percentToNumber(y1) * (bounds.height || d);
      }
      if (_jmUtils.jmUtils.checkPercent(y2)) {
        y2 = _jmUtils.jmUtils.percentToNumber(y2) * (bounds.height || d);
      }
      var sx1 = Number(x1) + bounds.left;
      var sy1 = Number(y1) + bounds.top;
      var sx2 = Number(x2) + bounds.left;
      var sy2 = Number(y2) + bounds.top;
      if (this.type === 'linear') {
        if (control.mode === 'webgl' && control.webglControl) {
          gradient = control.webglControl.createLinearGradient(x1, y1, x2, y2, bounds);
          gradient.key = this.toString();
        } else {
          context.createLinearGradient && (gradient = context.createLinearGradient(sx1, sy1, sx2, sy2));
        }
      } else if (this.type === 'radial') {
        var r1 = this.r1 || 0;
        var r2 = this.r2;
        if (_jmUtils.jmUtils.checkPercent(r1)) {
          r1 = _jmUtils.jmUtils.percentToNumber(r1);
          r1 = d * r1;
        }
        if (_jmUtils.jmUtils.checkPercent(r2)) {
          r2 = _jmUtils.jmUtils.percentToNumber(r2);
          r2 = d * r2;
        }
        if (control.mode === 'webgl' && control.webglControl) {
          gradient = control.webglControl.createRadialGradient(x1, y1, r1, x2, y2, r2, bounds);
          gradient.key = this.toString();
        }
        //offsetLine = Math.abs(r2 - r1);//二圆半径差
        else if (context.createRadialGradient) {
          gradient = context.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2);
        }
        //小程序的接口特殊
        else if (context.createCircularGradient) {
          gradient = context.createCircularGradient(sx1, sy1, r2);
        }
      }

      //颜色渐变
      if (gradient) {
        this.stops.each(function (i, s) {
          var c = _jmUtils.jmUtils.toColor(s.color);
          //s.offset 0.0 ~ 1.0
          gradient && gradient.addColorStop(s.offset, c);
        });
      } else {
        var s = this.stops.get(0);
        return s && s.color || '#000';
      }
      return gradient;
    }

    /**
     * 变换为字条串格式
     * linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
     * linear-gradient线性渐变，x1 y1表示起点，x2 y2表示结束点,color表颜色，step为当前颜色偏移
     * radial-gradient径向渐变,x1 y1 r1分别表示内圆中心和半径，x2 y2 r2为结束圆 中心和半径，颜色例似线性渐变 step为0-1之间
     *
     * @method fromString
     * @for jmGradient
     * @return {string} 
     */
  }, {
    key: "fromString",
    value: function fromString(s) {
      if (!s) return;
      var ms = s.match(/(linear|radial)-gradient\s*\(\s*([^,]+)\s*,\s*((.|\s)+)\)/i);
      if (!ms || ms.length < 3) return;
      this.type = ms[1].toLowerCase();
      var ps = _jmUtils.jmUtils.trim(ms[2]).split(/\s+/);
      //线性渐变
      if (this.type == 'linear') {
        if (ps.length <= 2) {
          this.x2 = ps[0];
          this.y2 = ps[1] || 0;
        } else {
          this.x1 = ps[0];
          this.y1 = ps[1];
          this.x2 = ps[2];
          this.y2 = ps[3];
        }
      }
      //径向渐变
      else {
        if (ps.length <= 3) {
          this.x2 = ps[0];
          this.y2 = ps[1] || 0;
          this.r2 = ps[2] || 0;
        } else {
          this.x1 = ps[0];
          this.y1 = ps[1];
          this.r1 = ps[2];
          this.x2 = ps[3];
          this.y2 = ps[3];
          this.r2 = ps[3];
        }
      }
      //解析颜色偏移
      //color step
      var pars = ms[3].match(/((rgb(a)?\s*\([\d,\.\s]+\))|(#[a-zA-Z\d]+))\s+([\d\.]+)/ig);
      if (pars && pars.length) {
        for (var i = 0; i < pars.length; i++) {
          var par = _jmUtils.jmUtils.trim(pars[i]);
          var spindex = par.lastIndexOf(' ');
          if (spindex > -1) {
            var offset = Number(par.substr(spindex + 1));
            var color = _jmUtils.jmUtils.trim(par.substr(0, spindex));
            if (!isNaN(offset) && color) {
              this.addStop(offset, color);
            }
          }
        }
      }
    }

    /**
     * 转换为渐变的字符串表达
     *
     * @method toString
     * @for jmGradient
     * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
     */
  }, {
    key: "toString",
    value: function toString() {
      var str = this.type + '-gradient(';
      if (this.type == 'linear') {
        str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
      } else {
        str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
      }
      //颜色渐变
      this.stops.each(function (i, s) {
        str += ',' + s.color + ' ' + s.offset;
      });
      return str + ')';
    }
  }]);
}();

},{"./jmList.js":6,"./jmUtils.js":11}],5:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
Object.defineProperty(exports, "jmControl", {
  enumerable: true,
  get: function get() {
    return _jmControl2.jmControl;
  }
});
Object.defineProperty(exports, "jmEvents", {
  enumerable: true,
  get: function get() {
    return _jmEvents.jmEvents;
  }
});
Object.defineProperty(exports, "jmGradient", {
  enumerable: true,
  get: function get() {
    return _jmGradient.jmGradient;
  }
});
exports.jmGraph = void 0;
Object.defineProperty(exports, "jmList", {
  enumerable: true,
  get: function get() {
    return _jmList.jmList;
  }
});
Object.defineProperty(exports, "jmPath", {
  enumerable: true,
  get: function get() {
    return _jmPath.jmPath;
  }
});
Object.defineProperty(exports, "jmProperty", {
  enumerable: true,
  get: function get() {
    return _jmProperty.jmProperty;
  }
});
Object.defineProperty(exports, "jmShadow", {
  enumerable: true,
  get: function get() {
    return _jmShadow.jmShadow;
  }
});
Object.defineProperty(exports, "jmUtils", {
  enumerable: true,
  get: function get() {
    return _jmUtils.jmUtils;
  }
});
var _jmUtils = require("./jmUtils.js");
var _jmList = require("./jmList.js");
var _jmProperty = require("./jmProperty.js");
var _jmShadow = require("./jmShadow.js");
var _jmGradient = require("./jmGradient.js");
var _jmEvents = require("./jmEvents.js");
var _jmControl2 = require("./jmControl.js");
var _jmPath = require("./jmPath.js");
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * jmGraph画图类库
 * 对canvas画图api进行二次封装，使其更易调用，省去很多重复的工作。
 *
 * @module jmGraph
 * @class jmGraph
 * @extends jmControl
 * @param {element} canvas 标签canvas
 * @param {object} option 参数：{width:宽,height:高}
 * @param {function} callback 初始化后的回调
 */
var jmGraph = exports.jmGraph = exports["default"] = /*#__PURE__*/function (_jmControl) {
  function jmGraph(canvas, option, callback) {
    var _this;
    _classCallCheck(this, jmGraph);
    if (typeof option == 'function') {
      callback = option;
      option = {};
    }
    option = option || {};
    //option.mode = '2d'; // webgl | 2d 暂不支持webgl
    option.interactive = true;
    option.isRegular = true; // 规则的

    _this = _callSuper(this, jmGraph, [option, 'jmGraph']);
    _this.option = option || {};
    _this.devicePixelRatio = 1; // 根据屏幕的缩放倍数

    /**
     * 工具类
     * @property utils/util
     * @type {jmUtils}
     */
    _this.util = _this.utils = _jmUtils.jmUtils;
    // 模式 webgl | 2d
    _this.mode = option.mode || '2d';

    //如果是小程序
    if (typeof wx != 'undefined' && wx.canIUse && wx.canIUse('canvas')) {
      if (typeof canvas === 'string') canvas = wx.createSelectorQuery().select('#' + canvas);
      _this.isWXMiniApp = true; // 微信小程序平台
      _this.container = canvas;
    } else {
      if (typeof canvas === 'string' && typeof document != 'undefined') {
        canvas = document.getElementById(canvas);
      } else if (canvas.length) {
        canvas = canvas[0];
      }
      if (!canvas.getContext && typeof document != 'undefined') {
        _this.container = canvas;
        var cn = document.createElement('canvas');
        canvas.appendChild(cn);
        cn.width = canvas.offsetWidth || canvas.clientWidth;
        cn.height = canvas.offsetHeight || canvas.clientHeight;
        canvas = cn;
      } else {
        _this.container = canvas.parentElement;
      }
    }
    _this.canvas = canvas;
    _this.context = canvas.getContext(_this.mode);
    _this.textureCanvas = option.textureCanvas || null;

    // webgl模式
    if (_this.mode === 'webgl') {
      _this.context.enable(_this.context.BLEND); // 开启混合功能：（注意，它不可和gl.DEPTH_TEST一起使用）
      _this.context.blendFunc(_this.context.SRC_ALPHA, _this.context.ONE_MINUS_SRC_ALPHA); // 指定混合函数：
      // webglcontextlost webglcontextrestored
      _jmUtils.jmUtils.bindEvent(canvas, 'webglcontextlost', function (e) {
        console.log('canvas webglcontextlost', e);
        _this.emit('webglcontextlost', e);
      });
      _jmUtils.jmUtils.bindEvent(canvas, 'webglcontextrestored', function (e) {
        console.log('canvas webglcontextrestored', e);
        _this.emit('webglcontextrestored', e);
      });
    }
    _this.__init(callback);
    return _this;
  }

  /**
   * 初始化画布
   * @method init
   */
  _inherits(jmGraph, _jmControl);
  return _createClass(jmGraph, [{
    key: "__init",
    value: function __init(callback) {
      /**
       * 当前所有图形类型
       * @property shapes
       * @type {object}
       */
      this.shapes = Object.assign({
        "path": _jmPath.jmPath
      }, this.option.shapes);

      /**
       * 画控件前初始化
       * 为了解决一像素线条问题
       */
      this.on('beginDraw', function () {
        this.context.translate && this.context.translate(0.5, 0.5);
      });
      /**
       * 结束控件绘制 为了解决一像素线条问题
       */
      this.on('endDraw', function () {
        this.context.translate && this.context.translate(-0.5, -0.5);
      });

      // devicePixelRatio初始化
      var dpr = typeof window != 'undefined' && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
      if (this.isWXMiniApp) {
        dpr = wx.getWindowInfo().pixelRatio || 1;
      }
      this.devicePixelRatio = dpr;
      // 为了解决锯齿问题，先放大canvas再缩放
      this.dprScaleSize = this.devicePixelRatio > 1 ? this.devicePixelRatio : 2;
      if (this.option.width > 0) this.width = this.option.width;
      if (this.option.height > 0) this.height = this.option.height;
      this.resize();

      //绑定事件
      this.eventHandler = new _jmEvents.jmEvents(this, this.canvas.canvas || this.canvas);

      //如果指定了自动刷新
      if (this.option.autoRefresh) {
        this.autoRefresh();
      }
      if (callback) callback(this);
    }

    //  重置canvas大小，并判断高清屏，画图先放大二倍
  }, {
    key: "resize",
    value: function resize(w, h) {
      if (!this.canvas) return;
      this.__normalSize = this.__normalSize || {
        width: 0,
        height: 0
      };
      w = w || this.__normalSize.width || this.width, h = h || this.__normalSize.height || this.height;
      if (w) this.__normalSize.width = w;
      if (h) this.__normalSize.height = h;
      this.css('width', w + "px");
      this.css('height', h + "px");
      if (this.mode === '2d') {
        this.canvas.height = h * this.dprScaleSize;
        this.canvas.width = w * this.dprScaleSize;
        if (this.dprScaleSize !== 1) this.context.scale && this.context.scale(this.dprScaleSize, this.dprScaleSize);
      } else {
        this.canvas.width = w;
        this.canvas.height = h;
      }
      this.context.viewport && this.context.viewport(0, 0, w, h);
      this.needUpdate = true;
    }

    /**
     * 宽度
     * @property width
     * @type {number}
     */
  }, {
    key: "width",
    get: function get() {
      if (this.__normalSize && this.__normalSize.width) return this.__normalSize.width;
      if (this.canvas) return this.canvas.width;
      return 0;
    },
    set: function set(v) {
      this.needUpdate = true;
      if (this.canvas) {
        this.resize(v);
      }
      return v;
    }

    /**
     * 高度
     * @property height
     * @type {number}
     */
  }, {
    key: "height",
    get: function get() {
      if (this.__normalSize && this.__normalSize.height) return this.__normalSize.height;
      if (this.canvas) return this.canvas.height;
      return 0;
    },
    set: function set(v) {
      this.needUpdate = true;
      if (this.canvas) {
        this.resize(0, v);
      }
      return v;
    }

    /**
     * 创建jmGraph的静态对象
     *
     * @method create
     * @return {jmGraph} jmGraph实例对象
     */
  }, {
    key: "getPosition",
    value:
    /**
     * 获取当前画布在浏览器中的绝对定位
     *
     * @method getPosition
     * @return {postion} 返回定位坐标
     */
    function getPosition() {
      var p = _jmUtils.jmUtils.getElementPosition(this.canvas.canvas || this.canvas);
      p.width = this.width;
      p.height = this.height;
      p.right = p.left + p.width;
      p.bottom = p.top + p.height;
      return p;
    }

    /**
     * 注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。
     *
     * @method registerShape 
     * @param {string} name 控件图形名称
     * @param {class} shape 图形控件类型
     */
  }, {
    key: "registerShape",
    value: function registerShape(name, shape) {
      this.shapes[name] = shape;
    }

    /**
     * 从已注册的图形类创建图形
     * 简单直观创建对象
     *
     * @method createShape 
     * @param {string} shape 注册控件的名称 也可以直接是控件类型
     * @param {object} args 实例化控件的参数
     * @return {object} 已实例化控件的对象
     */
  }, {
    key: "createShape",
    value: function createShape(shape, args) {
      if (typeof shape === 'string') {
        shape = this.shapes[shape];
      }
      if (shape) {
        if (!args) args = {};
        args.graph = this;
        var obj = new shape(args);
        return obj;
      }
    }

    /**
     * 生成阴影对象
     *
     * @method createShadow
     * @param {number} x x偏移量
     * @param {number} y y偏移量
     * @param {number} blur 模糊值
     * @param {string} color 颜色
     * @return {jmShadow} 阴影对象
     */
  }, {
    key: "createShadow",
    value: function createShadow(x, y, blur, color) {
      var sh = new _jmShadow.jmShadow(x, y, blur, color);
      return sh;
    }

    /**
     * 生成线性渐变对象
     *
     * @method createLinearGradient
     * @param {number} x1 线性渐变起始点X坐标
     * @param {number} y1 线性渐变起始点Y坐标
     * @param {number} x2 线性渐变结束点X坐标
     * @param {number} y2 线性渐变结束点Y坐标
     * @return {jmGradient} 线性渐变对象
     */
  }, {
    key: "createLinearGradient",
    value: function createLinearGradient(x1, y1, x2, y2) {
      var stops = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      var gradient = new _jmGradient.jmGradient({
        type: 'linear',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        stops: stops
      });
      return gradient;
    }

    /**
     * 生成放射渐变对象
     *
     * @method createRadialGradient
     * @param {number} x1 放射渐变小圆中心X坐标
     * @param {number} y1 放射渐变小圆中心Y坐标
     * @param {number} r1 放射渐变小圆半径
     * @param {number} x2 放射渐变大圆中心X坐标
     * @param {number} y2 放射渐变大圆中心Y坐标
     * @param {number} r2 放射渐变大圆半径
     * @return {jmGradient} 放射渐变对象
     */
  }, {
    key: "createRadialGradient",
    value: function createRadialGradient(x1, y1, r1, x2, y2, r2) {
      var stops = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
      var gradient = new _jmGradient.jmGradient({
        type: 'radial',
        x1: x1,
        y1: y1,
        r1: r1,
        x2: x2,
        y2: y2,
        r2: r2,
        stops: stops
      });
      return gradient;
    }

    /**
     * 重新刷新整个画板
     * 以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。
     *
     * @method refresh
     */
  }, {
    key: "refresh",
    value: function refresh() {
      //加入动画，触发redraw，会导致多次refresh只redraw一次
      /*this.animate(function() {
      	return false;
      },100,'jmgraph_refresh');*/
      this.redraw();
    }

    /**
     * 重新刷新整个画板
     * 此方法直接重画，与refresh效果类似
     *
     * @method redraw
     * @param {number} [w] 清除画布的宽度
     * @param {number} [h] 清除画布的高度
     */
  }, {
    key: "redraw",
    value: function redraw(w, h) {
      this.clear(w || this.width, h || this.height);
      this.paint();
    }

    /**
     * 清除画布
     * 
     * @method clear
     * @param {number} [w] 清除画布的宽度
     * @param {number} [h] 清除画布的高度
     */
  }, {
    key: "clear",
    value: function clear(w, h) {
      if (!w || !h) {
        w = this.width;
        h = this.height;
        /*if(this.scaleSize) {
        	w = w / this.scaleSize.x;
        	h = h / this.scaleSize.y;
        }*/
      }
      if (this.context.clearRect) {
        if (this.style && this.style.fill) {
          this.points = [{
            x: 0,
            y: 0
          }, {
            x: w,
            y: 0
          }, {
            x: w,
            y: h
          }, {
            x: 0,
            y: h
          }];
          this.style.close = true; // 封闭填充
        }
        this.context.clearRect(0, 0, w, h);
      } else if (this.mode === 'webgl' && this.context.clear) {
        var color = this.style && this.style.fill ? this.utils.hexToRGBA(this.style.fill) : {
          r: 0,
          g: 0,
          b: 0,
          a: 0
        };
        this.context.clearColor(color.r, color.g, color.b, color.a); // 设置清空颜色缓冲时的颜色值
        this.context.clear(this.context.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
      }
    }

    /**
    * 设置画布样式，此处只是设置其css样式
    *
    * @method css
    * @param {string} name 样式名
    * @param {string} value 样式值
    */
  }, {
    key: "css",
    value: function css(name, value) {
      if (this.canvas && this.canvas.style) {
        if (typeof value != 'undefined') this.canvas.style[name] = value;
        return this.canvas.style[name];
      }
    }

    /**
     * 生成路径对象
     *
     * @method createPath
     * @param {array} points 路径中的描点集合
     * @param {style} style 当前路径的样式
     * @return {jmPath} 路径对象jmPath
     */
  }, {
    key: "createPath",
    value: function createPath(points, style) {
      var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = this.createShape('path', _objectSpread({
        points: points,
        style: style
      }, option));
      return path;
    }

    /**
     * 生成直线
     * 
     * @method createLine
     * @param {point} start 直线的起点
     * @param {point} end 直线的终点
     * @param {style} 直线的样式
     * @return {jmLine} 直线对象
     */
  }, {
    key: "createLine",
    value: function createLine(start, end, style) {
      var line = this.createShape('line', {
        start: start,
        end: end,
        style: style
      });
      return line;
    }

    /**
     * 缩小整个画布按比例0.9
     * 
     * @method zoomOut
     */
  }, {
    key: "zoomOut",
    value: function zoomOut() {
      this.scale(0.9, 0.9);
    }

    /**
     * 放大 每次增大0.1的比例
     * 
     * @method zoomIn
     */
  }, {
    key: "zoomIn",
    value: function zoomIn() {
      this.scale(1.1, 1.1);
    }

    /**
     * 大小复原
     * 
     * @method zoomActual
     */
  }, {
    key: "zoomActual",
    value: function zoomActual() {
      if (this.scaleSize) {
        this.scale(1 / this.scaleSize.x, 1 / this.scaleSize.y);
      } else {
        this.scale(1, 1);
      }
    }

    /**
     * 放大缩小画布
     * 
     * @method scale
     * @param {number} dx 缩放X轴比例
     * @param {number} dy 缩放Y轴比例
     */
  }, {
    key: "scale",
    value: function scale(dx, dy) {
      if (!this.normalSize) {
        this.normalSize = {
          width: this.canvas.width,
          height: this.canvas.height
        };
      }

      //this.context.scale && this.context.scale(dx,dy);
      if (!this.scaleSize) {
        this.scaleSize = {
          x: 1,
          y: 1
        };
      } else {
        this.scaleSize = {
          x: dx * this.scaleSize.x,
          y: dy * this.scaleSize.y
        };
      }
      this.canvas.style && (this.canvas.style.transform = "scale(".concat(this.scaleSize.x, ", ").concat(this.scaleSize.y, ")"));
    }

    /**
     * 保存为base64图形数据
     * 
     * @method toDataURL
     * @return {string} 当前画布图的base64字符串
     */
  }, {
    key: "toDataURL",
    value: function toDataURL() {
      var data = this.canvas.toDataURL ? this.canvas.toDataURL() : '';
      return data;
    }

    /** 
     * 自动刷新画版
     * @param {function} callback 执行回调
     */
  }, {
    key: "autoRefresh",
    value: function autoRefresh(callback) {
      if (this.___isAutoRefreshing) return;
      var self = this;
      this.___isAutoRefreshing = true;
      var refreshStartTime = Date.now();
      function update() {
        if (self.destroyed) {
          self.___isAutoRefreshing = false;
          return; // 已销毁
        }
        if (self.needUpdate) self.redraw();
        var time = Date.now() - refreshStartTime;
        // 触发刷新事件
        self.emit('update', time);
        self.__requestAnimationFrameFunHandler && self.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
        self.__requestAnimationFrameFunHandler = self.requestAnimationFrame(update);
        if (callback) callback();
      }
      self.__requestAnimationFrameFunHandler && this.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
      self.__requestAnimationFrameFunHandler = this.requestAnimationFrame(update);
      return this;
    }

    // 销毁当前对象
  }, {
    key: "destroy",
    value: function destroy() {
      this.eventHandler.destroy();
      this.destroyed = true; // 标记已销毁
    }
  }], [{
    key: "create",
    value: function create() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return _construct(jmGraph, args);
    }
  }]);
}(_jmControl2.jmControl);

},{"./jmControl.js":2,"./jmEvents.js":3,"./jmGradient.js":4,"./jmList.js":6,"./jmPath.js":8,"./jmProperty.js":9,"./jmShadow.js":10,"./jmUtils.js":11}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmList = exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
/**
 * 自定义集合
 * 
 * @class jmList
 * @for jmUtils
 * @param {array} [arr] 数组，可转为当前list元素
 */
var jmList = exports.jmList = exports["default"] = /*#__PURE__*/function (_Array) {
  function jmList() {
    var _this;
    _classCallCheck(this, jmList);
    var ps = [];
    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }
    if (arg && arg.length && Array.isArray(arg[0])) {
      for (var i = 0; i < arg[0].length; i++) ps.push(arg[0][i]);
      _this = _callSuper(this, jmList, [].concat(ps));
    } else {
      _this = _callSuper(this, jmList);
    }
    _this.option = {}; //选项
    _this.type = 'jmList';
    return _assertThisInitialized(_this);
  }
  /**
   * 往集合中添加对象
   *
   * @method add
   * @for list
   * @param {any} obj 往集合中添加的对象
   */
  _inherits(jmList, _Array);
  return _createClass(jmList, [{
    key: "add",
    value: function add(obj) {
      if (obj && Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
          if (!this.includes(obj[i])) this.push(obj[i]);
        }
        return obj;
      }
      if (_typeof(obj) == 'object' && this.includes(obj)) return obj;
      this.push(obj);
      return obj;
    }

    /**
     * 从集合中移除指定对象
     * 
     * @method remove
     * @for list
     * @param {any} obj 将移除的对象
     */
  }, {
    key: "remove",
    value: function remove(obj) {
      for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] == obj) {
          this.removeAt(i);
        }
      }
    }

    /**
     * 按索引移除对象
     * 
     * @method removeAt
     * @for list
     * @param {integer} index 移除对象的索引
     */
  }, {
    key: "removeAt",
    value: function removeAt(index) {
      if (this.length > index) {
        var obj = this[index];
        this.splice(index, 1);
        if (this.option.removeHandler) this.option.removeHandler.call(this, obj, index);
      }
    }

    /**
     * 判断是否包含某个对象
     * 
     * @method contain
     * @for list
     * @param {any} obj 判断当前集合中是否包含此对象
     */
  }, {
    key: "contain",
    value: function contain(obj) {
      return this.includes(obj);
    }

    /**
     * 从集合中获取某个对象
     * 
     * @method get
     * @for list
     * @param {integer/function} index 如果为整型则表示为获取此索引的对象，如果为function为则通过此委托获取对象
     * @return {any} 集合中的对象
     */
  }, {
    key: "get",
    value: function get(index) {
      if (typeof index == 'function') {
        return this.find(index);
      } else {
        return this[index];
      }
    }

    /**
     * 遍历当前集合 
     *
     * @method each
     * @for list
     * @param {function} cb 遍历当前集合的委托
     * @param {boolean} inverse 是否按逆序遍历
     */
  }, {
    key: "each",
    value: function each(cb, inverse) {
      if (cb && typeof cb == 'function') {
        //如果按倒序循环
        if (inverse) {
          for (var i = this.length - 1; i >= 0; i--) {
            var r = cb.call(this, i, this[i]);
            if (r === false) break;
          }
        } else {
          var len = this.length;
          for (var _i = 0; _i < len; _i++) {
            var _r = cb.call(this, _i, this[_i]);
            if (_r === false) break;
          }
        }
      }
    }

    /**
     * 获取当前集合对象个数
     *
     * @method count
     * @param {function} [handler] 检查对象是否符合计算的条件
     * @for list
     * @return {integer} 当前集合的个数
     */
  }, {
    key: "count",
    value: function count(handler) {
      if (handler && typeof handler == 'function') {
        var _count = 0;
        var len = this.length;
        for (var i = 0; i < len; i++) {
          if (handler(this[i])) {
            _count++;
          }
        }
        return _count;
      }
      return this.length;
    }

    /**
     * 清空当前集合
     *
     * @method clear
     * @for list
     */
  }, {
    key: "clear",
    value: function clear() {
      this.splice(0, this.length);
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(Array));

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmObject = exports["default"] = void 0;
var _jmList = require("./jmList.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var control_id_counter = 0;
/**
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @for jmGraph
 */
var jmObject = exports.jmObject = exports["default"] = /*#__PURE__*/function () {
  //id;
  function jmObject(g) {
    _classCallCheck(this, jmObject);
    if (g && g.type == 'jmGraph') {
      this.graph = g;
    }
    this.id = ++control_id_counter; //生成一个唯一id
  }

  /**
   * 检 查对象是否为指定类型
   * 
   * @method is
   * @param {class} type 判断的类型
   * @for jmObject
   * @return {boolean} true=表示当前对象为指定的类型type,false=表示不是
   */
  return _createClass(jmObject, [{
    key: "is",
    value: function is(type) {
      if (typeof type == 'string') {
        return this.type == type;
      }
      return this instanceof type;
    }

    /**
     * 给控件添加动画处理,如果成功执行会导致画布刷新。
     *
     * @method animate
     * @for jmObject
     * @param {function} handle 动画委托
     * @param {integer} millisec 此委托执行间隔 （毫秒）
     */
  }, {
    key: "animate",
    value: function animate() {
      if (this.is('jmGraph')) {
        if (arguments.length > 1) {
          if (!this.animateHandles) this.animateHandles = new _jmList.jmList();
          var params = [];
          if (arguments.length > 2) {
            for (var i = 2; i < arguments.length; i++) {
              params.push(i < 0 || arguments.length <= i ? undefined : arguments[i]);
            }
          }
          this.animateHandles.add({
            millisec: (arguments.length <= 1 ? undefined : arguments[1]) || 20,
            handle: arguments.length <= 0 ? undefined : arguments[0],
            params: params
          });
        }
        if (this.animateHandles) {
          if (this.animateHandles.count() > 0) {
            var self = this;
            //延时处理动画事件
            this.dispatcher = setTimeout(function (_this) {
              _this = _this || self;
              //var needredraw = false;
              var overduehandles = [];
              var curTimes = new Date().getTime();
              _this.animateHandles.each(function (i, ani) {
                try {
                  if (ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
                    var r = ani.handle.apply(_this, ani.params);
                    if (r === false) {
                      overduehandles.push(ani); //表示已完成的动画效果
                    }
                    ani.times = curTimes;
                    //needredraw = true;								
                  }
                } catch (e) {
                  if (window.console && window.console.info) {
                    window.console.info(e.toString());
                  }
                  if (ani) overduehandles.push(ani); //异常的事件，不再执行
                }
              });
              for (var i in overduehandles) {
                _this.animateHandles.remove(overduehandles[i]); //移除完成的效果
              }
              _this.animate();
            }, 10, this); //刷新				
          }
        }
      } else {
        var graph = this.graph;
        if (graph) {
          graph.animate.apply(graph, arguments);
        }
      }
    }
  }]);
}();

},{"./jmList.js":6}],8:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmPath = exports["default"] = void 0;
var _jmControl2 = require("./jmControl.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @extends jmControl
 * @param {object} params 路径参数 points=所有描点
 */
var jmPath = exports.jmPath = exports["default"] = /*#__PURE__*/function (_jmControl) {
  function jmPath(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmPath';
    _classCallCheck(this, jmPath);
    _this = _callSuper(this, jmPath, [params, t]);
    _this.points = params && params.points ? params.points : [];
    return _this;
  }

  /**
   * 描点集合
   * point格式：{x:0,y:0,m:true}
   * @property points
   * @type {array}
   */
  _inherits(jmPath, _jmControl);
  return _createClass(jmPath, [{
    key: "points",
    get: function get() {
      var s = this.property('points');
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('points', v);
    }
  }]);
}(_jmControl2.jmControl);

},{"./jmControl.js":2}],9:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmProperty = exports["default"] = void 0;
var _jmUtils = require("./jmUtils.js");
var _jmObject2 = require("./jmObject.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var PROPERTY_KEY = Symbol("properties");

/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @extends jmObject
 * @require jmObject
 */
var jmProperty = exports.jmProperty = exports["default"] = /*#__PURE__*/function (_jmObject) {
  function jmProperty(params) {
    var _this;
    _classCallCheck(this, jmProperty);
    _this = _callSuper(this, jmProperty);
    _this[PROPERTY_KEY] = {};
    if (params && params.mode) _this.mode = params.mode;
    return _this;
  }

  /**
   * 基础属性读写接口
   * @method property
   * @param {string} name 属性名
   * @param {any} value 属性的值
   * @returns {any} 属性的值
   */
  _inherits(jmProperty, _jmObject);
  return _createClass(jmProperty, [{
    key: "property",
    value: function property() {
      for (var _len = arguments.length, pars = new Array(_len), _key = 0; _key < _len; _key++) {
        pars[_key] = arguments[_key];
      }
      if (pars) {
        var pros = this[PROPERTY_KEY];
        var name = pars[0];
        if (pars.length > 1) {
          var value = pars[1];
          var args = {
            oldValue: pros[name],
            newValue: value
          };
          pros[name] = pars[1];
          if (this.emit) this.emit('propertyChange', name, args);
          return pars[1];
        } else if (name) {
          return pros[name];
        }
      }
    }

    /**
     * 是否需要刷新画板，属性的改变会导致它变为true
     * @property needUpdate
     * @type {boolean}
     */
  }, {
    key: "needUpdate",
    get: function get() {
      return this.property('needUpdate');
    },
    set: function set(v) {
      this.property('needUpdate', v);
      //子控件属性改变，需要更新整个画板
      if (v && !this.is('jmGraph') && this.graph) {
        this.graph.needUpdate = true;
      }
    }

    /**
     * 当前所在的画布对象 jmGraph
     * @property graph
     * @type {jmGraph}
     */
  }, {
    key: "graph",
    get: function get() {
      var g = this.property('graph');
      g = g || this.property('graph', this.findParent('jmGraph'));
      return g;
    },
    set: function set(v) {
      return this.property('graph', v);
    }

    /**
     * 绘制模式 2d/webgl
     * @property mode
     * @type {string}
     */
  }, {
    key: "mode",
    get: function get() {
      var m = this.property('mode');
      if (m) return m;else if (this.is('jmGraph')) return this.property('mode');
      return this.graph.mode;
    },
    set: function set(v) {
      return this.property('mode', v);
    }

    /**
     * 在下次进行重绘时执行
     * @param {Function} handler 
     */
  }, {
    key: "requestAnimationFrame",
    value: function requestAnimationFrame(handler) {
      return _jmUtils.jmUtils.requestAnimationFrame(handler, this.graph ? this.graph.canvas : null);
    }
    /**
     * 清除执行回调
     * @param {Function} handler 
     * @returns 
     */
  }, {
    key: "cancelAnimationFrame",
    value: function cancelAnimationFrame(handler) {
      return _jmUtils.jmUtils.cancelAnimationFrame(handler, this.graph ? this.graph.canvas : null);
    }
  }]);
}(_jmObject2.jmObject);

},{"./jmObject.js":7,"./jmUtils.js":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmShadow = exports["default"] = void 0;
var _jmUtils = require("./jmUtils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 画图阴影对象表示法
 *
 * @class jmShadow
 * @param {number} x 横坐标偏移量
 * @param {number} y 纵坐标编移量
 * @param {number} blur 模糊值
 * @param {string} color 阴影的颜色
 */
var jmShadow = exports.jmShadow = exports["default"] = /*#__PURE__*/function () {
  function jmShadow(x, y, blur, color) {
    _classCallCheck(this, jmShadow);
    if (typeof x == 'string' && !y && !blur && !color) {
      this.fromString(x);
    } else {
      this.x = x;
      this.y = y;
      this.blur = blur;
      this.color = color;
    }
  }
  /**
   * 根据字符串格式转为阴影
   * @method fromString
   * @param {string} s 阴影字符串 x,y,blur,color
   */
  return _createClass(jmShadow, [{
    key: "fromString",
    value: function fromString(s) {
      if (!s) return;
      var ms = s.match(/\s*([^,]+)\s*,\s*([^,]+)\s*(,[^,]+)?\s*(,[\s\S]+)?\s*/i);
      if (ms) {
        this.x = ms[1] || 0;
        this.y = ms[2] || 0;
        if (ms[3]) {
          ms[3] = _jmUtils.jmUtils.trim(ms[3], ', ');
          //如果第三位是颜色格式，则表示为颜色
          if (ms[3].indexOf('#') === 0 || /^rgb/i.test(ms[3])) {
            this.color = ms[3];
          } else {
            this.blur = _jmUtils.jmUtils.trim(ms[3], ', ');
          }
        }
        if (ms[4]) {
          this.color = _jmUtils.jmUtils.trim(ms[4], ', ');
        }
      }
      return this;
    }

    /**
     * 转为字符串格式 x,y,blur,color
     * @method toString
     * @returns {string} 阴影字符串
     */
  }, {
    key: "toString",
    value: function toString() {
      var s = this.x + ',' + this.y;
      if (this.blur) s += ',' + this.blur;
      if (this.color) s += ',' + this.color;
      return s;
    }
  }]);
}();

},{"./jmUtils.js":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmUtils = exports["default"] = void 0;
var _jmList = require("./jmList.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var colorKeywords = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgrey: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370d8",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#d87093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
  transparent: "rgba(0,0,0,0)"
};

/**
 * 画图基础对象
 * 当前库的工具类
 * 
 * @class jmUtils
 * @static
 */
var jmUtils = exports.jmUtils = exports["default"] = /*#__PURE__*/function () {
  function jmUtils() {
    _classCallCheck(this, jmUtils);
  }
  return _createClass(jmUtils, null, [{
    key: "clone",
    value:
    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {object} target 可选，如果指定就表示复制给这个对象，如果为boolean它就是deep参数
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @param {function} copyHandler 复制对象回调，如果返回undefined，就走后面的逻辑，否则到这里中止
     * @return {object} 参数source的拷贝对象
     */
    function clone(source, target) {
      var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var copyHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var deepIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      // 如果有指定回调，则用回调处理，否则走后面的复制逻辑
      if (typeof copyHandler === 'function') {
        var obj = copyHandler(source, deep, deepIndex);
        if (obj) return obj;
      }
      deepIndex++; // 每执行一次，需要判断最大拷贝深度        

      if (typeof target === 'boolean') {
        deep = target;
        target = undefined;
      }

      // 超过100拷贝深度，直接返回
      if (deepIndex > 100) {
        return target;
      }
      if (source && _typeof(source) === 'object') {
        target = target || {};

        //如果为当前泛型，则直接new
        if (this.isType(source, _jmList.jmList)) {
          return new _jmList.jmList(source);
        } else if (Array.isArray(source)) {
          //如果是深度复，则拷贝每个对象
          if (deep) {
            var dest = [];
            for (var i = 0; i < source.length; i++) {
              dest.push(this.clone(source[i], target[i], deep, copyHandler, deepIndex));
            }
            return dest;
          }
          return source.slice(0);
        }
        if (source.__proto__) target.__proto__ = source.__proto__;
        for (var k in source) {
          if (k === 'constructor') continue;
          var v = source[k];
          // 不复制页面元素和class对象
          if (v && (v.tagName || v.getContext)) {
            target[k] = v;
            continue;
          }

          // 如果不是对象和空，则采用target的属性
          if (_typeof(target[k]) === 'object' || typeof target[k] === 'undefined') {
            target[k] = this.clone(v, target[k], deep, copyHandler, deepIndex);
          }
        }
        return target;
      } else if (typeof target != 'undefined') {
        return target;
      }
      return source;
    }

    /**
     * 绑定事件到html对象
     * 
     * @method bindEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     * @returns {name, fun, target} 返回当前绑定
     */
  }, {
    key: "bindEvent",
    value: function bindEvent(target, name, fun, opt) {
      if (name && name.indexOf && name.indexOf(' ') != -1) {
        var ns = name.split(' ');
        for (var i = 0; i < ns.length; i++) {
          this.bindEvent(target, ns[i], fun, opt);
        }
      }
      if (target.attachEvent) {
        target.attachEvent("on" + name, fun, opt);
      } else if (target.addEventListener) {
        target.addEventListener(name, fun, opt);
      }
      return {
        name: name,
        target: target,
        fun: fun
      };
    }

    /**
     * 从对象中移除事件到
     * 
     * @method removeEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     */
  }, {
    key: "removeEvent",
    value: function removeEvent(target, name, fun) {
      if (target.removeEventListener) {
        return target.removeEventListener(name, fun, false);
      } else if (target.detachEvent) {
        target.detachEvent('on' + name, fun);
        return true;
      } else {
        target['on' + name] = null;
      }
    }

    /**
     * 获取元素的绝对定位
     *
     * @method getElementPosition
     * @static
     * @param {element} el 目标元素对象
     * @return {position} 位置对象(top,left)
     */
  }, {
    key: "getElementPosition",
    value: function getElementPosition(el) {
      var pos = {
        "top": 0,
        "left": 0
      };
      if (!el) return pos;
      if (el.offsetParent) {
        while (el.offsetParent) {
          pos.top += el.offsetTop;
          pos.left += el.offsetLeft;
          el = el.offsetParent;
        }
      } else if (el.x) {
        pos.left += el.x;
      } else if (el.x) {
        pos.top += el.y;
      }
      return pos;
    }
    /**
     * 获取元素事件触发的位置
     *
     * @method getEventPosition
     * @static
     * @param {eventArg} evt 当前触发事件的参数
     * @param {point} [scale] 当前画布的缩放比例
     * @return {point} 事件触发的位置 
     */
  }, {
    key: "getEventPosition",
    value: function getEventPosition(evt, scale) {
      evt = evt || event;
      var isTouch = false;
      var touches = evt.changedTouches || evt.targetTouches || evt.touches;
      var target = evt.target || evt.srcElement;
      if (touches && touches.length) {
        evt = touches[0]; //兼容touch事件
        if (!evt.target) evt.target = target;
        isTouch = true;
      }
      var px = evt.pageX || evt.x;
      if (typeof px == 'undefined') px = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
      var py = evt.pageY || evt.y;
      if (typeof py == 'undefined') py = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
      var ox = evt.offsetX;
      var oy = evt.offsetY;
      if (typeof ox === 'undefined' && typeof oy === 'undefined') {
        // 小程序下取x,y就是它的相对坐标
        if (evt.isWXMiniApp) {
          ox = evt.x;
          oy = evt.y;
        } else {
          var p = this.getElementPosition(target);
          ox = px - p.left;
          oy = py - p.top;
        }
      }
      if (scale) {
        if (scale.x) ox = ox / scale.x;
        if (scale.y) oy = oy / scale.y;
      }
      return {
        pageX: px,
        pageY: py,
        clientX: evt.clientX,
        clientY: evt.clientY,
        //相对于容器偏移量
        offsetX: ox,
        offsetY: oy,
        layerX: evt.layerX,
        layerY: evt.layerY,
        screenX: evt.screenX,
        screenY: evt.screenY,
        x: ox,
        y: oy,
        isTouch: isTouch,
        touches: touches
      };
    }

    /**
     * 检 查对象是否为指定的类型,不包括继承
     * 
     * @method isType
     * @static
     * @param {object} target 需要判断类型的对象
     * @param {class} type 对象类型
     * @return {boolean} 返回对象是否为指定类型 
     */
  }, {
    key: "isType",
    value: function isType(target, type) {
      if (!target || _typeof(target) !== 'object') return false;
      if (target.constructor === type) return true;
      /*if(target.__baseType) {        
          return jmUtils.isType(target.__baseType.prototype,type);
      }*/

      //return target instanceof type;
      return false;
    }
    /**
     * 判断点是否在多边形内
     * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠。
     * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
     * 利用上面的结论，我们只要判断这个点与多边形的交点个数，就可以判断出点与多边形的位置关系了。
     * 
     * @method pointInPolygon
     * @static
     * @param {point} pt 坐标对象
     * @param {array} polygon 多边型角坐标对象数组
     * @param {number} offset 判断可偏移值
     * @return {integer} 0= 不在图形内和线上，1=在边上，2=在图形内部
     */
  }, {
    key: "pointInPolygon",
    value: function pointInPolygon(pt, polygon, offset) {
      offset = offset || 1;
      offset = offset / 2;
      var i,
        j,
        n = polygon.length;
      var inside = false,
        redo = true;
      if (!polygon || n == 0) return 0;
      if (n == 1) {
        return Math.abs(polygon[0].x - pt.x) <= offset && Math.abs(polygon[0].y - pt.y) <= offset;
      }

      //一条直线
      else if (n == 2) {
        //在最左边之外或在最右边之外
        if (Math.min(polygon[0].x, polygon[1].x) - pt.x > offset || pt.x - Math.max(polygon[0].x, polygon[1].x) > offset) {
          return 0;
        }
        //在最顶部之外或在最底部之外
        if (Math.min(polygon[0].y, polygon[1].y) - pt.y > offset || pt.y - Math.max(polygon[0].y, polygon[1].y) > offset) {
          return 0;
        }

        //如果线为平行为纵坐标。
        if (polygon[0].x == polygon[1].x) {
          return Math.abs(polygon[0].x - pt.x) <= offset && (pt.y - polygon[0].y) * (pt.y - polygon[1].y) <= 0 ? 1 : 0;
        }
        //如果线为平行为横坐标。
        if (polygon[0].y == polygon[1].y) {
          return Math.abs(polygon[0].y - pt.y) <= offset && (pt.x - polygon[0].x) * (pt.x - polygon[1].x) <= 0 ? 1 : 0;
        }
        if (Math.abs(polygon[0].x - pt.x) < offset && Math.abs(polygon[0].y - pt.y) < offset) {
          return 1;
        }
        if (Math.abs(polygon[1].x - pt.x) < offset && Math.abs(polygon[1].y - pt.y) < offset) {
          return 1;
        }

        //点到直线的距离小于宽度的一半，表示在线上
        if (pt.y != polygon[0].y && pt.y != polygon[1].y) {
          var f = (polygon[1].x - polygon[0].x) / (polygon[1].y - polygon[0].y) * (pt.y - polygon[0].y);
          var ff = (pt.y - polygon[0].y) / Math.sqrt(f * f + (pt.y - polygon[0].y) * (pt.y - polygon[0].y));
          var l = ff * (pt.x - polygon[0].x - f);
          return Math.abs(l) <= offset ? 1 : 0;
        }
        return 0;
      }
      for (i = 0; i < n; ++i) {
        if (polygon[i].x == pt.x &&
        // 是否在顶点上
        polygon[i].y == pt.y) {
          return 1;
        }
      }

      //pt = this.clone(pt);
      while (redo) {
        redo = false;
        inside = false;
        for (i = 0, j = n - 1; i < n; j = i++) {
          if (polygon[i].y < pt.y && pt.y < polygon[j].y || polygon[j].y < pt.y && pt.y < polygon[i].y) {
            if (pt.x <= polygon[i].x || pt.x <= polygon[j].x) {
              var _x = (pt.y - polygon[i].y) * (polygon[j].x - polygon[i].x) / (polygon[j].y - polygon[i].y) + polygon[i].x;
              if (pt.x < _x)
                // 在线的左侧
                inside = !inside;else if (pt.x == _x)
                // 在线上
                {
                  return 1;
                }
            }
          } else if (pt.y == polygon[i].y) {
            if (pt.x < polygon[i].x) {
              // 交点在顶点上                    
              if (polygon[i].y > polygon[j].y) {
                --pt.y;
              } else {
                ++pt.y;
              }
              redo = true;
              break;
            }
          } else if (polygon[i].y == polygon[j].y &&
          // 在水平的边界线上
          pt.y == polygon[i].y && (polygon[i].x < pt.x && pt.x < polygon[j].x || polygon[j].x < pt.x && pt.x < polygon[i].x)) {
            inside = true;
            break;
          }
        }
      }
      return inside ? 2 : 0;
    }

    /**
     * @method judge 判断点是否在多边形中
     * @param {point} dot {{x,y}} 需要判断的点
     * @param {array} coordinates {{x,y}} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
     *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
     * @param  {number} 是否为实心 1= 是
     * @returns {boolean} 结果 true=在形状内
     */
    /*static judge(dot,coordinates,noneZeroMode) {
        // 默认启动none zero mode
        noneZeroMode=noneZeroMode||1;
        var x = dot.x,y=dot.y;
        var crossNum = 0;
        // 点在线段的左侧数目
        var leftCount = 0;
        // 点在线段的右侧数目
        var rightCount = 0;
        for(var i=0;i<coordinates.length-1;i++){
            var start = coordinates[i];
            var end = coordinates[i+1];
                
            // 起点、终点斜率不存在的情况
            if(start.x===end.x) {
                // 因为射线向右水平，此处说明不相交
                if(x>start.x) continue;
                
                // 从左侧贯穿
                if((end.y>start.y&&y>=start.y && y<=end.y)){
                    leftCount++;
                    crossNum++;
                }
                // 从右侧贯穿
                if((end.y<start.y&&y>=end.y && y<=start.y)) {
                    rightCount++;
                    crossNum++;
                }
                continue;
            }
            // 斜率存在的情况，计算斜率
            var k=(end.y-start.y)/(end.x-start.x);
            // 交点的x坐标
            var x0 = (y-start.y)/k+start.x;
            // 因为射线向右水平，此处说明不相交
            if(x>x0) continue;
                
            if((end.x>start.x&&x0>=start.x && x0<=end.x)){
                crossNum++;
                if(k>=0) leftCount++;
                else rightCount++;
            }
            if((end.x<start.x&&x0>=end.x && x0<=start.x)) {
                crossNum++;
                if(k>=0) rightCount++;
                else leftCount++;
            }
        }
        
        return noneZeroMode===1?leftCount-rightCount!==0:crossNum%2===1;
    }*/

    /**
     * 检查边界，子对象是否超出父容器边界
     * 当对象偏移offset后是否出界
     * 返回(left:0,right:0,top:0,bottom:0)
     * 如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
     * 如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量
     *
     * @method checkOutSide
     * @static
     * @param {bound} parentBounds 父对象的边界
     * @param {bound} targetBounds 对象的边界
     * @param {number} offset 判断是否越界可容偏差
     * @return {bound} 越界标识
     */
  }, {
    key: "checkOutSide",
    value: function checkOutSide(parentBounds, targetBounds, offset) {
      var result = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      if (offset.x < 0) {
        result.left = targetBounds.left + offset.x - parentBounds.left;
      } else if (offset.x > 0) {
        result.right = targetBounds.right + offset.x - parentBounds.right;
      }
      if (offset.y < 0) {
        result.top = targetBounds.top + offset.y - parentBounds.top;
      } else if (offset.y > 0) {
        result.bottom = targetBounds.bottom + offset.y - parentBounds.bottom;
      }
      return result;
    }

    /**
     * 把一个或多个点绕某个点旋转一定角度
     * 先把坐标原点移到旋转中心点，计算后移回
     * @method rotatePoints
     * @static
     * @param {Array/object} p 一个或多个点
     * @param {*} rp 旋转中心点
     * @param {*} r 旋转角度
     */
  }, {
    key: "rotatePoints",
    value: function rotatePoints(p, rp, r) {
      if (!r || !p) return p;
      var cos = Math.cos(r);
      var sin = Math.sin(r);
      if (Array.isArray(p)) {
        for (var i = 0; i < p.length; i++) {
          if (!p[i]) continue;
          var x1 = p[i].x - rp.x;
          var y1 = p[i].y - rp.y;
          p[i].x = x1 * cos - y1 * sin + rp.x;
          p[i].y = x1 * sin + y1 * cos + rp.y;
        }
      } else {
        var _x2 = p.x - rp.x;
        var _y = p.y - rp.y;
        p.x = _x2 * cos - _y * sin + rp.x;
        p.y = _x2 * sin + _y * cos + rp.y;
      }
      return p;
    }

    /**
     * 去除字符串开始字符
     * 
     * @method trimStart
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的前置字符
     * @return {string} 去除前置字符后的字符串
     */
  }, {
    key: "trimStart",
    value: function trimStart(source, c) {
      c = c || ' ';
      if (source && source.length > 0) {
        var sc = source[0];
        if (sc === c || c.indexOf(sc) >= 0) {
          source = source.substring(1);
          return this.trimStart(source, c);
        }
      }
      return source;
    }

    /**
     * 去除字符串结束的字符c
     *
     * @method trimEnd
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的后置字符
     * @return {string} 去除后置字符后的字符串
     */
  }, {
    key: "trimEnd",
    value: function trimEnd(source, c) {
      c = c || ' ';
      if (source && source.length > 0) {
        var sc = source[source.length - 1];
        if (sc === c || c.indexOf(sc) >= 0) {
          source = source.substring(0, source.length - 1);
          return this.trimStart(source, c);
        }
      }
      return source;
    }

    /**
     * 去除字符串开始与结束的字符
     *
     * @method trim
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的字符
     * @return {string} 去除字符后的字符串
     */
  }, {
    key: "trim",
    value: function trim(source, c) {
      return this.trimEnd(this.trimStart(source, c), c);
    }

    /**
     * 检查是否为百分比参数
     *
     * @method checkPercent
     * @static
     * @param {string} 字符串参数
     * @return {boolean} true=当前字符串为百分比参数,false=不是
     */
  }, {
    key: "checkPercent",
    value: function checkPercent(per) {
      if (typeof per === 'string') {
        per = this.trim(per);
        if (per[per.length - 1] == '%') {
          return per;
        }
      }
    }

    /**
     * 转换百分数为数值类型
     *
     * @method percentToNumber
     * @static
     * @param {string} per 把百分比转为数值的参数
     * @return {number} 百分比对应的数值
     */
  }, {
    key: "percentToNumber",
    value: function percentToNumber(per) {
      if (typeof per === 'string') {
        var tmp = this.checkPercent(per);
        if (tmp) {
          per = this.trim(tmp, '% ');
          per = per / 100;
        }
      }
      return per;
    }

    /**
     * 转换16进制为数值
     *
     * @method hexToNumber
     * @static
     * @param {string} h 16进制颜色表达
     * @return {number} 10进制表达
     */
  }, {
    key: "hexToNumber",
    value: function hexToNumber(h) {
      if (typeof h !== 'string') return h;
      h = h.toLowerCase();
      var hex = '0123456789abcdef';
      var v = 0;
      var l = h.length;
      for (var i = 0; i < l; i++) {
        var iv = hex.indexOf(h[i]);
        if (iv == 0) continue;
        for (var j = 1; j < l - i; j++) {
          iv *= 16;
        }
        v += iv;
      }
      return v;
    }

    /**
     * 转换数值为16进制字符串表达
     *
     * @method hex
     * @static
     * @param {number} v 数值
     * @return {string} 16进制表达
     */
  }, {
    key: "numberToHex",
    value: function numberToHex(v) {
      var hex = '0123456789abcdef';
      var h = '';
      while (v > 0) {
        var t = v % 16;
        h = hex[t] + h;
        v = Math.floor(v / 16);
      }
      return h;
    }

    /**
     * 16进制颜色转为r g b a 对象 {r, g , b, a}
     * @param {string}} hex 16进度的颜色
     */
  }, {
    key: "hexToRGBA",
    value: function hexToRGBA(hex) {
      if (typeof hex === 'string') hex = this.trim(hex);else return hex;

      // 如果缓存存在，则直接返回
      this.__hexToRGBA_Cache = this.__hexToRGBA_Cache || {};
      if (this.__hexToRGBA_Cache[hex]) return this.__hexToRGBA_Cache[hex];
      var res = hex;

      // 系统颜色
      if (colorKeywords[res]) res = colorKeywords[res];

      //当为7位时，表示需要转为带透明度的rgba
      if (res[0] == '#') {
        var color = {
          a: 1
        };
        if (res.length >= 8) {
          color.a = res.substr(1, 2);
          color.g = res.substr(5, 2);
          color.b = res.substr(7, 2);
          color.r = res.substr(3, 2);
          //透明度
          color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));
          color.r = this.hexToNumber(color.r || 0);
          color.g = this.hexToNumber(color.g || 0);
          color.b = this.hexToNumber(color.b || 0);
          res = color;
        }
        // #cccccc || #ccc
        else if (res.length === 7 || res.length === 4) {
          // #ccc这种情况，把每个位复制一份
          if (res.length === 4) {
            color.g = res.substr(2, 1);
            color.g = color.g + color.g;
            color.b = res.substr(3, 1);
            color.b = color.b + color.b;
            color.r = res.substr(1, 1);
            color.r = color.r + color.r;
          } else {
            color.g = res.substr(3, 2); //除#号外的第二位
            color.b = res.substr(5, 2);
            color.r = res.substr(1, 2);
          }
          color.r = this.hexToNumber(color.r || 0);
          color.g = this.hexToNumber(color.g || 0);
          color.b = this.hexToNumber(color.b || 0);
          res = color;
        }
        //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
        else if (res.length === 5) {
          color.a = res.substr(1, 1);
          color.g = res.substr(3, 1); //除#号外的第二位
          color.b = res.substr(4, 1);
          color.r = res.substr(2, 1);
          color.r = this.hexToNumber(color.r || 0);
          color.g = this.hexToNumber(color.g || 0);
          color.b = this.hexToNumber(color.b || 0);
          //透明度
          color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));
          res = color;
        }
      }
      if (typeof res === 'string') {
        var m = res.match(/rgb(a)?\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*(,\s*[\d\.]+)?\s*\)/i);
        if (m && m.length === 6) {
          var _color = {
            r: Number(m[2]),
            g: Number(m[3]),
            b: Number(m[4]),
            a: Number(this.trimStart(m[5] || '1', ','))
          };
          res = _color;
        }
      }
      return this.__hexToRGBA_Cache[hex] = res;
    }

    /**
     * 把255的rgb值转为0-1的值
     * @param {rgba} color 颜色
     */
  }, {
    key: "rgbToDecimal",
    value: function rgbToDecimal(color) {
      color = this.clone(color);
      color.r = this.byteToDecimal(color.r);
      color.g = this.byteToDecimal(color.g);
      color.b = this.byteToDecimal(color.b);
      return color;
    }

    //255值转为0-1的小数
  }, {
    key: "byteToDecimal",
    value: function byteToDecimal(b) {
      return b / 255;
    }

    /**
     * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
     *
     * @method toColor
     * @static
     * @param {string} hex 16进制颜色表达
     * @return {string} 颜色字符串
     */
  }, {
    key: "toColor",
    value: function toColor(r, g, b, a) {
      if (typeof r === 'string' && r) {
        r = this.trim(r);
        // 正常的颜色表达，不需要转换
        if (r[0] === '#' && (r.length === 4 || r.length === 7)) return r;
        var color = this.hexToRGBA(r);
        if (typeof color === 'string') return color;
        r = typeof color.r !== 'undefined' ? color.r : r;
        g = typeof color.g !== 'undefined' ? color.g : g;
        b = typeof color.b !== 'undefined' ? color.b : b;
        a = typeof color.a !== 'undefined' ? color.a : a;
      }
      if (r && _typeof(r) === 'object') {
        g = r.g;
        b = r.b;
        a = r.a || 1;
        r = r.r;
      }
      if (typeof r != 'undefined' && typeof g != 'undefined' && typeof b != 'undefined') {
        if (typeof a != 'undefined') {
          return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        } else {
          return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
      }
      return r;
    }
    // window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
  }, {
    key: "requestAnimationFrame",
    value: function requestAnimationFrame(callback, win) {
      var fun = win && win.requestAnimationFrame ? win.requestAnimationFrame : typeof window !== 'undefined' && window.requestAnimationFrame ? window.requestAnimationFrame : setTimeout;
      return fun(callback, 20);
    }
  }, {
    key: "cancelAnimationFrame",
    value: function cancelAnimationFrame(handler, win) {
      var fun = win && win.cancelAnimationFrame ? win.cancelAnimationFrame : typeof window !== 'undefined' && window.cancelAnimationFrame ? window.cancelAnimationFrame : clearTimeout;
      return fun(handler);
    }
  }]);
}();

},{"./jmList.js":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = exports["default"] = earcut;
function earcut(data, holeIndices, dim) {
  dim = dim || 2;
  var hasHoles = holeIndices && holeIndices.length,
    outerLen = hasHoles ? holeIndices[0] * dim : data.length,
    outerNode = linkedList(data, 0, outerLen, dim, true),
    triangles = [];
  if (!outerNode || outerNode.next === outerNode.prev) return triangles;
  var minX, minY, maxX, maxY, x, y, invSize;
  if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

  // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
  if (data.length > 80 * dim) {
    minX = maxX = data[0];
    minY = maxY = data[1];
    for (var i = dim; i < outerLen; i += dim) {
      x = data[i];
      y = data[i + 1];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }

    // minX, minY and invSize are later used to transform coords into integers for z-order calculation
    invSize = Math.max(maxX - minX, maxY - minY);
    invSize = invSize !== 0 ? 32767 / invSize : 0;
  }
  earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
  return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
  var i, last;
  if (clockwise === signedArea(data, start, end, dim) > 0) {
    for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
  } else {
    for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
  }
  if (last && equals(last, last.next)) {
    removeNode(last);
    last = last.next;
  }
  return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
  if (!start) return start;
  if (!end) end = start;
  var p = start,
    again;
  do {
    again = false;
    if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
      removeNode(p);
      p = end = p.prev;
      if (p === p.next) break;
      again = true;
    } else {
      p = p.next;
    }
  } while (again || p !== end);
  return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
  if (!ear) return;

  // interlink polygon nodes in z-order
  if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
  var stop = ear,
    prev,
    next;

  // iterate through ears, slicing them one by one
  while (ear.prev !== ear.next) {
    prev = ear.prev;
    next = ear.next;
    if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
      // cut off the triangle
      triangles.push(prev.i / dim | 0);
      triangles.push(ear.i / dim | 0);
      triangles.push(next.i / dim | 0);
      removeNode(ear);

      // skipping the next vertex leads to less sliver triangles
      ear = next.next;
      stop = next.next;
      continue;
    }
    ear = next;

    // if we looped through the whole remaining polygon and can't find any more ears
    if (ear === stop) {
      // try filtering points and slicing again
      if (!pass) {
        earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

        // if this didn't work, try curing all small self-intersections locally
      } else if (pass === 1) {
        ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
        earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

        // as a last resort, try splitting the remaining polygon into two
      } else if (pass === 2) {
        splitEarcut(ear, triangles, dim, minX, minY, invSize);
      }
      break;
    }
  }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
  var a = ear.prev,
    b = ear,
    c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

  // now make sure we don't have other points inside the potential ear
  var ax = a.x,
    bx = b.x,
    cx = c.x,
    ay = a.y,
    by = b.y,
    cy = c.y;

  // triangle bbox; min & max are calculated like this for speed
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx,
    y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy,
    x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx,
    y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
  var p = c.next;
  while (p !== a) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.next;
  }
  return true;
}
function isEarHashed(ear, minX, minY, invSize) {
  var a = ear.prev,
    b = ear,
    c = ear.next;
  if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

  var ax = a.x,
    bx = b.x,
    cx = c.x,
    ay = a.y,
    by = b.y,
    cy = c.y;

  // triangle bbox; min & max are calculated like this for speed
  var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx,
    y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy,
    x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx,
    y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;

  // z-order range for the current triangle bbox;
  var minZ = zOrder(x0, y0, minX, minY, invSize),
    maxZ = zOrder(x1, y1, minX, minY, invSize);
  var p = ear.prevZ,
    n = ear.nextZ;

  // look for points inside the triangle in both directions
  while (p && p.z >= minZ && n && n.z <= maxZ) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.prevZ;
    if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
    n = n.nextZ;
  }

  // look for remaining points in decreasing z-order
  while (p && p.z >= minZ) {
    if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.prevZ;
  }

  // look for remaining points in increasing z-order
  while (n && n.z <= maxZ) {
    if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
    n = n.nextZ;
  }
  return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
  var p = start;
  do {
    var a = p.prev,
      b = p.next.next;
    if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
      triangles.push(a.i / dim | 0);
      triangles.push(p.i / dim | 0);
      triangles.push(b.i / dim | 0);

      // remove two nodes involved
      removeNode(p);
      removeNode(p.next);
      p = start = b;
    }
    p = p.next;
  } while (p !== start);
  return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
  // look for a valid diagonal that divides the polygon into two
  var a = start;
  do {
    var b = a.next.next;
    while (b !== a.prev) {
      if (a.i !== b.i && isValidDiagonal(a, b)) {
        // split the polygon in two by the diagonal
        var c = splitPolygon(a, b);

        // filter colinear points around the cuts
        a = filterPoints(a, a.next);
        c = filterPoints(c, c.next);

        // run earcut on each half
        earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
        earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
        return;
      }
      b = b.next;
    }
    a = a.next;
  } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
  var queue = [],
    i,
    len,
    start,
    end,
    list;
  for (i = 0, len = holeIndices.length; i < len; i++) {
    start = holeIndices[i] * dim;
    end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
    list = linkedList(data, start, end, dim, false);
    if (list === list.next) list.steiner = true;
    queue.push(getLeftmost(list));
  }
  queue.sort(compareX);

  // process holes from left to right
  for (i = 0; i < queue.length; i++) {
    outerNode = eliminateHole(queue[i], outerNode);
  }
  return outerNode;
}
function compareX(a, b) {
  return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
  var bridge = findHoleBridge(hole, outerNode);
  if (!bridge) {
    return outerNode;
  }
  var bridgeReverse = splitPolygon(bridge, hole);

  // filter collinear points around the cuts
  filterPoints(bridgeReverse, bridgeReverse.next);
  return filterPoints(bridge, bridge.next);
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
  var p = outerNode,
    hx = hole.x,
    hy = hole.y,
    qx = -Infinity,
    m;

  // find a segment intersected by a ray from the hole's leftmost point to the left;
  // segment's endpoint with lesser x will be potential connection point
  do {
    if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
      var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
      if (x <= hx && x > qx) {
        qx = x;
        m = p.x < p.next.x ? p : p.next;
        if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
      }
    }
    p = p.next;
  } while (p !== outerNode);
  if (!m) return null;

  // look for points inside the triangle of hole point, segment intersection and endpoint;
  // if there are no points found, we have a valid connection;
  // otherwise choose the point of the minimum angle with the ray as connection point

  var stop = m,
    mx = m.x,
    my = m.y,
    tanMin = Infinity,
    tan;
  p = m;
  do {
    if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

      if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
        m = p;
        tanMin = tan;
      }
    }
    p = p.next;
  } while (p !== stop);
  return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
  return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
  var p = start;
  do {
    if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
    p.prevZ = p.prev;
    p.nextZ = p.next;
    p = p.next;
  } while (p !== start);
  p.prevZ.nextZ = null;
  p.prevZ = null;
  sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
  var i,
    p,
    q,
    e,
    tail,
    numMerges,
    pSize,
    qSize,
    inSize = 1;
  do {
    p = list;
    list = null;
    tail = null;
    numMerges = 0;
    while (p) {
      numMerges++;
      q = p;
      pSize = 0;
      for (i = 0; i < inSize; i++) {
        pSize++;
        q = q.nextZ;
        if (!q) break;
      }
      qSize = inSize;
      while (pSize > 0 || qSize > 0 && q) {
        if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
          e = p;
          p = p.nextZ;
          pSize--;
        } else {
          e = q;
          q = q.nextZ;
          qSize--;
        }
        if (tail) tail.nextZ = e;else list = e;
        e.prevZ = tail;
        tail = e;
      }
      p = q;
    }
    tail.nextZ = null;
    inSize *= 2;
  } while (numMerges > 1);
  return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
  // coords are transformed into non-negative 15-bit integer range
  x = (x - minX) * invSize | 0;
  y = (y - minY) * invSize | 0;
  x = (x | x << 8) & 0x00FF00FF;
  x = (x | x << 4) & 0x0F0F0F0F;
  x = (x | x << 2) & 0x33333333;
  x = (x | x << 1) & 0x55555555;
  y = (y | y << 8) & 0x00FF00FF;
  y = (y | y << 4) & 0x0F0F0F0F;
  y = (y | y << 2) & 0x33333333;
  y = (y | y << 1) & 0x55555555;
  return x | y << 1;
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
  var p = start,
    leftmost = start;
  do {
    if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
    p = p.next;
  } while (p !== start);
  return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
  return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (
  // dones't intersect other edges
  locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (
  // locally visible
  area(a.prev, a, b.prev) || area(a, b.prev, b)) ||
  // does not create opposite-facing sectors
  equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
  return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
  var o1 = sign(area(p1, q1, p2));
  var o2 = sign(area(p1, q1, q2));
  var o3 = sign(area(p2, q2, p1));
  var o4 = sign(area(p2, q2, q1));
  if (o1 !== o2 && o3 !== o4) return true; // general case

  if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
  if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
  if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
  if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

  return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
  return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}
function sign(num) {
  return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
  var p = a;
  do {
    if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
    p = p.next;
  } while (p !== a);
  return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
  return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
  var p = a,
    inside = false,
    px = (a.x + b.x) / 2,
    py = (a.y + b.y) / 2;
  do {
    if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
    p = p.next;
  } while (p !== a);
  return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
  var a2 = new Node(a.i, a.x, a.y),
    b2 = new Node(b.i, b.x, b.y),
    an = a.next,
    bp = b.prev;
  a.next = b;
  b.prev = a;
  a2.next = an;
  an.prev = a2;
  b2.next = a2;
  a2.prev = b2;
  bp.next = b2;
  b2.prev = bp;
  return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
  var p = new Node(i, x, y);
  if (!last) {
    p.prev = p;
    p.next = p;
  } else {
    p.next = last.next;
    p.prev = last;
    last.next.prev = p;
    last.next = p;
  }
  return p;
}
function removeNode(p) {
  p.next.prev = p.prev;
  p.prev.next = p.next;
  if (p.prevZ) p.prevZ.nextZ = p.nextZ;
  if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}
function Node(i, x, y) {
  // vertex index in coordinates array
  this.i = i;

  // vertex coordinates
  this.x = x;
  this.y = y;

  // previous and next vertex nodes in a polygon ring
  this.prev = null;
  this.next = null;

  // z-order curve value
  this.z = 0;

  // previous and next nodes in z-order
  this.prevZ = null;
  this.nextZ = null;

  // indicates whether this is a steiner point
  this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
  var hasHoles = holeIndices && holeIndices.length;
  var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
  var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
  if (hasHoles) {
    for (var i = 0, len = holeIndices.length; i < len; i++) {
      var start = holeIndices[i] * dim;
      var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      polygonArea -= Math.abs(signedArea(data, start, end, dim));
    }
  }
  var trianglesArea = 0;
  for (i = 0; i < triangles.length; i += 3) {
    var a = triangles[i] * dim;
    var b = triangles[i + 1] * dim;
    var c = triangles[i + 2] * dim;
    trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
  }
  return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
};
function signedArea(data, start, end, dim) {
  var sum = 0;
  for (var i = start, j = end - dim; i < end; i += dim) {
    sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
    j = i;
  }
  return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
  var dim = data[0][0].length,
    result = {
      vertices: [],
      holes: [],
      dimensions: dim
    },
    holeIndex = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
    }
    if (i > 0) {
      holeIndex += data[i - 1].length;
      result.holes.push(holeIndex);
    }
  }
  return result;
};

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _earcut = _interopRequireDefault(require("../earcut.js"));
var _gradient = _interopRequireDefault(require("./gradient.js"));
var _program = require("./core/program.js");
var _buffer = require("./core/buffer.js");
var _texture = require("./core/texture.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// 把canvas坐标转为webgl坐标系
var convertPointSource = "\n    vec4 translatePosition(vec4 point, float x, float y) {\n        point.x = (point.x-x)/x;\n        point.y = (y-point.y)/y;\n        return point;\n    }";
// 把纹理的canvas坐标转为纹理的坐标系
var convertTexturePosition = "\n    vec2 translateTexturePosition(in vec2 point, vec4 bounds) {\n        point.x = (point.x-bounds.x)/bounds.z; // \u79BB\u5DE6\u4E0A\u89D2\u4F4D\u7F6E\u7684X\u957F\u6BD4\u4E0A\u7EB9\u7406\u5BBD 0-1\n        point.y = 1.0-(point.y-bounds.y)/bounds.w; // \u79BB\u5DE6\u4E0A\u89D2\u4F4D\u7F6E\u7684Y\u957F\u6BD4\u4E0A\u9AD8\uFF0C\u56E0\u4E3A\u7EB9\u7406\u5750\u6807\u662F\u5DE6\u4E0B\u89D2\u8D77\uFF0C\u6240\u4EE5\u8981\u75281-\n        return point;\n    }";

// path顶点着色器源码
var pathVertexSource = "\n    attribute vec4 a_position;\n    attribute vec4 a_color;\n    attribute vec2 a_text_coord;\n    uniform vec2 a_center_point; // \u5F53\u524Dcanvas\u7684\u4E2D\u5FC3\u4F4D\u7F6E\n    uniform float a_point_size; // \u70B9\u7684\u5927\u5C0F\n    uniform int a_type;\n    varying vec4 v_color;\n    varying vec2 v_text_coord;\n    varying float v_type;\n\n    ".concat(convertPointSource, "\n\n    void main() {\n        gl_PointSize = a_point_size == 0.0? 1.0 : a_point_size;\n        v_type = float(a_type);\n        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);\n        gl_Position = pos;\n        v_color = a_color;\n        if(a_type == 2) {\n            v_text_coord = a_text_coord;\n        }\n    }\n");
// path 片段着色器源码
var pathFragmentSource = "\n    precision mediump float;\n    uniform sampler2D u_sample;\n    uniform vec4 v_texture_bounds; // \u7EB9\u7406\u7684\u5DE6\u4E0A\u5750\u6807\u548C\u5927\u5C0F x,y,z,w\n    uniform vec4 v_single_color;\n    varying float v_type;\n    varying vec4 v_color;\n    varying vec2 v_text_coord;\n\n    ".concat(convertTexturePosition, "\n\n    void main() {\n        // \u5982\u679C\u662Ffill\uFF0C\u5219\u76F4\u63A5\u586B\u5145\u989C\u8272\n        if(v_type == 1.0) {\n            gl_FragColor = v_single_color;\n        }\n        // \u6E10\u53D8\u8272\n        else if(v_type == 3.0) {\n            gl_FragColor = v_color;\n        }\n        else if(v_type == 2.0) {\n            vec2 pos = translateTexturePosition(v_text_coord, v_texture_bounds);\n            gl_FragColor = texture2D(u_sample, pos);\n        }\n        else {\n            float r = distance(gl_PointCoord, vec2(0.5, 0.5));\n            //\u6839\u636E\u8DDD\u79BB\u8BBE\u7F6E\u7247\u5143\n            if(r <= 0.5){\n                // \u65B9\u5F62\u533A\u57DF\u7247\u5143\u8DDD\u79BB\u51E0\u4F55\u4E2D\u5FC3\u534A\u5F84\u5C0F\u4E8E0.5\uFF0C\u50CF\u7D20\u989C\u8272\u8BBE\u7F6E\u7EA2\u8272\n                gl_FragColor = v_single_color;\n            }else {\n                // \u65B9\u5F62\u533A\u57DF\u8DDD\u79BB\u51E0\u4F55\u4E2D\u5FC3\u534A\u5F84\u4E0D\u5C0F\u4E8E0.5\u7684\u7247\u5143\u526A\u88C1\u820D\u5F03\u6389\uFF1A\n                discard;\n            }\n        }\n    }\n");
var WeblBase = /*#__PURE__*/function () {
  function WeblBase(graph, option) {
    _classCallCheck(this, WeblBase);
    this.graph = graph;
    this.option = option || {};
    this.style = {
      globalAlpha: 1
    };
  }
  return _createClass(WeblBase, [{
    key: "context",
    get: function get() {
      if (this.graph) return this.graph.context;
    }

    // 纹理绘制canvas
  }, {
    key: "textureCanvas",
    get: function get() {
      var canvas = this.graph.textureCanvas;
      if (!canvas) {
        if (typeof document === 'undefined') return null;
        canvas = this.graph.textureCanvas = document.createElement('canvas');
      }
      return canvas;
    }
    // 纹理绘制canvas ctx
  }, {
    key: "textureContext",
    get: function get() {
      var ctx = this.textureCanvas.ctx || (this.textureCanvas.ctx = this.textureCanvas.getContext('2d', {
        willReadFrequently: true
      }));
      return ctx;
    }

    // i当前程序
  }, {
    key: "program",
    get: function get() {
      // 默认所有path用同一个编译好的program
      return this.graph.context.pathProgram || (this.graph.context.pathProgram = this.createProgram(pathVertexSource, pathFragmentSource));
    }

    // 设置样式
  }, {
    key: "setStyle",
    value: function setStyle() {
      var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.style;
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      if (typeof style === 'string') {
        var obj = {};
        obj[style] = value;
        style = obj;
      }
      /*
       // 设置线条颜色或填充色
       if(style.strokeStyle) {
           let color = style.strokeStyle;
           if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
           this.style.strokeStyle = this.graph.utils.rgbToDecimal(color);
           delete style.strokeStyle;
       }
       else if(style.fillStyle) {
           let color = style.fillStyle;
           if(this.isGradient(color)) {
               this.style.fillStyle = color;
           }
           else {
               if(typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
               this.style.fillStyle =  this.graph.utils.rgbToDecimal(color);
           }
           delete style.fillStyle;
       } */

      this.style = _objectSpread(_objectSpread({}, this.style), style);
    }

    // 把传统颜色转为webgl识别的
  }, {
    key: "convertColor",
    value: function convertColor(color) {
      if (this.isGradient(color)) return color;
      if (typeof color === 'string') color = this.graph.utils.hexToRGBA(color);
      return this.graph.utils.rgbToDecimal(color);
    }
  }, {
    key: "setTextureStyle",
    value: function setTextureStyle(style) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      if (typeof style === 'string') {
        if (['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(style) > -1) {
          value = this.graph.utils.toColor(value);
        }
        this.textureContext[style] = value;
      } else {
        for (var name in style) {
          if (name === 'constructor') continue;
          this.setTextureStyle(name, style[name]);
        }
      }
    }

    // 创建程序
  }, {
    key: "createProgram",
    value: function createProgram(vertexSrc, fragmentSrc) {
      this.context.lineWidth(1);
      return (0, _program.createProgram)(this.context, vertexSrc, fragmentSrc);
    }

    // 指定使用某个程序
  }, {
    key: "useProgram",
    value: function useProgram() {
      var program = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.program;
      program = program.program || program;
      if (this.context.__curent_program === program) return program;
      (0, _program.useProgram)(this.context, program.program || program);
      this.context.__curent_program = program;
      return program;
    }
  }, {
    key: "getAttribLocation",
    value: function getAttribLocation(name) {
      return this.context.getAttribLocation(this.program.program, name);
    }
  }, {
    key: "getUniformLocation",
    value: function getUniformLocation(name) {
      return this.context.getUniformLocation(this.program.program, name);
    }

    // 把缓冲区的值写入变量
    // buffer: 缓冲区
    // size: 组成数量，必须是1，2，3或4.  每个单元由多少个数组成
    // strip: 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
    // offset: 字节偏移量，必须是类型的字节长度的倍数。
    // dataType: 每个元素的数据类型
  }, {
    key: "writeVertexAttrib",
    value: function writeVertexAttrib(buffer, attr) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
      var strip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var dataType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this.context.FLOAT;
      buffer.attr = attr;
      return (0, _program.writeVertexAttrib)(this.context, buffer, attr, size, strip, offset, dataType);
    }

    // 禁用attri
  }, {
    key: "disableVertexAttribArray",
    value: function disableVertexAttribArray(attr) {
      try {
        if (!attr) return attr;
        return (0, _program.disableVertexAttribArray)(this.context, attr);
      } catch (e) {
        console.error(e);
      }
      return attr;
    }

    // 创建float32的buffer
  }, {
    key: "createFloat32Buffer",
    value: function createFloat32Buffer(data) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.context.ARRAY_BUFFER;
      var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.context.STATIC_DRAW;
      var buffer = (0, _buffer.createFloat32Buffer)(this.context, data, type, drawType);
      return _objectSpread({
        data: data
      }, buffer);
    }
  }, {
    key: "createUint16Buffer",
    value: function createUint16Buffer(data) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.context.ARRAY_BUFFER;
      var drawType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.context.STATIC_DRAW;
      var buffer = (0, _buffer.createUint16Buffer)(this.context, data, type, drawType);
      return _objectSpread({
        data: data
      }, buffer);
    }

    // 释放
  }, {
    key: "deleteBuffer",
    value: function deleteBuffer(buffer) {
      try {
        if (!buffer) return;
        var bufferHandler = buffer.buffer || buffer;
        if (bufferHandler) return (0, _buffer.deleteBuffer)(this.context, bufferHandler);
      } catch (e) {
        console.log(buffer);
        console.error(e);
      }
      return buffer;
    }

    // 生成纹理
  }, {
    key: "create2DTexture",
    value: function create2DTexture() {
      return (0, _texture.create2DTexture)(this.context);
    }

    // 创建图片纹理
  }, {
    key: "createImgTexture",
    value: function createImgTexture(img) {
      return (0, _texture.createImgTexture)(this.context, img);
    }

    // 根根像素值生成纹理
  }, {
    key: "createDataTexture",
    value: function createDataTexture(data) {
      return (0, _texture.createDataTexture)(this.context, data);
    }

    // 删除纹理
  }, {
    key: "deleteTexture",
    value: function deleteTexture(texture) {
      try {
        return (0, _texture.deleteTexture)(this.context, texture.texture || texture);
      } catch (e) {
        console.error(e);
      }
      return texture;
    }

    // 多边切割, 得到三角形顶点索引数组
    // polygonIndices 顶点索引，
  }, {
    key: "earCutPoints",
    value: function earCutPoints(points) {
      var arr = this.pointsToArray(points);
      var ps = (0, _earcut["default"])(arr); // 切割得到3角色顶点索引，
      return ps;
    }

    // 多边切割, 得到三角形顶点
    // polygonIndices 顶点索引，
  }, {
    key: "earCutPointsToTriangles",
    value: function earCutPointsToTriangles(points) {
      var ps = this.earCutPoints(points); // 切割得到3角色顶点索引，
      var triangles = [];
      // 用顶点索引再组合成坐标数组
      for (var i = 0; i < ps.length; i += 3) {
        var p1 = points[ps[i]];
        var p2 = points[ps[i + 1]];
        var p3 = points[ps[i + 2]];
        triangles.push([p1, p2, p3]); // 每三个顶点构成一个三角
      }
      return triangles;
    }

    // 点坐标数组转为一维数组
  }, {
    key: "pointsToArray",
    value: function pointsToArray(points) {
      var _ref;
      return (_ref = []).concat.apply(_ref, _toConsumableArray(points.map(function (p) {
        return [p.x, p.y];
      }))); // 把x,y转为数组元素
    }
    // 每2位表示坐标x,y转为坐标点对象
  }, {
    key: "arrayToPoints",
    value: function arrayToPoints(arr) {
      var points = [];
      for (var i = 0; i < arr.length; i += 2) {
        points.push({
          x: arr[i],
          y: arr[i + 1]
        });
      }
      return points;
    }

    // 创建线性渐变
  }, {
    key: "createLinearGradient",
    value: function createLinearGradient(x1, y1, x2, y2, bounds) {
      return new _gradient["default"]('linear', {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        bounds: bounds,
        control: this
      });
    }
    // 创建放射性渐变
  }, {
    key: "createRadialGradient",
    value: function createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
      return new _gradient["default"]('radial', {
        x1: x1,
        y1: y1,
        r1: r1,
        x2: x2,
        y2: y2,
        r2: r2,
        bounds: bounds,
        control: this
      });
    }
    // 判断是否是一个渐变对象
  }, {
    key: "isGradient",
    value: function isGradient(obj) {
      return obj && obj instanceof _gradient["default"];
    }

    /**
    * 测试获取文本所占大小
    *
    * @method testSize
    * @return {object} 含文本大小的对象
    */
  }, {
    key: "testSize",
    value: function testSize(text) {
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.style;
      this.textureContext.save && this.textureContext.save();
      // 修改字体，用来计算
      if (style.font || style.fontSize) this.textureContext.font = style.font || style.fontSize + 'px ' + style.fontFamily;

      //计算宽度
      var size = this.textureContext.measureText ? this.textureContext.measureText(text) : {
        width: 15
      };
      this.textureContext.restore && this.textureContext.restore();
      size.height = this.style.fontSize ? this.style.fontSize : 15;
      return size;
    }

    // 使用纹理canvas生成图，
    // 填充可以是颜色或渐变对象
    // 如果指定了points，则表明要绘制不规则的图形
  }, {
    key: "toFillTexture",
    value: function toFillTexture(fillStyle, bounds) {
      var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var canvas = this.textureCanvas;
      if (!canvas) {
        return fillStyle;
      }
      canvas.width = bounds.width;
      canvas.height = bounds.height;
      if (!canvas.width || !canvas.height) {
        return fillStyle;
      }
      this.textureContext.clearRect(0, 0, canvas.width, canvas.height);
      this.textureContext.fillStyle = fillStyle;
      this.textureContext.beginPath();
      if (!points || !points.length) {
        points = [];
        points.push({
          x: bounds.left,
          y: bounds.top
        });
        points.push({
          x: bounds.left + bounds.width,
          y: bounds.top
        });
        points.push({
          x: bounds.left + bounds.width,
          y: bounds.top + bounds.height
        });
        points.push({
          x: bounds.left,
          y: bounds.top + bounds.height
        });
        points.push({
          x: bounds.left,
          y: bounds.top
        });
      }
      if (points && points.length) {
        var _iterator = _createForOfIteratorHelper(points),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var p = _step.value;
            //移至当前坐标
            if (p.m) {
              this.textureContext.moveTo(p.x - bounds.left, p.y - bounds.top);
            } else {
              this.textureContext.lineTo(p.x - bounds.left, p.y - bounds.top);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        this.textureContext.moveTo(0, 0);
        this.textureContext.lineTo(bounds.width, 0);
        this.textureContext.lineTo(bounds.width, bounds.height);
        this.textureContext.lineTo(0, bounds.height);
        this.textureContext.lineTo(0, 0);
      }
      this.textureContext.closePath();
      this.textureContext.fill();
      var data = this.textureContext.getImageData(0, 0, canvas.width, canvas.height);
      return {
        data: data,
        points: points
      };
    }
  }]);
}();
var _default = exports["default"] = WeblBase;

},{"../earcut.js":12,"./core/buffer.js":14,"./core/program.js":17,"./core/texture.js":19,"./gradient.js":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBuffer = createBuffer;
exports.createFloat32Buffer = createFloat32Buffer;
exports.createUint16Buffer = createUint16Buffer;
exports.deleteBuffer = deleteBuffer;
// 创建缓冲区
function createBuffer(gl, data) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.ARRAY_BUFFER;
  var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
  //先创建一个缓存对象
  var buffer = gl.createBuffer();
  if (!buffer) {
    throw Error('创建缓冲区对象失败');
  }
  //说明缓存对象保存的类型
  gl.bindBuffer(type, buffer);
  //写入坐标数据
  // 因为会将数据发送到 GPU，为了省去数据解析，这里使用 Float32Array 直接传送数据
  // data.buffer这里要使用data.buffer，否则在edge下可能导至数据发生较大的改变
  gl.bufferData(type, data.buffer || data, drawType); // 表示缓冲区的内容不会经常更改
  return {
    type: type,
    drawType: drawType,
    buffer: buffer,
    // 获取到数组中单个元素的字节数
    unitSize: data.BYTES_PER_ELEMENT
  };
}

// 创建float32的buffer
function createFloat32Buffer(gl, data) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.ARRAY_BUFFER;
  var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
  var vertices = new Float32Array(data);
  var buffer = createBuffer(gl, vertices, type, drawType);
  return buffer;
}

// 创建uint16的bugger
function createUint16Buffer(gl, data) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.ARRAY_BUFFER;
  var drawType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
  var vertices = new Uint16Array(data);
  var buffer = createBuffer(gl, vertices, type, drawType);
  return buffer;
}

// 释放
function deleteBuffer(gl, buffer) {
  gl.deleteBuffer(buffer.buffer || buffer);
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapSize = void 0;
var GLSL_TO_SIZE = {
  'float': 1,
  'vec2': 2,
  'vec3': 3,
  'vec4': 4,
  'int': 1,
  'ivec2': 2,
  'ivec3': 3,
  'ivec4': 4,
  'bool': 1,
  'bvec2': 2,
  'bvec3': 3,
  'bvec4': 4,
  'mat2': 4,
  'mat3': 9,
  'mat4': 16,
  'sampler2D': 1
};

/**
 * @class
 * @memberof PIXI.glCore.shader
 * @param type {String}
 * @return {Number}
 */
var mapSize = exports.mapSize = function mapSize(type) {
  return GLSL_TO_SIZE[type];
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapType = void 0;
var GL_TABLE = null;
var GL_TO_GLSL_TYPES = {
  'FLOAT': 'float',
  'FLOAT_VEC2': 'vec2',
  'FLOAT_VEC3': 'vec3',
  'FLOAT_VEC4': 'vec4',
  'INT': 'int',
  'INT_VEC2': 'ivec2',
  'INT_VEC3': 'ivec3',
  'INT_VEC4': 'ivec4',
  'BOOL': 'bool',
  'BOOL_VEC2': 'bvec2',
  'BOOL_VEC3': 'bvec3',
  'BOOL_VEC4': 'bvec4',
  'FLOAT_MAT2': 'mat2',
  'FLOAT_MAT3': 'mat3',
  'FLOAT_MAT4': 'mat4',
  'SAMPLER_2D': 'sampler2D'
};
var mapType = exports.mapType = function mapType(gl, type) {
  if (!GL_TABLE) {
    var typeNames = Object.keys(GL_TO_GLSL_TYPES);
    GL_TABLE = {};
    for (var i = 0; i < typeNames.length; ++i) {
      var tn = typeNames[i];
      GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
    }
  }
  return GL_TABLE[type];
};

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProgram = createProgram;
exports.disableVertexAttribArray = disableVertexAttribArray;
exports.extractAttributes = extractAttributes;
exports.extractUniforms = extractUniforms;
exports.getAttribLocation = getAttribLocation;
exports.getUniformLocation = getUniformLocation;
exports.useProgram = useProgram;
exports.writeVertexAttrib = writeVertexAttrib;
var _shader = require("./shader.js");
var _mapSize = require("./mapSize.js");
var _mapType = require("./mapType.js");
// 创建程序
function createProgram(gl, vertexSrc, fragmentSrc) {
  // 创建顶点着色器
  var vertexShader = (0, _shader.createShader)(gl, gl.VERTEX_SHADER, vertexSrc);
  // 创建片段着色器
  var fragmentShader = (0, _shader.createShader)(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  var program = gl.createProgram(); // 创建一个程序
  gl.attachShader(program, vertexShader); // 添加顶点着色器
  gl.attachShader(program, fragmentShader); // 添加片元着色器
  gl.linkProgram(program); // 连接 program 中的着色器

  // 检查程序链接状态
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('PError: Could not initialize shader.');
    console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
    console.error('gl.getError()', gl.getError());

    // if there is a program info log, log it
    if (gl.getProgramInfoLog(program) !== '') {
      console.warn('Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
  }
  useProgram(gl, program);

  // clean up some shaders
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  var attrs = extractAttributes(gl, program);
  var uniforms = extractUniforms(gl, program);
  return {
    program: program,
    attrs: attrs,
    uniforms: uniforms
  };
}

// 采用program
function useProgram(gl, program) {
  return gl.useProgram(program); // 告诉 webgl 用这个 program 进行渲染
}
function extractAttributes(gl, program) {
  var attributes = {};
  var count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < count; i++) {
    var attribData = gl.getActiveAttrib(program, i);
    var type = (0, _mapType.mapType)(gl, attribData.type);
    attributes[attribData.name] = {
      attribData: attribData,
      size: (0, _mapSize.mapSize)(type),
      type: type,
      location: gl.getAttribLocation(program, attribData.name)
    };
  }
  return attributes;
}
function extractUniforms(gl, program) {
  var uniforms = {};
  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; i++) {
    var uniformData = gl.getActiveUniform(program, i);
    var name = uniformData.name.replace(/\[.*?\]/, "");
    var type = (0, _mapType.mapType)(gl, uniformData.type);
    uniforms[name] = {
      uniformData: uniformData,
      type: type,
      size: uniformData.size,
      location: gl.getUniformLocation(program, name)
    };
  }
  return uniforms;
}
;

// 把缓冲区的值写入变量
// size: 组成数量，必须是1，2，3或4.  每个单元由多少个数组成
// strip: 步长 数组中一行长度，0 表示数据是紧密的没有空隙，让OpenGL决定具体步长
// offset: 字节偏移量，必须是类型的字节长度的倍数。
// dataType: 每个元素的数据类型
function writeVertexAttrib(gl, buffer, attr) {
  var size = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var strip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var offset = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var dataType = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : gl.FLOAT;
  gl.bindBuffer(buffer.type, buffer.buffer);
  gl.vertexAttribPointer(
  // 告诉 OpenGL 如何从 Buffer 中获取数据
  attr.location,
  // 顶点属性的索引
  size,
  // 组成数量，必须是1，2，3或4。我们只提供了 x 和 y
  dataType, false,
  // 是否归一化到特定的范围，对 FLOAT 类型数据设置无效
  strip * buffer.unitSize, offset);
  gl.enableVertexAttribArray(attr.location);
  return buffer;
}
function disableVertexAttribArray(gl, attr) {
  return gl.disableVertexAttribArray(attr.location);
}
function getAttribLocation(gl, program, name) {
  return gl.getAttribLocation(program, name);
}
function getUniformLocation(gl, program, name) {
  return gl.getUniformLocation(program, name);
}

},{"./mapSize.js":15,"./mapType.js":16,"./shader.js":18}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createShader = createShader;
// 生成着色器
// type: gl.VERTEX_SHADER 顶点着色器  , gl.FRAGMENT_SHADER  片段着色器
// src: 着色器代码
function createShader(gl, type, src) {
  var shader = gl.createShader(type); // 创建一个顶点着色器
  gl.shaderSource(shader, src); // 编写顶点着色器代码
  gl.compileShader(shader); // 编译着色器

  return shader;
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create2DTexture = create2DTexture;
exports.createDataTexture = createDataTexture;
exports.createImgTexture = createImgTexture;
exports.deleteTexture = deleteTexture;
// 生成纹理
function create2DTexture(gl) {
  var texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // 图像反转Y轴
  gl.activeTexture(gl.TEXTURE0); // 激活纹理单元
  gl.bindTexture(gl.TEXTURE_2D, texture); // 绑定纹理对象

  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // 放大处理方式  // LINEAR  / NEAREST
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // 缩小处理方式
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // 水平平铺方式
  gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // 竖直平铺方式

  return texture;
}

// 创建图片纹理
function createImgTexture(gl, img) {
  var texture = create2DTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); // 配置纹理图像
  return {
    texture: texture
  };
}

// 用像素值来绘制纹理
function createDataTexture(gl, pixels) {
  var data = new Uint8Array(pixels.data || pixels);
  var texture = create2DTexture(gl);
  gl.texImage2D(gl.TEXTURE_2D,
  // 纹理目标
  0,
  // 细节级别,指定详细级别。0 级是基本图像等级，n 级是第 n 个金字塔简化级。
  gl.RGBA,
  // 纹理内部格式
  pixels.width || 1,
  // 指定纹理的宽度
  pixels.height || 1,
  // 指定纹理的高度
  0,
  // 指定纹理的边框宽度。必须为 0。
  gl.RGBA,
  // 源图像数据格式
  gl.UNSIGNED_BYTE,
  // 纹理数据类型
  data // 数据
  );
  return {
    texture: texture
  };
}

// 删除纹理
function deleteTexture(gl, texture) {
  return gl.deleteTexture(texture);
}

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var WebglGradientTextureCache = {};
// 渐变
var WebglGradient = /*#__PURE__*/function () {
  // type:[linear= 线性渐变,radial=放射性渐变] 
  function WebglGradient() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'linear';
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, WebglGradient);
    this.type = type || 'linear';
    this.x1 = params.x1 || 0;
    this.y1 = params.y1 || 0;
    this.r1 = params.r1 || 0;
    this.x2 = params.x2 || 0;
    this.y2 = params.y2 || 0;
    this.r2 = params.r2 || 0;
    this.bounds = params.bounds || {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    };
    this.control = params.control;
    this.stops = [];
    this.init();
  }
  return _createClass(WebglGradient, [{
    key: "init",
    value: function init() {
      var dx = this.x2 - this.x1;
      var dy = this.y2 - this.y1;
      if (this.type === 'radial') {
        this.length = this.r2 - this.r1;
      } else if (dx === 0 && dy === 0) {
        this.length = 0;
      } else {
        // 渐变中心的距离
        this.length = Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
        this.sin = dy / this.length;
        this.cos = dx / this.length;
      }
    }

    // 渐变颜色
  }, {
    key: "addColorStop",
    value: function addColorStop(offset, color) {
      this.stops.push({
        offset: offset,
        color: color
      });
    }

    // 转为渐变为纹理
  }, {
    key: "toImageData",
    value: function toImageData(control, bounds) {
      var points = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      //const key = this.key || this.toString();
      //if(WebglGradientTextureCache[key]) return WebglGradientTextureCache[key];
      if (!control.textureContext) {
        return null;
      }
      var gradient = null;
      if (this.type === 'linear') {
        gradient = control.textureContext.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
      } else {
        gradient = control.textureContext.createRadialGradient(this.x1, this.y1, this.r1, this.x2, this.y2, this.r2);
      }
      this.stops.forEach(function (s, i) {
        var c = control.graph.utils.toColor(s.color);
        gradient && gradient.addColorStop(s.offset, c);
      });
      var data = control.toFillTexture(gradient, bounds, points);

      //WebglGradientTextureCache[key] = data;

      return data;
    }

    // 根据绘制图形的坐标计算出对应点的颜色
    /*
    toPointColors(points) {
        const stops = this.getStops();
        const colors = [];
        for(let i=0; i<points.length; i+=2) {
            const p = {
                x: points[i],
                y: points[i+1]
            }
            if(this.type === 'radial') {
                const dx = p.x - this.x1;
                const dy = p.y - this.y1;
                const len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                const rang = this.getStopRange(len, stops);
                if(!rang.start && rang.end) {
                    colors.push(rang.end.color);
                }
                else if(!rang.end && rang.start) {
                    colors.push(rang.start.color);
                }
                else {
                    const rangLength = rang.end.length - rang.start.length;
                    const offlen = len - rang.start.length;
                    const per = offlen / rangLength;
                    const color = {
                        r: rang.start.color.r + (rang.end.color.r - rang.start.color.r) * per,
                        g: rang.start.color.g + (rang.end.color.g - rang.start.color.g) * per,
                        b: rang.start.color.b + (rang.end.color.b - rang.start.color.b) * per,
                        a: rang.start.color.a + (rang.end.color.a - rang.start.color.a) * per,
                    };
                    colors.push(color);
                }
            }
        }
        return colors;
    }
    */
    // 根据起点距离获取边界stop
    /*
    getStopRange(len, stops) {
        const res = {};
        for(const s of stops) {
            if(s.length <= len) {
                res.start = s;
            }
            else {
                res.end = s;
            }
        }
        return res;
    }
      // 根据stop计算offset长度
    getStops() {
        const stops = this.stops.sort((p1, p2) => p1.offset - p2.offset); // 渐变色排序从小于大
        for(const s of stops) {
            
            const color = typeof s.color === 'string'? this.control.graph.utils.hexToRGBA(s.color) : s.color;
            console.log(s, color);
            s.color = this.control.graph.utils.rgbToDecimal(color);
            s.length = s.offset * this.length;
        }
        return stops;
    }
    */
    /**
    * 转换为渐变的字符串表达
    *
    * @method toString
    * @for jmGradient
    * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
    */
  }, {
    key: "toString",
    value: function toString() {
      var str = this.type + '-gradient(';
      if (this.type == 'linear') {
        str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
      } else {
        str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
      }
      //颜色渐变
      this.stops.forEach(function (s) {
        str += ',' + s.color + ' ' + s.offset;
      });
      return str + ')';
    }
  }]);
}();
var _default = exports["default"] = WebglGradient;

},{}],21:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _base = _interopRequireDefault(require("./base.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
// path 绘制类
var WebglPath = /*#__PURE__*/function (_WebglBase) {
  function WebglPath(graph, option) {
    var _this;
    _classCallCheck(this, WebglPath);
    _this = _callSuper(this, WebglPath, [graph, option]);
    // 是否是规则的，不规则的处理方式更为复杂和耗性能
    _this.isRegular = option.isRegular || false;
    _this.needCut = option.needCut || false;
    _this.control = option.control;
    _this.points = [];
    return _this;
  }
  _inherits(WebglPath, _WebglBase);
  return _createClass(WebglPath, [{
    key: "setParentBounds",
    value: function setParentBounds() {
      var parentBounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.parentAbsoluteBounds;
      //this.useProgram();

      if (parentBounds) this.parentAbsoluteBounds = parentBounds;
      // 写入当前canvas大小
      this.context.uniform2f(this.program.uniforms.a_center_point.location, this.graph.width / 2, this.graph.height / 2);
    }
  }, {
    key: "setFragColor",
    value: function setFragColor(color) {
      if (!Array.isArray(color)) {
        color = this.convertColor(color);
        if (typeof color.a === 'undefined') color.a = 1;
        this.context.uniform4f(this.program.uniforms.v_single_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
        return null;
      }
      var colorData = [];
      var _iterator = _createForOfIteratorHelper(color),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          c = this.convertColor(c);
          if (typeof c.a === 'undefined') c.a = 1;
          colorData.push(c.r, c.g, c.b, c.a * this.style.globalAlpha);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var colorBuffer = this.createFloat32Buffer(colorData);
      this.writeVertexAttrib(colorBuffer, this.program.attrs.a_color, 4, 0, 0);
      colorBuffer.attr = this.program.attrs.a_color;
      return colorBuffer;
    }
  }, {
    key: "beginDraw",
    value: function beginDraw() {
      this.useProgram();
    }

    // 开始绘制
  }, {
    key: "draw",
    value: function draw(points) {
      var parentBounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.parentAbsoluteBounds;
      //this.useProgram();

      this.setParentBounds(parentBounds);
      this.points = points;
    }
  }, {
    key: "endDraw",
    value: function endDraw() {
      if (this.points) delete this.points;
      if (this.pathPoints) delete this.pathPoints;
    }

    // 图形封闭
  }, {
    key: "closePath",
    value: function closePath() {
      if (this.points && this.points.length > 2 && this.points[0] !== this.points[this.points.length - 1]) {
        var start = this.points[0];
        var end = this.points[this.points.length - 1];
        if (start != end && !(start.x === end.x && start.y === end.y)) this.points.push(start);
      }
    }

    // 绘制点数组
  }, {
    key: "writePoints",
    value: function writePoints(points) {
      var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.program.attrs.a_position;
      var fixedPoints = [];
      var _iterator2 = _createForOfIteratorHelper(points),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var p = _step2.value;
          fixedPoints.push(p.x + this.parentAbsoluteBounds.left, p.y + this.parentAbsoluteBounds.top);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var vertexBuffer = this.createFloat32Buffer(fixedPoints);
      this.writeVertexAttrib(vertexBuffer, attr, 2, 0, 0);
      vertexBuffer.attr = attr;
      return vertexBuffer;
    }

    // 连接二个点
  }, {
    key: "genLinePoints",
    value: function genLinePoints(start, end) {
      var points = [start];
      var dx = end.x - start.x;
      var dy = end.y - start.y;
      if (dx !== 0 || dy !== 0) {
        var len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        var cos = dx / len;
        var sin = dy / len;
        var step = 0.5;
        for (var l = step; l < len; l += step) {
          var x = start.x + cos * l;
          var y = start.y + sin * l;
          points.push({
            x: x,
            y: y
          });
        }
      }
      points.push(end);
      return points;
    }

    // 把path坐标集合分解成一个个点，并且处理moveTo线段能力
  }, {
    key: "pathToPoints",
    value: function pathToPoints() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.points;
      var start = null;
      var res = [];
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        if (start && !p.m) {
          var linePoints = this.genLinePoints(start, p);
          res.push.apply(res, _toConsumableArray(linePoints));
        } else if (start && !res.includes(start)) {
          res.push(start);
        }
        start = p;
      }
      if (!res.includes(start)) res.push(start);
      return res;
    }
    // 二点是否重合
  }, {
    key: "equalPoint",
    value: function equalPoint(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
    }
    // 把path坐标集合转为线段集
  }, {
    key: "pathToLines",
    value: function pathToLines(points) {
      var start = null;
      var res = [];
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        // 不重合的二个点，组成线段
        if (start && !p.m && !(start.x == p.x && start.y == p.y)) {
          var line = {
            start: start,
            end: p
          };
          res.push(line);
        }
        start = p;
      }
      return res;
    }

    // 裁剪线段，如果二段线段有交点，则分割成四段， 端头相交的线段不用分割
  }, {
    key: "cutLines",
    value: function cutLines(lines) {
      var index1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var index2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      if (lines && lines.length < 3) return lines;
      index2 = Math.max(index1 + 1, index2); //如果指定了比下一个更大的索引，则用更大的，说明前面的已经处理过了，不需要重复

      // 找出线段相交的点，并切割线段
      while (index1 < lines.length) {
        var line1 = lines[index1];
        while (index2 < lines.length) {
          var line2 = lines[index2];
          // 如果二条线顶点有重合，则不用处理
          if (this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.end, line2.end) || this.equalPoint(line1.start, line2.end) || this.equalPoint(line1.end, line2.start)) {
            index2++;
            continue;
          }
          var cuted = false;
          var intersection = this.getIntersection(line1, line2); // 计算交点
          if (intersection) {
            // 如果交点不是线段的端点，则分割成二条线段
            if (!this.equalPoint(line1.start, intersection) && !this.equalPoint(line1.end, intersection)) {
              var sub1 = {
                start: line1.start,
                end: intersection
              };
              var sub2 = {
                start: intersection,
                end: line1.end
              };
              // 从原数组中删除当前线段，替换成新的线段
              lines.splice(index1, 1, sub1, sub2);
              // 当前线段被重新替换，需要重新从它开始处理
              cuted = true;
              index2++; // 因为多加入了一个线段，则对比线索引需要加1
            }
            // 如果交点不是线段的端点，则分割成二条线段
            if (!this.equalPoint(line2.start, intersection) && !this.equalPoint(line2.end, intersection)) {
              var _sub = {
                start: line2.start,
                end: intersection
              };
              var _sub2 = {
                start: intersection,
                end: line2.end
              };
              // 从原数组中删除当前线段，替换成新的线段
              lines.splice(index2, 1, _sub, _sub2);
              index2++; // 线段2也切成了二段，对比索引要继续加1
            }
          }
          index2++;
          // 如果已经分割了起始线段，则第一个子线段开始，重新对比后面还未对比完的。直接所有对比完成返回
          if (cuted) return this.cutLines(lines, index1, index2);
        }
        index1++;
        index2 = index1 + 1;
      }
      return lines;
    }

    // 计算二个线段的交点
  }, {
    key: "getIntersection",
    value: function getIntersection(line1, line2) {
      // 如果首尾相接，也认为是有交点
      if (this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.start, line2.end)) return line1.start;
      if (this.equalPoint(line1.end, line2.start) || this.equalPoint(line1.end, line2.end)) return line1.end;

      // 三角形abc 面积的2倍
      var area_abc = (line1.start.x - line2.start.x) * (line1.end.y - line2.start.y) - (line1.start.y - line2.start.y) * (line1.end.x - line2.start.x);

      // 三角形abd 面积的2倍
      var area_abd = (line1.start.x - line2.end.x) * (line1.end.y - line2.end.y) - (line1.start.y - line2.end.y) * (line1.end.x - line2.end.x);

      // 面积符号相同则两点在线段同侧,不相交 (=0表示在线段顶点上);
      if (area_abc * area_abd > 0) {
        return null;
      }

      // 三角形cda 面积的2倍
      var area_cda = (line2.start.x - line1.start.x) * (line2.end.y - line1.start.y) - (line2.start.y - line1.start.y) * (line2.end.x - line1.start.x);
      // 三角形cdb 面积的2倍
      // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
      var area_cdb = area_cda + area_abc - area_abd;
      if (area_cda * area_cdb > 0) {
        return null;
      }
      if (area_abd === area_abc) return null;

      //计算交点坐标
      var t = area_cda / (area_abd - area_abc);
      var dx = t * (line1.end.x - line1.start.x);
      var dy = t * (line1.end.y - line1.start.y);
      return {
        x: line1.start.x + dx,
        y: line1.start.y + dy
      };
    }

    // 找出跟当前线段尾部相交的所有线段
  }, {
    key: "getIntersectionLines",
    value: function getIntersectionLines(line, lines, index) {
      var point = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : line.end;
      var points = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      var root = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var res = {
        line: line,
        polygons: []
      };
      points.push(point);
      if (root && this.equalPoint(root.line.start, point)) {
        points.unshift(root.line.start); // 把起始地址加入进去
        root.polygons.push(points);
        return res;
      }
      for (; index < lines.length; index++) {
        var l = lines[index];
        if (this.equalPoint(point, l.start)) {
          if (points.includes(l.end)) continue;
          this.getIntersectionLines(l, lines, index + 1, l.end, _toConsumableArray(points), root || res);
        } else if (this.equalPoint(point, l.end)) {
          if (points.includes(l.start)) continue;
          this.getIntersectionLines(l, lines, index + 1, l.start, _toConsumableArray(points), root || res);
        }
      }
      return res;
    }

    // 根据路径点坐标，切割出封闭的多边形
  }, {
    key: "getPolygon",
    value: function getPolygon(points) {
      var polygons = [];
      var lines = this.pathToLines(points); // 分解得到线段
      if (lines && lines.length > 2) {
        lines = this.cutLines(lines); // 把所有相交点切割线段找出来
        for (var i = 0; i < lines.length - 1; i++) {
          var line1 = lines[i];
          var polygon = []; // 当前图形

          var treeLine = this.getIntersectionLines(line1, lines, i + 1);
          if (treeLine.polygons.length) polygons.push.apply(polygons, _toConsumableArray(treeLine.polygons));
          continue;
          var lastLine = line1; // 下一个还在连接状态的线
          for (var j = i + 1; j < lines.length; j++) {
            var line2 = lines[j];
            // 如果跟下一条线相接，则表示还在形成图形中
            if (this.equalPoint(lastLine.end, line2.start)) {
              polygon.push(lastLine.end);
              lastLine = line2;
              if (i === j + 1) continue; //下一条相连 则不需要处理相交情况
            } else {
              polygon = [];
            }
            // 因为前面进行了分割线段，则里只有处理端点相连的情况
            var intersection = this.equalPoint(line1.start, line2.end) ? line1.start : null; //this.getIntersection(line1, line2);// 计算交点
            if (intersection) {
              polygon.push(intersection); // 交叉点为图形顶点
              // 如果上一个连接线不是当前交叉线，则表示重新开始闭合
              // 如果上一个连接线是当前交叉线，形成了封闭的图形
              if (lastLine === line2 && polygon.length > 1) {
                polygons.push(polygon);

                // 封闭后，下一个起始线条就是从交点开始计算起
                /*lastLine = {
                    start: intersection,
                    end: line2.end
                };*/
                polygon = []; // 重新开始新一轮找图形

                /*
                // 如果交点是上一条线的终点，则新图形为空
                if(this.equalPoint(line2.end, intersection)) {
                    polygon = [];// 重新开始新一轮找图形
                }
                else {
                    // 同时交点也要加到上一个图形中第一个点，形成封闭
                    polygon.unshift(intersection);
                      polygon = [ intersection ];// 重新开始新一轮找图形
                }*/
              } else {
                lastLine = line2;
              }
            }
          }
        }
      }

      // 当有多个封闭图形时，再弟归一下，里面是不是有封闭图形内还有子封闭图形
      /*if(polygons.length > 1) {
          const newPolygons = [];
          for(const polygon of polygons) {
              // 只有大于4才有可能有子封闭图形
              if(polygon.length > 4) {
                  const childPolygons = this.getPolygon(polygon);
                  // 当有多个子图形时，表示它不是最终封闭图形，跳过，
                  // 因为它的子图形之前有加入的，不需要重复加入
                  if(childPolygons.length > 1) {
                      //newPolygons.push(...childPolygons);
                      continue;
                  }
              }
              newPolygons.push(polygon);
          }
          polygons = newPolygons;
      }*/
      return polygons;
    }

    // 分割成一个个规则的三角形，不规则的多边形不全割的话纹理就会没法正确覆盖
  }, {
    key: "getTriangles",
    value: function getTriangles(points) {
      //this.trianglesCache = this.trianglesCache||(this.trianglesCache={});
      //const key = JSON.stringify(points);
      //if(this.trianglesCache[key]) return this.trianglesCache[key];

      var res = [];
      var polygons = this.getPolygon(points);
      if (polygons.length) {
        var _iterator3 = _createForOfIteratorHelper(polygons),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var polygon = _step3.value;
            // 需要分割三角形，不然填充会有问题
            var triangles = this.earCutPointsToTriangles(polygon);
            res.push.apply(res, _toConsumableArray(triangles));
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      //this.trianglesCache[key] = res;
      return res;
    }

    // 画线条
  }, {
    key: "stroke",
    value: function stroke() {
      var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.points;
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.style.strokeStyle;
      var lineWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.style.lineWidth;
      if (!points || !points.length) return;
      // this.useProgram();

      var colorBuffer = null;
      if (color) {
        colorBuffer = this.setFragColor(color);
      }
      // 线宽
      if (lineWidth) {
        this.context.uniform1f(this.program.uniforms.a_point_size.location, lineWidth); // * this.graph.devicePixelRatio
      }
      // 标注为stroke
      if (this.program.uniforms.a_type) {
        // 4表示单画一个圆点，1表示方块形成的线条
        this.context.uniform1i(this.program.uniforms.a_type.location, points.length === 1 ? 4 : 1);
      }
      if (points && points.length) {
        var regular = lineWidth <= 1.2;
        points = regular ? points : this.pathToPoints(points);
        var buffer = this.writePoints(points);
        this.context.drawArrays(regular ? this.context.LINE_LOOP : this.context.POINTS, 0, points.length);
        this.deleteBuffer(buffer);
      }
      colorBuffer && this.deleteBuffer(colorBuffer);
      colorBuffer && this.disableVertexAttribArray(colorBuffer.attr);
    }

    // 填充图形
  }, {
    key: "fill",
    value: function fill() {
      var bounds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (this.points && this.points.length) {
        // 如果是颜色rgba
        if (this.style.fillStyle) {
          this.fillColor(this.style.fillStyle, this.points, bounds, type);
        }
        if (this.style.fillImage) {
          this.fillImage(this.style.fillImage, this.points, bounds, type);
        }
      }
    }
  }, {
    key: "fillColor",
    value: function fillColor(color, points, bounds) {
      var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      // 如果是渐变色，则需要计算偏移量的颜色
      if (this.isGradient(color)) {
        var imgData = color.toImageData(this, bounds, points);
        return this.fillImage(imgData.data, imgData.points, bounds);
      }

      // 标注为fill
      this.context.uniform1i(this.program.uniforms.a_type.location, type);
      var colorBuffer = this.setFragColor(color);
      this.fillPolygons(points);
      colorBuffer && this.deleteBuffer(colorBuffer);
      colorBuffer && this.disableVertexAttribArray(colorBuffer.attr);
    }

    // 区域填充图片
    // points绘制的图形顶点
    // 图片整体绘制区域
  }, {
    key: "fillImage",
    value: function fillImage(img, points, bounds) {
      if (!img) return;

      // 设置纹理
      var texture = img instanceof ImageData ? this.createDataTexture(img) : this.createImgTexture(img);
      this.context.uniform1i(this.program.uniforms.u_sample.location, 0); // 纹理单元传递给着色器

      // 指定纹理区域尺寸
      this.context.uniform4f(this.program.uniforms.v_texture_bounds.location, bounds.left + this.parentAbsoluteBounds.left, bounds.top + this.parentAbsoluteBounds.top, bounds.width, bounds.height); // 纹理单元传递给着色器

      this.fillTexture(points);
      this.deleteTexture(texture);
    }
  }, {
    key: "fillTexture",
    value: function fillTexture(points) {
      if (points && points.length) {
        // 标注为纹理对象
        this.context.uniform1i(this.program.uniforms.a_type.location, 2);
        // 纹理坐标
        //const coordBuffer = this.writePoints(points, this.program.attrs.a_text_coord);
        this.fillPolygons(points, true);
        //this.deleteBuffer(coordBuffer);  
        this.disableVertexAttribArray(this.program.attrs.a_text_coord);
      }
    }

    // 进行多边形填充
  }, {
    key: "fillPolygons",
    value: function fillPolygons(points) {
      var isTexture = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      //const indexBuffer = this.createUint16Buffer(triangles, this.context.ELEMENT_ARRAY_BUFFER);
      //this.context.drawElements(this.context.TRIANGLES, triangles.length, this.context.UNSIGMED_SHORT, 0);
      //this.deleteBuffer(indexBuffer);
      /*if(points.length > 3 && (!regular || this.needCut)) {
          const triangles = regular && this.needCut? this.earCutPointsToTriangles(points): this.getTriangles(points);                
          if(triangles.length) {   
              for(const triangle of triangles) {
                  this.fillPolygons(triangle, isTexture);// 这里就变成了规则的图形了
              }
          }
      }
      else {*/
      var buffer = this.writePoints(points);
      // 纹理坐标
      var coordBuffer = isTexture ? this.writePoints(points, this.program.attrs.a_text_coord) : null;
      this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
      this.deleteBuffer(buffer);
      coordBuffer && this.deleteBuffer(coordBuffer);
      //}
    }

    // 填充图形
  }, {
    key: "drawImage",
    value: function drawImage(img) {
      var left = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var top = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : img.width;
      var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : img.height;
      width = width || img.width;
      height = height || img.height;
      this.fillImage(img, this.points, {
        left: left,
        top: top,
        width: width,
        height: height
      });
    }
  }, {
    key: "drawText",
    value: function drawText(text, x, y, bounds) {
      var canvas = this.textureCanvas;
      if (!canvas) {
        return null;
      }
      canvas.width = bounds.width;
      canvas.height = bounds.height;
      if (!canvas.width || !canvas.height) {
        return null;
      }
      this.textureContext.clearRect(0, 0, canvas.width, canvas.height);
      // 修改字体
      this.textureContext.font = this.style.font || this.style.fontSize + 'px ' + this.style.fontFamily;
      x -= bounds.left;
      y -= bounds.top;
      this.setTextureStyle(this.style);
      if (this.style.fillStyle && this.textureContext.fillText) {
        if (this.style.maxWidth) {
          this.textureContext.fillText(text, x, y, this.style.maxWidth);
        } else {
          this.textureContext.fillText(text, x, y);
        }
      }
      if (this.textureContext.strokeText) {
        if (this.style.maxWidth) {
          this.textureContext.strokeText(text, x, y, this.style.maxWidth);
        } else {
          this.textureContext.strokeText(text, x, y);
        }
      }
      // 用纹理图片代替文字
      var data = this.textureContext.getImageData(0, 0, canvas.width, canvas.height);
      this.fillImage(data, this.points, bounds);
    }
  }]);
}(_base["default"]);
var _default = exports["default"] = WebglPath;

},{"./base.js":13}],22:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArc = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 圆弧图型 继承自jmPath
 *
 * @class jmArc
 * @extends jmPath
 * @param {object} params center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针
 */
var jmArc = exports.jmArc = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmArc(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmArc';
    _classCallCheck(this, jmArc);
    if (!params) params = {};
    params.isRegular = params.isRegular === false ? false : true; // 规则的
    params.needCut = params.needCut === true ? true : false; // 规则的

    _this = _callSuper(this, jmArc, [params, t]);
    _this.center = params.center || {
      x: 0,
      y: 0
    };
    _this.radius = params.radius || 0;
    _this.startAngle = params.start || params.startAngle || 0;
    _this.endAngle = params.end || params.endAngle || Math.PI * 2;
    _this.anticlockwise = params.anticlockwise || 0;
    _this.isFan = !!params.isFan;
    return _this;
  }

  /**
   * 中心点
   * point格式：{x:0,y:0,m:true}
   * @property center
   * @type {point}
   */
  _inherits(jmArc, _jmPath);
  return _createClass(jmArc, [{
    key: "center",
    get: function get() {
      return this.property('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('center', v);
    }

    /**
     * 半径
     * @property radius
     * @type {number}
     */
  }, {
    key: "radius",
    get: function get() {
      return this.property('radius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('radius', v);
    }

    /**
     * 扇形起始角度
     * @property startAngle
     * @type {number}
     */
  }, {
    key: "startAngle",
    get: function get() {
      return this.property('startAngle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('startAngle', v);
    }

    /**
     * 扇形结束角度
     * @property endAngle
     * @type {number}
     */
  }, {
    key: "endAngle",
    get: function get() {
      return this.property('endAngle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('endAngle', v);
    }

    /**
     * 可选。规定应该逆时针还是顺时针绘图
     * false  顺时针，true 逆时针
     * @property anticlockwise
     * @type {boolean}
     */
  }, {
    key: "anticlockwise",
    get: function get() {
      return this.property('anticlockwise');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('anticlockwise', v);
    }

    /**
     * 初始化图形点
     * 
     * @method initPoint
     * @private
     * @for jmArc
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      var location = this.getLocation(); //获取位置参数
      var mw = 0;
      var mh = 0;
      var cx = location.center.x;
      var cy = location.center.y;
      //如果设定了半径。则以半径为主	
      if (location.radius) {
        mw = mh = location.radius;
      } else {
        mw = location.width / 2;
        mh = location.height / 2;
      }
      var start = this.startAngle;
      var end = this.endAngle;
      if (mw == 0 && mh == 0 || start == end) return;
      var anticlockwise = this.anticlockwise;
      this.points = [];
      var step = 1 / Math.max(mw, mh);

      //如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
      if (anticlockwise) {
        var p2 = Math.PI * 2;
        start = p2 - start;
        end = p2 - end;
      }
      if (start > end) step = -step;
      if (this.isFan) this.points.push(location.center); // 如果是扇形，则从中心开始画

      //椭圆方程x=a*cos(r) ,y=b*sin(r)	
      for (var r = start;; r += step) {
        if (step > 0 && r > end) r = end;else if (step < 0 && r < end) r = end;
        var p = {
          x: Math.cos(r) * mw + cx,
          y: Math.sin(r) * mh + cy
        };
        this.points.push(p);
        if (r == end) break;
      }
      return this.points;
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8}],23:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArrow = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
var _jmUtils = require("../core/jmUtils.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画箭头,继承自jmPath
 *
 * @class jmArrow
 * @extends jmPath
 * @param {object} 生成箭头所需的参数
 */
var jmArrow = exports.jmArrow = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmArrow(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmArrow';
    _classCallCheck(this, jmArrow);
    _this = _callSuper(this, jmArrow, [params, t]);
    _this.style.lineJoin = 'miter';
    _this.style.lineCap = 'square';
    _this.angle = params.angle || 0;
    _this.start = params.start || {
      x: 0,
      y: 0
    };
    _this.end = params.end || {
      x: 0,
      y: 0
    };
    _this.offsetX = params.offsetX || 5;
    _this.offsetY = params.offsetY || 8;
    return _this;
  }

  /**
   * 控制起始点
   *
   * @property start
   * @for jmArrow
   * @type {point}
   */
  _inherits(jmArrow, _jmPath);
  return _createClass(jmArrow, [{
    key: "start",
    get: function get() {
      return this.property('start');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('start', v);
    }

    /**
     * 控制结束点
     *
     * @property end
     * @for jmArrow
     * @type {point} 结束点
     */
  }, {
    key: "end",
    get: function get() {
      return this.property('end');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('end', v);
    }

    /**
     * 箭头角度
     *
     * @property angle
     * @for jmArrow
     * @type {number} 箭头角度
     */
  }, {
    key: "angle",
    get: function get() {
      return this.property('angle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('angle', v);
    }

    /**
     * 箭头X偏移量
     *
     * @property offsetX
     * @for jmArrow
     * @type {number}
     */
  }, {
    key: "offsetX",
    get: function get() {
      return this.property('offsetX');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('offsetX', v);
    }

    /**
     * 箭头Y偏移量
     *
     * @property offsetY
     * @for jmArrow
     * @type {number}
     */
  }, {
    key: "offsetY",
    get: function get() {
      return this.property('offsetY');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('offsetY', v);
    }

    /**
     * 初始化图形点
     * 
     * @method initPoint
     * @private
     * @param {boolean} solid 是否为实心的箭头
     * @for jmArrow
     */
  }, {
    key: "initPoints",
    value: function initPoints(solid) {
      var rotate = this.angle;
      var start = this.start;
      var end = this.end;
      if (!end) return;
      //计算箭头指向角度
      if (!rotate) {
        rotate = Math.atan2(end.y - start.y, end.x - start.x);
      }
      this.points = [];
      var offx = this.offsetX;
      var offy = this.offsetY;
      //箭头相对于线的偏移角度
      var r = Math.atan2(offx, offy);
      var r1 = rotate + r;
      var rsin = Math.sin(r1);
      var rcos = Math.cos(r1);
      var sq = Math.sqrt(offx * offx + offy * offy);
      var ystep = rsin * sq;
      var xstep = rcos * sq;
      var p1 = {
        x: end.x - xstep,
        y: end.y - ystep
      };
      var r2 = rotate - r;
      rsin = Math.sin(r2);
      rcos = Math.cos(r2);
      ystep = rsin * sq;
      xstep = rcos * sq;
      var p2 = {
        x: end.x - xstep,
        y: end.y - ystep
      };
      var s = _jmUtils.jmUtils.clone(end);
      s.m = true;
      this.points.push(s);
      this.points.push(p1);
      //如果实心箭头则封闭路线
      if (solid || this.style.fill) {
        this.points.push(p2);
        this.points.push(end);
      } else {
        this.points.push(s);
        this.points.push(p2);
      }
      return this.points;
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8,"../core/jmUtils.js":11}],24:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArrowLine = exports["default"] = void 0;
var _jmLine2 = require("./jmLine.js");
var _jmArrow = require("./jmArrow.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o); return 2 & r && "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrowLine
 * @extends jmLine
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */
var jmArrowLine = exports.jmArrowLine = exports["default"] = /*#__PURE__*/function (_jmLine) {
  function jmArrowLine(params, t) {
    var _this;
    _classCallCheck(this, jmArrowLine);
    params.start = params.start || {
      x: 0,
      y: 0
    };
    params.end = params.end || {
      x: 0,
      y: 0
    };
    _this = _callSuper(this, jmArrowLine, [params, t || 'jmArrowLine']);
    _this.style.lineJoin = _this.style.lineJoin || 'miter';
    _this.arrow = new _jmArrow.jmArrow(params);
    return _this;
  }

  /**
   * 初始化直线和箭头描点
   *
   * @method initPoints
   * @private
   */
  _inherits(jmArrowLine, _jmLine);
  return _createClass(jmArrowLine, [{
    key: "initPoints",
    value: function initPoints() {
      this.points = _superPropGet(jmArrowLine, "initPoints", this, 3)([]);
      if (this.arrowVisible !== false) {
        this.points = this.points.concat(this.arrow.initPoints());
      }
      return this.points;
    }
  }]);
}(_jmLine2.jmLine);

},{"./jmArrow.js":23,"./jmLine.js":30}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmBezier = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 贝塞尔曲线,继承jmPath
 * N阶，参数points中为控制点
 *
 * @class jmBezier
 * @extends jmPath
 * @param {object} params 参数
 */
var jmBezier = exports.jmBezier = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmBezier(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmBezier';
    _classCallCheck(this, jmBezier);
    // 典线默认不封闭
    if (params.style && _typeof(params.style.close) !== true) {
      params.style.close = false;
    }
    _this = _callSuper(this, jmBezier, [params, t]);
    _this.cpoints = params.points || [];
    return _this;
  }

  /**
   * 控制点
   *
   * @property cpoints
   * @for jmBezier
   * @type {array}
   */
  _inherits(jmBezier, _jmPath);
  return _createClass(jmBezier, [{
    key: "cpoints",
    get: function get() {
      return this.property('cpoints');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('cpoints', v);
    }

    /**
     * 初始化图形点
     *
     * @method initPoints
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      this.points = [];
      var cps = this.cpoints;
      for (var t = 0; t <= 1; t += 0.01) {
        var p = this.getPoint(cps, t);
        this.points.push(p);
      }
      this.points.push(cps[cps.length - 1]);
      return this.points;
    }

    /**
     * 根据控制点和参数t生成贝塞尔曲线轨迹点
     *
     * @method getPoint
     * @param {array} ps 控制点集合
     * @param {number} t 参数(0-1)
     * @return {array} 所有轨迹点的数组
     */
  }, {
    key: "getPoint",
    value: function getPoint(ps, t) {
      if (ps.length == 1) return ps[0];
      if (ps.length == 2) {
        var p = {};
        p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
        p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
        return p;
      }
      if (ps.length > 2) {
        var nps = [];
        for (var i = 0; i < ps.length - 1; i++) {
          var _p = this.getPoint([ps[i], ps[i + 1]], t);
          if (_p) nps.push(_p);
        }
        return this.getPoint(nps, t);
      }
    }

    /**
     * 对控件进行平移
     * 遍历控件所有描点或位置，设置其偏移量。
     *
     * @method offset
     * @param {number} x x轴偏移量
     * @param {number} y y轴偏移量
     * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
     */
  }, {
    key: "offset",
    value: function offset(x, y, trans) {
      var p = this.cpoints;
      if (p) {
        var len = p.length;
        for (var i = 0; i < len; i++) {
          p[i].x += x;
          p[i].y += y;
        }

        //触发控件移动事件	
        this.emit('move', {
          offsetX: x,
          offsetY: y,
          trans: trans
        });
        this.getLocation(true); //重置
      }
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8}],26:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmCircle = exports["default"] = void 0;
var _jmArc2 = require("./jmArc.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o); return 2 & r && "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画规则的圆弧
 *
 * @class jmCircle
 * @extends jmArc
 * @param {object} params 圆的参数:center=圆中心,radius=圆半径,优先取此属性，如果没有则取宽和高,width=圆宽,height=圆高
 */
var jmCircle = exports.jmCircle = exports["default"] = /*#__PURE__*/function (_jmArc) {
  function jmCircle(params) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmCircle';
    _classCallCheck(this, jmCircle);
    params.isRegular = true; // 规则的
    return _callSuper(this, jmCircle, [params, t]);
  }
  /**
   * 初始化图形点
   * 
   * @method initPoint
   * @private
   * @for jmCircle
   */
  _inherits(jmCircle, _jmArc);
  return _createClass(jmCircle, [{
    key: "initPoints",
    value: function initPoints() {
      if (this.graph.mode === 'webgl') {
        return _superPropGet(jmCircle, "initPoints", this, 3)([]);
      }
      var location = this.getLocation();
      if (!location.radius) {
        location.radius = Math.min(location.width, location.height) / 2;
      }
      this.points = [];
      this.points.push({
        x: location.center.x - location.radius,
        y: location.center.y - location.radius
      });
      this.points.push({
        x: location.center.x + location.radius,
        y: location.center.y - location.radius
      });
      this.points.push({
        x: location.center.x + location.radius,
        y: location.center.y + location.radius
      });
      this.points.push({
        x: location.center.x - location.radius,
        y: location.center.y + location.radius
      });
    }

    /**
     * 重写基类画图，此处为画一个完整的圆 
     *
     * @method draw
     */
  }, {
    key: "draw",
    value: function draw() {
      if (this.graph.mode === 'webgl') {
        return _superPropGet(jmCircle, "draw", this, 3)([]);
      }
      var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      var location = this.getLocation();
      if (!location.radius) {
        location.radius = Math.min(location.width, location.height) / 2;
      }
      var start = this.startAngle;
      var end = this.endAngle;
      var anticlockwise = this.anticlockwise;
      //context.arc(x,y,r,sAngle,eAngle,counterclockwise);
      this.context.arc(location.center.x + bounds.left, location.center.y + bounds.top, location.radius, start, end, anticlockwise);
    }
  }]);
}(_jmArc2.jmArc);

},{"./jmArc.js":22}],27:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmHArc = exports["default"] = void 0;
var _jmArc2 = require("./jmArc.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @extends jmArc
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=false  顺时针，true 逆时针
 */
var jmHArc = exports.jmHArc = exports["default"] = /*#__PURE__*/function (_jmArc) {
  function jmHArc(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmHArc';
    _classCallCheck(this, jmHArc);
    params.isRegular = true; // 规则的
    params.needCut = true;
    _this = _callSuper(this, jmHArc, [params, t]);
    _this.minRadius = params.minRadius || _this.style.minRadius || 0;
    _this.maxRadius = params.maxRadius || _this.style.maxRadius || 0;
    return _this;
  }

  /**
   * 设定或获取内空心圆半径
   * 
   * @property minRadius
   * @for jmHArc
   * @type {number} 
   */
  _inherits(jmHArc, _jmArc);
  return _createClass(jmHArc, [{
    key: "minRadius",
    get: function get() {
      return this.property('minRadius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('minRadius', v);
    }

    /**
     * 设定或获取外空心圆半径
     * 
     * @property maxRadius
     * @for jmHArc
     * @type {number} 
     */
  }, {
    key: "maxRadius",
    get: function get() {
      return this.property('maxRadius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('maxRadius', v);
    }

    /**
     * 初始化图形点
     *
     * @method initPoints
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      var location = this.getLocation();
      //如果设定了半径。则以半径为主
      var minr = this.minRadius;
      var maxr = this.maxRadius;
      var start = this.startAngle;
      var end = this.endAngle;
      var anticlockwise = this.anticlockwise;

      //如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
      if (anticlockwise) {
        var p2 = Math.PI * 2;
        start = p2 - start;
        end = p2 - end;
      }
      var step = 0.1;
      if (start > end) step = -step;
      var minps = [];
      var maxps = [];
      //椭圆方程x=a*cos(r) ,y=b*sin(r)
      for (var r = start;; r += step) {
        if (step > 0 && r > end) {
          r = end;
        } else if (step < 0 && r < end) {
          r = end;
        }
        var cos = Math.cos(r);
        var sin = Math.sin(r);
        var p1 = {
          x: cos * minr + location.center.x,
          y: sin * minr + location.center.y
        };
        var _p = {
          x: cos * maxr + location.center.x,
          y: sin * maxr + location.center.y
        };
        minps.push(p1);
        maxps.push(_p);
        if (r === end) break;
      }
      maxps.reverse(); //大圆逆序
      if (!this.style || !this.style.close) {
        maxps[0].m = true; //开始画大圆时表示为移动
      }
      this.points = minps.concat(maxps);
    }
  }]);
}(_jmArc2.jmArc);

},{"./jmArc.js":22}],28:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmImage = exports["default"] = void 0;
var _jmControl2 = require("../core/jmControl.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o); return 2 & r && "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。
 * 
 * @class jmImage
 * @extends jmControl
 * @param {object} params 控件参数
 */
var jmImage = exports.jmImage = exports["default"] = /*#__PURE__*/function (_jmControl) {
  function jmImage(params, t) {
    var _this;
    _classCallCheck(this, jmImage);
    params = params || {};
    params.isRegular = true; // 规则的
    _this = _callSuper(this, jmImage, [params, t || 'jmImage']);
    _this.style.fill = _this.fill || 'transparent'; //默认指定一个fill，为了可以鼠标选中

    _this.sourceWidth = params.sourceWidth;
    _this.sourceHeight = params.sourceHeight;
    _this.sourcePosition = params.sourcePosition;
    _this.image = params.image || _this.style.image;
    return _this;
  }

  /**
   * 画图开始剪切位置
   *
   * @property sourcePosition
   * @type {point}
   */
  _inherits(jmImage, _jmControl);
  return _createClass(jmImage, [{
    key: "sourcePosition",
    get: function get() {
      return this.property('sourcePosition');
    },
    set: function set(v) {
      return this.property('sourcePosition', v);
    }

    /**
     * 被剪切宽度
     *
     * @property sourceWidth
     * @type {number}
     */
  }, {
    key: "sourceWidth",
    get: function get() {
      return this.property('sourceWidth');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('sourceWidth', v);
    }

    /**
     * 被剪切高度
     *
     * @method sourceHeight
     * @type {number}
     */
  }, {
    key: "sourceHeight",
    get: function get() {
      return this.property('sourceHeight');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('sourceHeight', v);
    }

    /**
     * 设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象
     *
     * @method image
     * @type {img}
     */
  }, {
    key: "image",
    get: function get() {
      return this.property('image');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('image', v);
    }

    /**
     * 重写控件绘制
     * 根据父边界偏移和此控件参数绘制图片
     *
     * @method draw
     */
  }, {
    key: "draw",
    value: function draw() {
      try {
        var img = this.getImage();
        this.drawImg(img);
      } catch (e) {
        console.error && console.error(e);
      }
    }

    // 绘制
  }, {
    key: "drawImg",
    value: function drawImg(img) {
      if (!img || !img.complete) {
        console.warn('image is empty');
        return;
      }
      var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      if (!bounds) bounds = this.parent && this.parent.getAbsoluteBounds ? this.parent.getAbsoluteBounds() : this.getAbsoluteBounds();
      var p = this.getLocation();
      var sp = this.sourcePosition;
      var sw = this.sourceWidth;
      var sh = this.sourceHeight;
      var ctx = this.webglControl || this.context;
      if (this.webglControl) {
        ctx.setParentBounds && ctx.setParentBounds(bounds);
        var localBounds = this.getBounds();
        // 给图片给定顶点
        ctx.draw([{
          x: localBounds.left,
          y: localBounds.top
        }, {
          x: localBounds.left + localBounds.width,
          y: localBounds.top
        }, {
          x: localBounds.left + localBounds.width,
          y: localBounds.top + localBounds.height
        }, {
          x: localBounds.left,
          y: localBounds.top + localBounds.height
        }], bounds);
        ctx.drawImage(img, localBounds.left, localBounds.top, localBounds.width, localBounds.height);
        return;
      }

      // 计算绝对定位
      p.left += bounds.left;
      p.top += bounds.top;
      if (sp || typeof sw != 'undefined' || typeof sh != 'undefined') {
        if (typeof sw == 'undefined') sw = p.width || img.width || 0;
        if (typeof sh == 'undefined') sh = p.height || img.height || 0;
        sp = sp || {
          x: 0,
          y: 0
        };
        if (p.width && p.height) ctx.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, p.width, p.height);else if (p.width) {
          ctx.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, p.width, sh);
        } else if (p.height) {
          ctx.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, sw, p.height);
        } else ctx.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, sw, sh);
      } else if (p) {
        if (p.width && p.height) ctx.drawImage(img, p.left, p.top, p.width, p.height);else if (p.width) ctx.drawImage(img, p.left, p.top, p.width, img.height);else if (p.height) ctx.drawImage(img, p.left, p.top, img.width, p.height);else ctx.drawImage(img, p.left, p.top);
      } else {
        ctx.drawImage(img);
      }
    }

    /**
     * 获取当前控件的边界 
     * 
     * @method getBounds
     * @return {object} 边界对象(left,top,right,bottom,width,height)
     */
  }, {
    key: "getBounds",
    value: function getBounds(isReset) {
      //如果当次计算过，则不重复计算
      if (this.bounds && !isReset) return this.bounds;
      var rect = {};
      var img = this.getImage() || {
        width: 0,
        height: 0
      };
      var p = this.getLocation();
      var w = p.width || img.width;
      var h = p.height || img.height;
      rect.left = p.left;
      rect.top = p.top;
      rect.right = p.left + w;
      rect.bottom = p.top + h;
      rect.width = w;
      rect.height = h;
      return this.bounds = rect;
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      var img = this.getImage();
      var loc = _superPropGet(jmImage, "getLocation", this, 3)([]);
      // 如果指定了宽度，但没有指定高宽，则等比缩放
      if (loc.width && !loc.height) {
        loc.height = loc.width / img.width * img.height;
      } else if (loc.height && !loc.width) {
        loc.width = loc.height / img.height * img.width;
      }
      return loc;
    }

    /**
     * img对象
     *
     * @method getImage
     * @return {img} 图片对象
     */
  }, {
    key: "getImage",
    value: function getImage() {
      var _this2 = this;
      var src = this.image || this.style.src || this.style.image;
      if (this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
        return this.__img;
      } else if (src && src.src) {
        this.__img = src;
      } else if (typeof document !== 'undefined' && document.createElement) {
        this.__img = document.createElement('img');
        this.__img.onload = function () {
          _this2.needUpdate = true;
        };
        if (src && typeof src == 'string') this.__img.src = src;
      } else if (this.graph.isWXMiniApp && this.graph.canvas && typeof src === 'string') {
        // 图片对象
        this.__img = this.graph.canvas.createImage();
        this.__img.onload = function () {
          _this2.needUpdate = true;
        };
        // 设置图片src
        this.__img.src = src;
      } else {
        this.__img = src;
      }
      if (this.__img) this.image = this.__img.src;
      return this.__img;
    }
  }]);
}(_jmControl2.jmControl);

},{"../core/jmControl.js":2}],29:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmLabel = exports["default"] = void 0;
var _jmControl2 = require("../core/jmControl.js");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, e, o, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), e, o); return 2 & r && "function" == typeof p ? function (t) { return p.apply(o, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 显示文字控件
 *
 * @class jmLabel
 * @extends jmControl
 * @param {object} params params参数:style=样式，value=显示的文字
 */
var jmLabel = exports.jmLabel = exports["default"] = /*#__PURE__*/function (_jmControl) {
  function jmLabel(params, t) {
    var _this;
    _classCallCheck(this, jmLabel);
    params = params || {};
    params.isRegular = true; // 规则的
    _this = _callSuper(this, jmLabel, [params, t || 'jmLabel']);
    _this.style.font = _this.style.font || "15px Arial";
    _this.style.fontFamily = _this.style.fontFamily || 'Arial';
    _this.style.fontSize = _this.style.fontSize || 15;

    // 显示不同的 textAlign 值
    //文字水平对齐
    _this.style.textAlign = _this.style.textAlign || 'left';
    //文字垂直对齐
    _this.style.textBaseline = _this.style.textBaseline || 'middle';
    _this.text = params.text || '';
    _this.center = params.center || null;
    return _this;
  }

  /**
   * 显示的内容
   * @property text
   * @type {string}
   */
  _inherits(jmLabel, _jmControl);
  return _createClass(jmLabel, [{
    key: "text",
    get: function get() {
      return this.property('text');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('text', v);
    }

    /**
     * 中心点
     * point格式：{x:0,y:0,m:true}
     * @property center
     * @type {point}
     */
  }, {
    key: "center",
    get: function get() {
      return this.property('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('center', v);
    }

    /**
     * 当前位置左上角
     * @property position
     * @type {point}
     */
  }, {
    key: "position",
    get: function get() {
      return this.property('position');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('position', v);
    }

    /**
     * 在基础的getLocation上，再加上一个特殊的center处理
     * 
     * @method getLocation
     * @returns {Object}
     */
  }, {
    key: "getLocation",
    value: function getLocation() {
      var location = _superPropGet(jmLabel, "getLocation", this, 3)([]);
      var size = this.testSize();
      location.width = location.width || size.width;
      location.height = location.height || size.height;

      //如果没有指定位置，但指定了中心，则用中心来计算坐标
      if (!location.left && !location.top && location.center) {
        location.left = location.center.x - location.width / 2;
        location.top = location.center.y - location.height / 2;
      }
      return location;
    }

    /**
     * 初始化图形点,主要用于限定控件边界。
     *
     * @method initPoints
     * @return {array} 所有边界点数组
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      this.__size = null;
      var location = this.getLocation();
      this.points = [{
        x: location.left,
        y: location.top
      }];
      this.points.push({
        x: location.left + location.width,
        y: location.top
      });
      this.points.push({
        x: location.left + location.width,
        y: location.top + location.height
      });
      this.points.push({
        x: location.left,
        y: location.top + location.height
      });
      return this.points;
    }

    /**
     * 测试获取文本所占大小
     *
     * @method testSize
     * @return {object} 含文本大小的对象
     */
  }, {
    key: "testSize",
    value: function testSize() {
      if (this.__size) return this.__size;
      if (this.webglControl) this.__size = this.webglControl.testSize(this.text, this.style);else {
        this.context.save && this.context.save();
        // 修改字体，用来计算
        this.setStyle({
          font: this.style.font || this.style.fontSize + 'px ' + this.style.fontFamily
        });
        //计算宽度
        this.__size = this.context.measureText ? this.context.measureText(this.text) : {
          width: 15
        };
        this.context.restore && this.context.restore();
        this.__size.height = this.style.fontSize ? this.style.fontSize : 15;
      }
      if (!this.width) this.width = this.__size.width;
      if (!this.height) this.height = this.__size.height;
      return this.__size;
    }

    /**
     * 根据位置偏移画字符串
     * 
     * @method draw
     */
  }, {
    key: "draw",
    value: function draw() {
      //获取当前控件的绝对位置
      var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      var size = this.testSize();
      var location = this.location;
      var x = location.left + bounds.left;
      var y = location.top + bounds.top;
      //通过文字对齐方式计算起始X位置
      switch (this.style.textAlign) {
        case 'right':
          {
            x += location.width;
            break;
          }
        case 'center':
          {
            x += location.width / 2;
            break;
          }
      }
      //通过垂直对齐方式计算起始Y值
      switch (this.style.textBaseline) {
        case 'bottom':
          {
            y += location.height;
            break;
          }
        case 'hanging':
        case 'alphabetic':
        case 'middle':
          {
            y += location.height / 2;
            break;
          }
      }
      var txt = this.text;
      if (typeof txt !== 'undefined') {
        // webgl方式
        if (this.webglControl) {
          this.webglControl.draw(this.points, bounds);
          this.webglControl.drawText(txt, x, y, location);
        } else if (this.style.fill && this.context.fillText) {
          if (this.style.maxWidth) {
            this.context.fillText(txt, x, y, this.style.maxWidth);
          } else {
            this.context.fillText(txt, x, y);
          }
        } else if (this.context.strokeText) {
          if (this.style.maxWidth) {
            this.context.strokeText(txt, x, y, this.style.maxWidth);
          } else {
            this.context.strokeText(txt, x, y);
          }
        }
      }
      //如果有指定边框，则画出边框
      if (this.style.border) {
        //如果指定了边框样式
        if (this.style.border.style) {
          this.context.save && this.context.save();
          this.setStyle(this.style.border.style);
        }
        if (this.mode === '2d') {
          this.context.moveTo(this.points[0].x + bounds.left, this.points[0].y + bounds.top);
          if (this.style.border.top) {
            this.context.lineTo(this.points[1].x + bounds.left, this.points[1].y + bounds.top);
          }
          if (this.style.border.right) {
            this.context.moveTo(this.points[1].x + bounds.left, this.points[1].y + bounds.top);
            this.context.lineTo(this.points[2].x + bounds.left, this.points[2].y + bounds.top);
          }
          if (this.style.border.bottom) {
            this.context.moveTo(this.points[2].x + bounds.left, this.points[2].y + bounds.top);
            this.context.lineTo(this.points[3].x + bounds.left, this.points[3].y + bounds.top);
          }
          if (this.style.border.left) {
            this.context.moveTo(this.points[3].x + bounds.left, this.points[3].y + bounds.top);
            this.context.lineTo(this.points[0].x + bounds.left, this.points[0].y + bounds.top);
          }
        } else {
          var points = [];
          if (this.style.border.top) {
            points.push(this.points[0]);
            points.push(this.points[1]);
          }
          if (this.style.border.right) {
            points.push(_objectSpread(_objectSpread({}, this.points[1]), {}, {
              m: true
            }));
            points.push(this.points[2]);
          }
          if (this.style.border.bottom) {
            points.push(_objectSpread(_objectSpread({}, this.points[2]), {}, {
              m: true
            }));
            points.push(this.points[3]);
          }
          if (this.style.border.left) {
            points.push(_objectSpread(_objectSpread({}, this.points[3]), {}, {
              m: true
            }));
            points.push(this.points[0]);
          }
          points.length && this.webglControl && this.webglControl.stroke(points);
        }
      }
    }
  }, {
    key: "endDraw",
    value: function endDraw() {
      if (this.mode === '2d') {
        _superPropGet(jmLabel, "endDraw", this, 3)([]);
      }
    }
  }]);
}(_jmControl2.jmControl);

},{"../core/jmControl.js":2}],30:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmLine = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画一条直线
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */
var jmLine = exports.jmLine = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmLine(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmLine';
    _classCallCheck(this, jmLine);
    params.isRegular = true; // 规则的

    _this = _callSuper(this, jmLine, [params, t]);
    _this.start = params.start || {
      x: 0,
      y: 0
    };
    _this.end = params.end || {
      x: 0,
      y: 0
    };
    _this.style.lineType = _this.style.lineType || 'solid';
    _this.style.dashLength = _this.style.dashLength || 4;
    _this.style.close = false;
    return _this;
  }

  /**
   * 控制起始点
   * 
   * @property start
   * @for jmLine
   * @type {point}
   */
  _inherits(jmLine, _jmPath);
  return _createClass(jmLine, [{
    key: "start",
    get: function get() {
      return this.property('start');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('start', v);
    }

    /**
     * 控制结束点
     * 
     * @property end
     * @for jmLine
     * @type {point}
     */
  }, {
    key: "end",
    get: function get() {
      return this.property('end');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('end', v);
    }

    /**
     * 初始化图形点,如呆为虚线则根据跳跃间隔描点
     * @method initPoints
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      var start = this.start;
      var end = this.end;
      this.points = [];
      this.points.push(start);
      if (this.style.lineType === 'dotted') {
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var lineLen = Math.sqrt(dx * dx + dy * dy);
        dx = dx / lineLen;
        dy = dy / lineLen;
        var dottedstart = false;
        var dashLen = this.style.dashLength || 5;
        var dottedsp = dashLen / 2;
        for (var l = dashLen; l <= lineLen;) {
          var p = {
            x: start.x + dx * l,
            y: start.y + dy * l
          };
          if (dottedstart === false) {
            l += dottedsp;
          } else {
            p.m = true; // 移动到当时坐标
            l += dashLen;
          }
          this.points.push(p);
          dottedstart = !dottedstart;
        }
      }
      this.points.push(end);
      return this.points;
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8}],31:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmPrismatic = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画棱形
 *
 * @class jmPrismatic
 * @extends jmPath
 * @param {object} params 参数 center=棱形中心点，width=棱形宽,height=棱形高
 */
var jmPrismatic = exports.jmPrismatic = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmPrismatic(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmPrismatic';
    _classCallCheck(this, jmPrismatic);
    params.isRegular = true; // 规则的

    _this = _callSuper(this, jmPrismatic, [params, t]);
    _this.style.close = typeof _this.style.close == 'undefined' ? true : _this.style.close;
    _this.center = params.center || {
      x: 0,
      y: 0
    };
    _this.width = params.width || 0;

    //this.on('PropertyChange',this.initPoints);
    _this.height = params.height || 0;
    return _this;
  }

  /**
   * 中心点
   * point格式：{x:0,y:0,m:true}
   * @property center
   * @type {point}
   */
  _inherits(jmPrismatic, _jmPath);
  return _createClass(jmPrismatic, [{
    key: "center",
    get: function get() {
      return this.property('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('center', v);
    }

    /**
     * 初始化图形点
     * 计算棱形顶点
     * 
     * @method initPoints
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      var location = this.getLocation();
      var mw = location.width / 2;
      var mh = location.height / 2;
      this.points = [];
      this.points.push({
        x: location.center.x - mw,
        y: location.center.y
      });
      this.points.push({
        x: location.center.x,
        y: location.center.y + mh
      });
      this.points.push({
        x: location.center.x + mw,
        y: location.center.y
      });
      this.points.push({
        x: location.center.x,
        y: location.center.y - mh
      });
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8}],32:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmRect = exports["default"] = void 0;
var _jmPath2 = require("../core/jmPath.js");
var _jmArc = require("./jmArc.js");
var _jmLine = require("./jmLine.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 画矩形
 *
 * @class jmRect
 * @extends jmPath
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 */
var jmRect = exports.jmRect = exports["default"] = /*#__PURE__*/function (_jmPath) {
  function jmRect(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmRect';
    _classCallCheck(this, jmRect);
    params = params || {};
    params.isRegular = true; // 规则的
    _this = _callSuper(this, jmRect, [params, t]);
    _this.style.close = true;
    _this.radius = params.radius || _this.style.radius || 0;
    return _this;
  }
  /**
   * 圆角半径
   * @property radius
   * @type {number}
   */
  _inherits(jmRect, _jmPath);
  return _createClass(jmRect, [{
    key: "radius",
    get: function get() {
      return this.property('radius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('radius', v);
    }

    /**
     * 当前位置左上角
     * @property position
     * @type {point}
     */
  }, {
    key: "position",
    get: function get() {
      return this.property('position');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.property('position', v);
    }

    /**
     * 获取当前控件的边界
     *
     * @method getBounds
     * @return {bound} 当前控件边界
     */
  }, {
    key: "getBounds",
    value: function getBounds(isReset) {
      //如果当次计算过，则不重复计算
      if (this.bounds && !isReset) return this.bounds;
      var rect = {};
      this.initPoints();
      var p = this.getLocation();
      rect.left = p.left;
      rect.top = p.top;
      rect.right = p.left + p.width;
      rect.bottom = p.top + p.height;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      return this.bounds = rect;
    }

    /**
     * 重写检查坐标是否在区域内
     *
     * @method checkPoint
     * @param {point} p 待检查的坐标
     * @return {boolean} 如果在则返回true,否则返回false
     */
    /*checkPoint(p) {	
    	//生成当前坐标对应的父级元素的相对位置
    	let abounds = this.bounds || this.getBounds();
    
    	if(p.x > abounds.right || p.x < abounds.left) {
    		return false;
    	}
    	if(p.y > abounds.bottom || p.y < abounds.top) {
    		return false;
    	}
    	
    	return true;
    }*/

    /**
     * 初始化图形点
     * 如果有边角弧度则类型圆绝计算其描点
     * 
     * @method initPoints
     * @private
     */
  }, {
    key: "initPoints",
    value: function initPoints() {
      var location = this.getLocation();
      var p1 = {
        x: location.left,
        y: location.top
      };
      var p2 = {
        x: location.left + location.width,
        y: location.top
      };
      var p3 = {
        x: location.left + location.width,
        y: location.top + location.height
      };
      var p4 = {
        x: location.left,
        y: location.top + location.height
      };

      //如果指定为虚线 , 则初始化一个直线组件，来构建虚线点集合
      if (this.style.lineType === 'dotted' && !this.dottedLine) {
        this.dottedLine = this.graph.createShape(_jmLine.jmLine, {
          style: this.style
        });
      }

      //如果有边界弧度则借助圆弧对象计算描点
      if (location.radius && location.radius < location.width / 2 && location.radius < location.height / 2) {
        var q = Math.PI / 2;
        var arc = this.graph.createShape(_jmArc.jmArc, {
          radius: location.radius,
          anticlockwise: false
        });
        arc.center = {
          x: location.left + location.radius,
          y: location.top + location.radius
        };
        arc.startAngle = Math.PI;
        arc.endAngle = Math.PI + q;
        var ps1 = arc.initPoints();
        arc = this.graph.createShape(_jmArc.jmArc, {
          radius: location.radius,
          anticlockwise: false
        });
        arc.center = {
          x: p2.x - location.radius,
          y: p2.y + location.radius
        };
        arc.startAngle = Math.PI + q;
        arc.endAngle = Math.PI * 2;
        var ps2 = arc.initPoints();
        arc = this.graph.createShape(_jmArc.jmArc, {
          radius: location.radius,
          anticlockwise: false
        });
        arc.center = {
          x: p3.x - location.radius,
          y: p3.y - location.radius
        };
        arc.startAngle = 0;
        arc.endAngle = q;
        var ps3 = arc.initPoints();
        arc = this.graph.createShape(_jmArc.jmArc, {
          radius: location.radius,
          anticlockwise: false
        });
        arc.center = {
          x: p4.x + location.radius,
          y: p4.y - location.radius
        };
        arc.startAngle = q;
        arc.endAngle = Math.PI;
        var ps4 = arc.initPoints();
        this.points = ps1.concat(ps2, ps3, ps4);
      } else {
        this.points = [];
        this.points.push(p1);
        //如果是虚线
        if (this.dottedLine) {
          this.dottedLine.start = p1;
          this.dottedLine.end = p2;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }
        this.points.push(p2);
        //如果是虚线
        if (this.dottedLine) {
          this.dottedLine.start = p2;
          this.dottedLine.end = p3;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }
        this.points.push(p3);
        //如果是虚线
        if (this.dottedLine) {
          this.dottedLine.start = p3;
          this.dottedLine.end = p4;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }
        this.points.push(p4);
        //如果是虚线
        if (this.dottedLine) {
          this.dottedLine.start = p4;
          this.dottedLine.end = p1;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }
      }
      return this.points;
    }
  }]);
}(_jmPath2.jmPath);

},{"../core/jmPath.js":8,"./jmArc.js":22,"./jmLine.js":30}],33:[function(require,module,exports){
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmResize = exports["default"] = void 0;
var _jmRect2 = require("./jmRect.js");
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
/**
 * 可拉伸的缩放控件
 * 继承jmRect
 * 如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。
 *
 * @class jmResize
 * @extends jmRect
 */
var jmResize = exports.jmResize = exports["default"] = /*#__PURE__*/function (_jmRect) {
  function jmResize(params) {
    var _this;
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmResize';
    _classCallCheck(this, jmResize);
    params = params || {};
    params.isRegular = true; // 规则的

    _this = _callSuper(this, jmResize, [params, t]);
    //是否可拉伸
    _this.resizable = params.resizable === false ? false : true;
    _this.movable = params.movable;
    _this.rectSize = params.rectSize || 8;
    _this.style.close = _this.style.close || true;

    // 方块鼠标指针方向
    _this.rectCursors = ['w-resize', 'nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize'];
    _this.init(params);
    return _this;
  }
  /**
   * 拉动的小方块大小
   * @property rectSize
   * @type {number}
   */
  _inherits(jmResize, _jmRect);
  return _createClass(jmResize, [{
    key: "rectSize",
    get: function get() {
      return this.property('rectSize');
    },
    set: function set(v) {
      return this.property('rectSize', v);
    }

    /**
     * 是否可以拉大缩小
     * @property resizable
     * @type {boolean}
     */
  }, {
    key: "resizable",
    get: function get() {
      return this.property('resizable');
    },
    set: function set(v) {
      return this.property('resizable', v);
    }

    /**
     * 初始化控件的8个拉伸方框
     *
     * @method init
     * @private
     */
  }, {
    key: "init",
    value: function init(params) {
      //如果不可改变大小。则直接退出
      if (this.resizable === false) return;
      this.resizeRects = [];
      var rs = this.rectSize;
      var rectStyle = this.style.rectStyle || {
        stroke: 'red',
        fill: 'transparent',
        lineWidth: 2,
        close: true,
        zIndex: 100
      };
      rectStyle.close = true;
      rectStyle.fill = rectStyle.fill || 'transparent';
      for (var i = 0; i < 8; i++) {
        //生成改变大小方块
        var r = (this.graph || params.graph).createShape(_jmRect2.jmRect, {
          position: {
            x: 0,
            y: 0
          },
          width: rs,
          height: rs,
          style: rectStyle,
          interactive: true
        });
        r.index = i;
        r.visible = true;
        this.resizeRects.push(r);
        this.children.add(r);
        r.canMove(true, this.graph);
      }
      this.reset(0, 0, 0, 0); //初始化位置
      //绑定其事件
      this.bindRectEvents();
    }

    /**
     * 绑定周边拉伸的小方块事件
     *
     * @method bindRectEvents
     * @private
     */
  }, {
    key: "bindRectEvents",
    value: function bindRectEvents() {
      for (var i = 0; i < this.resizeRects.length; i++) {
        var r = this.resizeRects[i];
        //小方块移动监听
        r.on('move', function (arg) {
          var px = 0,
            py = 0,
            dx = 0,
            dy = 0;
          if (this.index == 0) {
            dx = -arg.offsetX;
            px = arg.offsetX;
          } else if (this.index == 1) {
            dx = -arg.offsetX;
            px = arg.offsetX;
            dy = -arg.offsetY;
            py = arg.offsetY;
          } else if (this.index == 2) {
            dy = -arg.offsetY;
            py = arg.offsetY;
          } else if (this.index == 3) {
            dx = arg.offsetX;
            dy = -arg.offsetY;
            py = arg.offsetY;
          } else if (this.index == 4) {
            dx = arg.offsetX;
          } else if (this.index == 5) {
            dx = arg.offsetX;
            dy = arg.offsetY;
          } else if (this.index == 6) {
            dy = arg.offsetY;
          } else if (this.index == 7) {
            dx = -arg.offsetX;
            dx = -arg.offsetX;
            px = arg.offsetX;
            dy = arg.offsetY;
          }
          //重新定位
          this.parent.reset(px, py, dx, dy);
          this.needUpdate = true;
        });
        //鼠标指针
        r.bind('mousemove', function () {
          // 如果有旋转方位，则重新定义小块的作用
          var rotation = this.parent.getRotation();
          var cursor = this.parent.rectCursors[this.index];

          // 旋转一定角度后的位置
          var position = rotation && rotation.angle ? this.graph.utils.rotatePoints(this.graph.utils.clone(this.position), rotation, rotation.angle) : this.position;
          var center = {
            x: this.parent.width / 2,
            y: this.parent.height / 2
          };
          this.rotationAngleByCenter = Math.atan((position.y - center.y) / (position.x - center.x)); // 与中心连线和x轴的夹角
          // 把90度分割成三个区域，不同的指针
          var angleSplit1 = Math.atan(center.y / center.x) / 2;
          var angleSplit2 = angleSplit1 * 2 + Math.PI / 4;

          // 如果在左边，
          if (position.x < center.x) {
            if (this.rotationAngleByCenter >= -angleSplit1 && this.rotationAngleByCenter <= angleSplit1) {
              cursor = this.parent.rectCursors[0];
            } else if (this.rotationAngleByCenter > angleSplit1 && this.rotationAngleByCenter < angleSplit2) {
              cursor = this.parent.rectCursors[1];
            } else if (this.rotationAngleByCenter >= angleSplit2) {
              cursor = this.parent.rectCursors[2];
            } else if (this.rotationAngleByCenter <= -angleSplit1 && this.rotationAngleByCenter > -angleSplit2) {
              cursor = this.parent.rectCursors[7];
            } else if (this.rotationAngleByCenter <= -angleSplit2) {
              cursor = this.parent.rectCursors[6];
            }
          } else {
            if (this.rotationAngleByCenter >= -angleSplit1 && this.rotationAngleByCenter <= angleSplit1) {
              cursor = this.parent.rectCursors[4];
            } else if (this.rotationAngleByCenter > angleSplit1 && this.rotationAngleByCenter < angleSplit2) {
              cursor = this.parent.rectCursors[5];
            } else if (this.rotationAngleByCenter >= angleSplit2) {
              cursor = this.parent.rectCursors[6];
            } else if (this.rotationAngleByCenter <= -angleSplit1 && this.rotationAngleByCenter > -angleSplit2) {
              cursor = this.parent.rectCursors[3];
            } else if (this.rotationAngleByCenter <= -angleSplit2) {
              cursor = this.parent.rectCursors[2];
            }
          }
          this.cursor = cursor;
        });
        r.bind('mouseleave', function () {
          this.cursor = 'default';
        });
      }
      /*
      // 如果是双指开始滑动
      let touchPositions;
      this.on('touchstart', (evt) => {
      	if(evt.touches && evt.touches.legnth === 2) {
      		touchPositions = evt.touches;
      	}
      });
      		// 如果是双指滑动
      //计算二手指滑动距离，然后再通过在父容器中的占比得到缩放比例
      this.on('touchmove', (evt) => {
      	if(touchPositions && evt.touches && evt.touches.length == 2) {
      		//上次滑动二指的距离
      		const preOffX = touchPositions[0].x - touchPositions[1].x;
      		const preOffY = touchPositions[0].y - touchPositions[1].y;
      		const preDis = Math.sqrt(preOffX * preOffX + preOffY * preOffY);
      		//当次滑动二指的距离
      		const curOffX = evt.touches[0].x - evt.touches[1].x;
      		const curOffY = evt.touches[0].y - evt.touches[1].y;
      		const curDis = Math.sqrt(curOffX * curOffX + curOffY * curOffY);
      
      		//const disx = Math.abs(preOffX - curOffX);//x轴滑行的距离
      		//const disy = Math.abs(preOffY - curOffY);//y轴滑行的距离
      		
      		const offset = curDis - preDis;
      				this.reset(0, 0, offset, offset);
      	}
      });	
      // 结束滑动
      this.on('touchend touchcancel', (evt) => {
      	touchPositions = null;
      });*/
    }

    /**
     * 按移动偏移量重置当前对象，并触发大小和位置改变事件
     * @method reset
     * @param {number} px 位置X轴偏移
     * @param {number} py 位置y轴偏移
     * @param {number} dx 大小x轴偏移
     * @param {number} dy 大小y轴偏移
     */
  }, {
    key: "reset",
    value: function reset(px, py, dx, dy) {
      var minWidth = typeof this.style.minWidth == 'undefined' ? 5 : this.style.minWidth;
      var minHeight = typeof this.style.minHeight == 'undefined' ? 5 : this.style.minHeight;
      var location = this.getLocation();
      if (dx != 0 || dy != 0) {
        var w = location.width + dx;
        var h = location.height + dy;
        if (w >= minWidth || h >= minHeight) {
          if (w >= minWidth) {
            this.width = w;
          } else {
            px = 0;
            dx = 0;
          }
          if (h >= minHeight) {
            this.height = h;
          } else {
            py = 0;
            dy = 0;
          }
          //如果当前控件能移动才能改变其位置
          if (this.movable !== false && (px || py)) {
            var p = this.position;
            p.x = location.left + px;
            p.y = location.top + py;
            this.position = p;
          }
          //触发大小改变事件
          this.emit('resize', px, py, dx, dy);
        }
      }
      for (var i in this.resizeRects) {
        var r = this.resizeRects[i];
        switch (r.index) {
          case 0:
            {
              r.position.x = -r.width / 2;
              r.position.y = (location.height - r.height) / 2;
              break;
            }
          case 1:
            {
              r.position.x = -r.width / 2;
              r.position.y = -r.height / 2;
              break;
            }
          case 2:
            {
              r.position.x = (location.width - r.width) / 2;
              r.position.y = -r.height / 2;
              break;
            }
          case 3:
            {
              r.position.x = location.width - r.width / 2;
              r.position.y = -r.height / 2;
              break;
            }
          case 4:
            {
              r.position.x = location.width - r.width / 2;
              r.position.y = (location.height - r.height) / 2;
              break;
            }
          case 5:
            {
              r.position.x = location.width - r.width / 2;
              r.position.y = location.height - r.height / 2;
              break;
            }
          case 6:
            {
              r.position.x = (location.width - r.height) / 2;
              r.position.y = location.height - r.height / 2;
              break;
            }
          case 7:
            {
              r.position.x = -r.width / 2;
              r.position.y = location.height - r.height / 2;
              break;
            }
        }
      }
    }
  }]);
}(_jmRect2.jmRect);

},{"./jmRect.js":32}]},{},[1]);
var _r=_m(1);_g.jmGraph=_r;return _r;})})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:(typeof self!=='undefined'?self:this)));