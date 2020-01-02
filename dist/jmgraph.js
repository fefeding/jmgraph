(function(_g){(function(f){if(typeof exports==='object'&&typeof module!=='undefined'){module.exports=f()}else if(typeof define==='function'&&define.amd){define([],f.bind(_g))}else{f()}})(function(define,module,exports){var _m =(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmEvents = void 0;

var _jmUtils = require("./jmUtils.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 事件模型
 *
 * @class jmEvents
 * @for jmGraph
 */
var jmEvents =
/*#__PURE__*/
function () {
  function jmEvents(container, target) {
    _classCallCheck(this, jmEvents);

    this.container = container;
    this.target = target || container;
    this.mouseHandler = new jmMouseEvent(this, container, target);
    this.keyHandler = new jmKeyEvent(this, container, target);
  }

  _createClass(jmEvents, [{
    key: "touchStart",
    value: function touchStart(evt) {
      evt = evt || window.event;
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
      this.container.raiseEvent('touchcancel', evt);
      var t = evt.target || evt.srcElement;

      if (t == target) {
        //if(evt.preventDefault) evt.preventDefault();
        return false;
      }
    }
  }]);

  return jmEvents;
}();
/**
 * 鼠标事件处理对象，container 为事件主体，target为响应事件对象
 */


exports.jmEvents = jmEvents;

var jmMouseEvent =
/*#__PURE__*/
function () {
  function jmMouseEvent(instance, container, target) {
    _classCallCheck(this, jmMouseEvent);

    this.instance = instance;
    this.container = container;
    this.target = target || container;
    this.init(instance, container, target);
  }

  _createClass(jmMouseEvent, [{
    key: "init",
    value: function init(instance, container, target) {
      var canvas = this.target;
      var doc = typeof (typeof document === "undefined" ? "undefined" : _typeof(document)) != 'undefined' ? document : null; //禁用鼠标右健系统菜单
      //canvas.oncontextmenu = function() {
      //	return false;
      //};

      _jmUtils.jmUtils.bindEvent(this.target, 'mousedown', function (evt) {
        evt = evt || window.event;
        var r = container.raiseEvent('mousedown', evt); //if(r === false) {
        //if(evt.preventDefault) evt.preventDefault();
        //return false;
        //}				
      });

      doc && _jmUtils.jmUtils.bindEvent(doc, 'mousemove', function (evt) {
        evt = evt || window.event;
        var target = evt.target || evt.srcElement;

        if (target == canvas) {
          var r = container.raiseEvent('mousemove', evt); //if(r === false) {

          if (evt.preventDefault) evt.preventDefault();
          return false; //}		
        }
      });

      _jmUtils.jmUtils.bindEvent(this.target, 'mouseover', function (evt) {
        evt = evt || window.event;
        container.raiseEvent('mouseover', evt);
      });

      _jmUtils.jmUtils.bindEvent(this.target, 'mouseleave', function (evt) {
        evt = evt || window.event;
        container.raiseEvent('mouseleave', evt);
      });

      _jmUtils.jmUtils.bindEvent(this.target, 'mouseout', function (evt) {
        evt = evt || window.event;
        container.raiseEvent('mouseout', evt);
      });

      doc && _jmUtils.jmUtils.bindEvent(doc, 'mouseup', function (evt) {
        evt = evt || window.event; //let target = evt.target || evt.srcElement;
        //if(target == canvas) {						

        var r = container.raiseEvent('mouseup', evt);

        if (r === false) {
          if (evt.preventDefault) evt.preventDefault();
          return false;
        } //}

      });

      _jmUtils.jmUtils.bindEvent(this.target, 'dblclick', function (evt) {
        evt = evt || window.event;
        container.raiseEvent('dblclick', evt);
      });

      _jmUtils.jmUtils.bindEvent(this.target, 'click', function (evt) {
        evt = evt || window.event;
        container.raiseEvent('click', evt);
      });

      doc && _jmUtils.jmUtils.bindEvent(doc, 'resize', function (evt) {
        evt = evt || window.event;
        return container.raiseEvent('resize', evt);
      }); // passive: false 为了让浏览器不告警并且preventDefault有效
      // 另一种处理：touch-action: none; 这样任何触摸事件都不会产生默认行为，但是 touch 事件照样触发。

      doc && _jmUtils.jmUtils.bindEvent(doc, 'touchstart', function (evt) {
        return instance.touchStart(evt);
      }, {
        passive: false
      });
      doc && _jmUtils.jmUtils.bindEvent(doc, 'touchmove', function (evt) {
        return instance.touchMove(evt);
      }, {
        passive: false
      });
      doc && _jmUtils.jmUtils.bindEvent(doc, 'touchend', function (evt) {
        return instance.touchEnd(evt);
      }, {
        passive: false
      });
      doc && _jmUtils.jmUtils.bindEvent(doc, 'touchcancel', function (evt) {
        return instance.touchCancel(evt);
      }, {
        passive: false
      });
    }
  }]);

  return jmMouseEvent;
}();
/**
 * 健盘事件处理对象，container 为事件主体，target为响应事件对象
 */


var jmKeyEvent =
/*#__PURE__*/
function () {
  function jmKeyEvent(instance, container, target) {
    _classCallCheck(this, jmKeyEvent);

    this.instance = instance;
    this.container = container;
    this.target = target || container;
    this.init(container, target);
  }
  /**
   * 初始化健盘事件
   */


  _createClass(jmKeyEvent, [{
    key: "init",
    value: function init(container, target) {
      var doc = typeof (typeof document === "undefined" ? "undefined" : _typeof(document)) != 'undefined' ? document : null;
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

      doc && _jmUtils.jmUtils.bindEvent(doc, 'keypress', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应

        var r = container.raiseEvent('keypress', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      });
      doc && _jmUtils.jmUtils.bindEvent(doc, 'keydown', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应

        var r = container.raiseEvent('keydown', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      });
      doc && _jmUtils.jmUtils.bindEvent(doc, 'keyup', function (evt) {
        evt = evt || window.event;
        if (!checkKeyEvent(evt)) return; //如果事件为其它输入框，则不响应

        var r = container.raiseEvent('keyup', evt);
        if (r === false && evt.preventDefault) evt.preventDefault();
        return r;
      });
    }
  }]);

  return jmKeyEvent;
}();

},{"./jmUtils.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmList = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * 自定义集合
 * 
 * @class jmList
 * @for jmUtils
 * @param {array} [arr] 数组，可转为当前list元素
 */
var jmList =
/*#__PURE__*/
function (_Array) {
  _inherits(jmList, _Array);

  function jmList() {
    var _this;

    _classCallCheck(this, jmList);

    var ps = [];

    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    if (arg && arg.length && Array.isArray(arg[0])) {
      var _getPrototypeOf2;

      for (var i = 0; i < arg[0].length; i++) {
        ps.push(arg[0][i]);
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(jmList)).call.apply(_getPrototypeOf2, [this].concat(ps)));
    } else {
      _this = _possibleConstructorReturn(this, _getPrototypeOf(jmList).call(this));
    }

    _this.option = {}; //选项

    _this.type = 'jmList';
    return _possibleConstructorReturn(_this);
  }
  /**
   * 往集合中添加对象
   *
   * @method add
   * @for list
   * @param {any} obj 往集合中添加的对象
   */


  _createClass(jmList, [{
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
        var count = 0;
        var len = this.length;

        for (var i = 0; i < len; i++) {
          if (handler(this[i])) {
            count++;
          }
        }

        return count;
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

  return jmList;
}(_wrapNativeSuper(Array));

exports.jmList = jmList;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmObject = void 0;

var _jmList = require("./jmList.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *  所有jm对象的基础对象
 * 
 * @class jmObject
 * @for jmGraph
 */
var jmObject =
/*#__PURE__*/
function () {
  //id;
  function jmObject(g) {
    _classCallCheck(this, jmObject);

    if (g && g.type == 'jmGraph') {
      this.graph = g;
    } //this.id = Symbol("id"); //生成一个唯一id

  }
  /**
   * 检 查对象是否为指定类型
   * 
   * @method is
   * @param {class} type 判断的类型
   * @for jmObject
   * @return {boolean} true=表示当前对象为指定的类型type,false=表示不是
   */


  _createClass(jmObject, [{
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
            var self = this; //延时处理动画事件

            this.dispatcher = setTimeout(function (_this) {
              _this = _this || self; //var needredraw = false;

              var overduehandles = [];
              var curTimes = new Date().getTime();

              _this.animateHandles.each(function (i, ani) {
                try {
                  if (ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
                    var r = ani.handle.apply(_this, ani.params);

                    if (r === false) {
                      overduehandles.push(ani); //表示已完成的动画效果
                    }

                    ani.times = curTimes; //needredraw = true;								
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

  return jmObject;
}();

exports.jmObject = jmObject;

},{"./jmList.js":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmProperty = void 0;

var _jmObject2 = require("./jmObject.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var PROPERTY_KEY = Symbol("properties");
/**
 * 对象属性管理
 * 
 * @class jmProperty
 * @extends jmObject
 * @require jmObject
 */

var jmProperty =
/*#__PURE__*/
function (_jmObject) {
  _inherits(jmProperty, _jmObject);

  function jmProperty() {
    var _this;

    _classCallCheck(this, jmProperty);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmProperty).call(this));
    _this[PROPERTY_KEY] = {};
    return _this;
  }
  /**
   * 基础属性读写接口
   * @method __pro
   * @param {string} name 属性名
   * @param {any} value 属性的值
   * @returns {any} 属性的值
   */


  _createClass(jmProperty, [{
    key: "__pro",
    value: function __pro() {
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
        } else if (pars.length == 1) {
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
      return this.__pro('needUpdate');
    },
    set: function set(v) {
      this.__pro('needUpdate', v); //子控件属性改变，需要更新整个画板


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
      var g = this.__pro('graph');

      g = g || this.__pro('graph', this.findParent('jmGraph'));
      return g;
    },
    set: function set(v) {
      return this.__pro('graph', v);
    }
  }]);

  return jmProperty;
}(_jmObject2.jmObject);

exports.jmProperty = jmProperty;

},{"./jmObject.js":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmUtils = void 0;

var _jmList = require("./jmList.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 画图基础对象
 * 当前库的工具类
 * 
 * @class jmUtils
 * @static
 */
var jmUtils =
/*#__PURE__*/
function () {
  function jmUtils() {
    _classCallCheck(this, jmUtils);
  }

  _createClass(jmUtils, null, [{
    key: "clone",

    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @return {object} 参数source的拷贝对象
     */
    value: function clone(source) {
      var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (source && _typeof(source) === 'object') {
        //如果为当前泛型，则直接new
        if (this.isType(source, _jmList.jmList)) {
          return new _jmList.jmList(source);
        } else if (Array.isArray(source)) {
          //如果是深度复，则拷贝每个对象
          if (deep) {
            var dest = [];

            for (var i = 0; i < source.length; i++) {
              dest.push(this.clone(source[i], deep));
            }

            return dest;
          }

          return source.slice(0);
        }

        var target = {};
        target.constructor = source.constructor;

        for (var k in source) {
          target[k] = this.clone(source[k], deep);
        }

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
     */

  }, {
    key: "bindEvent",
    value: function bindEvent(target, name, fun, opt) {
      if (name && name.indexOf && name.indexOf(' ') != -1) {
        var ns = name.split(' ');

        for (var i = 0; i < ns.length; i++) {
          this.bindEvent(target, ns[i], fun, opt);
        }

        return;
      }

      if (target.attachEvent) {
        return target.attachEvent("on" + name, fun, opt);
      } else if (target.addEventListener) {
        target.addEventListener(name, fun, opt);
        return true;
      } else {
        return false;
      }
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

      if (touches) {
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
        var p = this.getElementPosition(target);
        ox = px - p.left;
        oy = py - p.top;
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
        isTouch: isTouch
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
      } //一条直线
      else if (n == 2) {
          //在最左边之外或在最右边之外
          if (Math.min(polygon[0].x, polygon[1].x) - pt.x > offset || pt.x - Math.max(polygon[0].x, polygon[1].x) > offset) {
            return 0;
          } //在最顶部之外或在最底部之外


          if (Math.min(polygon[0].y, polygon[1].y) - pt.y > offset || pt.y - Math.max(polygon[0].y, polygon[1].y) > offset) {
            return 0;
          } //如果线为平行为纵坐标。


          if (polygon[0].x == polygon[1].x) {
            return Math.abs(polygon[0].x - pt.x) <= offset && (pt.y - polygon[0].y) * (pt.y - polygon[1].y) <= 0 ? 1 : 0;
          } //如果线为平行为横坐标。


          if (polygon[0].y == polygon[1].y) {
            return Math.abs(polygon[0].y - pt.y) <= offset && (pt.x - polygon[0].x) * (pt.x - polygon[1].x) <= 0 ? 1 : 0;
          }

          if (Math.abs(polygon[0].x - pt.x) < offset && Math.abs(polygon[0].y - pt.y) < offset) {
            return 1;
          }

          if (Math.abs(polygon[1].x - pt.x) < offset && Math.abs(polygon[1].y - pt.y) < offset) {
            return 1;
          } //点到直线的距离小于宽度的一半，表示在线上


          if (pt.y != polygon[0].y && pt.y != polygon[1].y) {
            var f = (polygon[1].x - polygon[0].x) / (polygon[1].y - polygon[0].y) * (pt.y - polygon[0].y);
            var ff = (pt.y - polygon[0].y) / Math.sqrt(f * f + (pt.y - polygon[0].y) * (pt.y - polygon[0].y));
            var l = ff * (pt.x - polygon[0].x - f);
            return Math.abs(l) <= offset ? 1 : 0;
          }

          return 0;
        }

      for (i = 0; i < n; ++i) {
        if (polygon[i].x == pt.x && // 是否在顶点上
        polygon[i].y == pt.y) {
          return 1;
        }
      } //pt = this.clone(pt);


      while (redo) {
        redo = false;
        inside = false;

        for (i = 0, j = n - 1; i < n; j = i++) {
          if (polygon[i].y < pt.y && pt.y < polygon[j].y || polygon[j].y < pt.y && pt.y < polygon[i].y) {
            if (pt.x <= polygon[i].x || pt.x <= polygon[j].x) {
              var _x = (pt.y - polygon[i].y) * (polygon[j].x - polygon[i].x) / (polygon[j].y - polygon[i].y) + polygon[i].x;

              if (pt.x < _x) // 在线的左侧
                inside = !inside;else if (pt.x == _x) // 在线上
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
          } else if (polygon[i].y == polygon[j].y && // 在水平的边界线上
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
     * @param {array} coordinates {{x,y}[]} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
     *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
     * @param  {number} 是否为实心 1= 是
     * @returns {boolean} 结果 true=在形状内
     */

  }, {
    key: "judge",
    value: function judge(dot, coordinates, noneZeroMode) {
      // 默认启动none zero mode
      noneZeroMode = noneZeroMode || 1;
      var x = dot.x,
          y = dot.y;
      var crossNum = 0; // 点在线段的左侧数目

      var leftCount = 0; // 点在线段的右侧数目

      var rightCount = 0;

      for (var i = 0; i < coordinates.length - 1; i++) {
        var start = coordinates[i];
        var end = coordinates[i + 1]; // 起点、终点斜率不存在的情况

        if (start.x === end.x) {
          // 因为射线向右水平，此处说明不相交
          if (x > start.x) continue; // 从左侧贯穿

          if (end.y > start.y && y >= start.y && y <= end.y) {
            leftCount++;
            crossNum++;
          } // 从右侧贯穿


          if (end.y < start.y && y >= end.y && y <= start.y) {
            rightCount++;
            crossNum++;
          }

          continue;
        } // 斜率存在的情况，计算斜率


        var k = (end.y - start.y) / (end.x - start.x); // 交点的x坐标

        var x0 = (y - start.y) / k + start.x; // 因为射线向右水平，此处说明不相交

        if (x > x0) continue;

        if (end.x > start.x && x0 >= start.x && x0 <= end.x) {
          crossNum++;
          if (k >= 0) leftCount++;else rightCount++;
        }

        if (end.x < start.x && x0 >= end.x && x0 <= start.x) {
          crossNum++;
          if (k >= 0) rightCount++;else leftCount++;
        }
      }

      return noneZeroMode === 1 ? leftCount - rightCount !== 0 : crossNum % 2 === 1;
    }
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

      if (p.length) {
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
      if (typeof r == 'string' && r) {
        r = this.trim(r); //当为7位时，表示需要转为带透明度的rgba

        if (r[0] == '#') {
          if (r.length >= 8) {
            a = r.substr(1, 2);
            g = r.substr(5, 2);
            b = r.substr(7, 2);
            r = r.substr(3, 2); //透明度

            a = (this.hexToNumber(a) / 255).toFixed(4);
            r = this.hexToNumber(r || 0);
            g = this.hexToNumber(g || 0);
            b = this.hexToNumber(b || 0);
          } //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
          else if (r.length === 5) {
              a = r.substr(1, 1);
              g = r.substr(3, 1); //除#号外的第二位

              b = r.substr(4, 1);
              r = r.substr(2, 1);
              r = this.hexToNumber(r || 0);
              g = this.hexToNumber(g || 0);
              b = this.hexToNumber(b || 0); //透明度

              a = (this.hexToNumber(a) / 255).toFixed(4);
            }
        }
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
  }]);

  return jmUtils;
}();

exports.jmUtils = jmUtils;

},{"./jmList.js":2}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArrawLine = void 0;

var _jmLine2 = require("../shapes/jmLine.js");

var _jmArraw = require("../shapes/jmArraw.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 带箭头的直线,继承jmPath
 *
 * @class jmArrawLine
 * @extends jmLine
 * @param {object} params 生成当前直线的参数对象，(style=当前线条样式,start=直线起始点,end=直线终结点)
 */
var jmArrawLine =
/*#__PURE__*/
function (_jmLine) {
  _inherits(jmArrawLine, _jmLine);

  function jmArrawLine(params, t) {
    var _this;

    _classCallCheck(this, jmArrawLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmArrawLine).call(this, params, t || 'jmArrawLine'));
    _this.style.lineJoin = _this.style.lineJoin || 'miter';
    _this.arraw = new _jmArraw.jmArraw(params);
    return _this;
  }
  /**
   * 初始化直线和箭头描点
   *
   * @method initPoints
   * @private
   */


  _createClass(jmArrawLine, [{
    key: "initPoints",
    value: function initPoints() {
      this.points = _get(_getPrototypeOf(jmArrawLine.prototype), "initPoints", this).call(this);

      if (this.arrawVisible !== false) {
        this.points = this.points.concat(this.arraw.initPoints());
      }

      return this.points;
    }
  }]);

  return jmArrawLine;
}(_jmLine2.jmLine);

exports.jmArrawLine = jmArrawLine;

},{"../shapes/jmArraw.js":14,"../shapes/jmLine.js":19}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmImage = void 0;

var _jmControl2 = require("../shapes/jmControl.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 图片控件，继承自jmControl
 * params参数中image为指定的图片源地址或图片img对象，
 * postion=当前控件的位置，width=其宽度，height=高度，sourcePosition=从当前图片中展示的位置，sourceWidth=从图片中截取的宽度,sourceHeight=从图片中截取的高度。
 * 
 * @class jmImage
 * @extends jmControl
 * @param {object} params 控件参数
 */
var jmImage =
/*#__PURE__*/
function (_jmControl) {
  _inherits(jmImage, _jmControl);

  function jmImage(params, t) {
    var _this;

    _classCallCheck(this, jmImage);

    params = params || {};
    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmImage).call(this, params, t || 'jmImage'));
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


  _createClass(jmImage, [{
    key: "draw",

    /**
     * 重写控件绘制
     * 根据父边界偏移和此控件参数绘制图片
     *
     * @method draw
     */
    value: function draw() {
      try {
        var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
        if (!bounds) bounds = this.parent && this.parent.getAbsoluteBounds ? this.parent.getAbsoluteBounds() : this.getAbsoluteBounds();
        var p = this.getLocation();
        p.left += bounds.left;
        p.top += bounds.top;
        var sp = this.sourcePosition;
        var sw = this.sourceWidth;
        var sh = this.sourceHeight;
        var img = this.getImage();

        if (sp || typeof sw != 'undefined' || typeof sh != 'undefined') {
          if (typeof sw == 'undefined') sw = p.width || img.width || 0;
          if (typeof sh == 'undefined') sh = p.height || img.height || 0;
          sp = sp || {
            x: 0,
            y: 0
          };
          if (p.width && p.height) this.context.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, p.width, p.height);else if (p.width) {
            this.context.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, p.width, sh);
          } else if (p.height) {
            this.context.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, sw, p.height);
          } else this.context.drawImage(img, sp.x, sp.y, sw, sh, p.left, p.top, sw, sh);
        } else if (p) {
          if (p.width && p.height) this.context.drawImage(img, p.left, p.top, p.width, p.height);else if (p.width) this.context.drawImage(img, p.left, p.top, p.width, img.height);else if (p.height) this.context.drawImage(img, p.left, p.top, img.width, p.height);else this.context.drawImage(img, p.left, p.top);
        } else {
          this.context.drawImage(img);
        }
      } catch (e) {
        console.error && console.error(e);
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
    value: function getBounds() {
      var rect = {};
      var img = this.getImage();
      var p = this.getLocation();
      var w = p.width || img.width;
      var h = p.height || img.height;
      rect.left = p.left;
      rect.top = p.top;
      rect.right = p.left + w;
      rect.bottom = p.top + h;
      rect.width = w;
      rect.height = h;
      return rect;
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
      var src = this.image || this.style.src || this.style.image;

      if (this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
        return this.__img;
      } else if (src && src.src) {
        this.__img = src;
      } else if (document && document.createElement) {
        this.__img = document.createElement('img');
        if (src && typeof src == 'string') this.__img.src = src;
      } else {
        this.__img = src;
      }

      return this.__img;
    }
  }, {
    key: "sourcePosition",
    get: function get() {
      return this.__pro('sourcePosition');
    },
    set: function set(v) {
      return this.__pro('sourcePosition', v);
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
      return this.__pro('sourceWidth');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('sourceWidth', v);
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
      return this.__pro('sourceHeight');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('sourceHeight', v);
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
      return this.__pro('image');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('image', v);
    }
  }]);

  return jmImage;
}(_jmControl2.jmControl);

exports.jmImage = jmImage;

},{"../shapes/jmControl.js":17}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmLabel = void 0;

var _jmControl2 = require("../shapes/jmControl.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 显示文字控件
 *
 * @class jmLabel
 * @extends jmControl
 * @param {object} params params参数:style=样式，value=显示的文字
 */
var jmLabel =
/*#__PURE__*/
function (_jmControl) {
  _inherits(jmLabel, _jmControl);

  function jmLabel(params, t) {
    var _this;

    _classCallCheck(this, jmLabel);

    params = params || {};
    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmLabel).call(this, params, t || 'jmLabel'));
    _this.style.font = _this.style.font || "15px Arial";
    _this.style.fontFamily = _this.style.fontFamily || 'Arial';
    _this.style.fontSize = _this.style.fontSize || 15; // 显示不同的 textAlign 值
    //文字水平对齐

    _this.style.textAlign = _this.style.textAlign || 'left'; //文字垂直对齐

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


  _createClass(jmLabel, [{
    key: "getLocation",

    /**
     * 在基础的getLocation上，再加上一个特殊的center处理
     * 
     * @method getLocation
     * @returns {Object}
     */
    value: function getLocation() {
      var location = _get(_getPrototypeOf(jmLabel.prototype), "getLocation", this).call(this);

      var size = this.testSize();
      location.width = location.width || size.width;
      location.height = location.height || size.height; //如果没有指定位置，但指定了中心，则用中心来计算坐标

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
      this.style.font = this.style.fontSize + 'px ' + this.style.fontFamily;
      this.context.save();
      this.setStyle(); //计算宽度

      this.__size = this.context.measureText ? this.context.measureText(this.text) : {
        width: 15
      };
      this.context.restore();
      this.__size.height = this.style.fontSize ? this.style.fontSize : 15;
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
      var y = location.top + bounds.top; //通过文字对齐方式计算起始X位置

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
      } //通过垂直对齐方式计算起始Y值


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

      if (txt) {
        if (this.style.fill && this.context.fillText) {
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
      } //如果有指定边框，则画出边框


      if (this.style.border) {
        //如果指定了边框样式
        if (this.style.border.style) {
          this.context.save();
          this.setStyle(this.style.border.style);
        }

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
        } //如果指定了边框颜色


        if (this.style.border.style) {
          this.context.restore();
        }
      }
    }
  }, {
    key: "text",
    get: function get() {
      return this.__pro('text');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('text', v);
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
      return this.__pro('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('center', v);
    }
    /**
     * 当前位置左上角
     * @property position
     * @type {point}
     */

  }, {
    key: "position",
    get: function get() {
      return this.__pro('position');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('position', v);
    }
  }]);

  return jmLabel;
}(_jmControl2.jmControl);

exports.jmLabel = jmLabel;

},{"../shapes/jmControl.js":17}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmResize = void 0;

var _jmRect2 = require("../shapes/jmRect.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 可拉伸的缩放控件
 * 继承jmRect
 * 如果此控件加入到了当前控制的对象的子控件中，请在参数中加入movable:false，否则导致当前控件会偏离被控制的控件。
 *
 * @class jmResize
 * @extends jmRect
 */
var jmResize =
/*#__PURE__*/
function (_jmRect) {
  _inherits(jmResize, _jmRect);

  function jmResize(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmResize';

    _classCallCheck(this, jmResize);

    params = params || {};
    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmResize).call(this, params, t)); //是否可拉伸

    _this.resizable = params.resizable === false ? false : true;
    _this.movable = params.movable;
    _this.rectSize = params.rectSize || 8;
    _this.style.close = _this.style.close || true;

    _this.init(params);

    return _this;
  }
  /**
   * 拉动的小方块大小
   * @property rectSize
   * @type {number}
   */


  _createClass(jmResize, [{
    key: "init",

    /**
     * 初始化控件的8个拉伸方框
     *
     * @method init
     * @private
     */
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
        var r = (this.graph || params.graph).createShape('rect', {
          position: {
            x: 0,
            y: 0
          },
          width: rs,
          height: rs,
          style: rectStyle
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
        var r = this.resizeRects[i]; //小方块移动监听

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
          } //重新定位


          this.parent.reset(px, py, dx, dy);
          this.needUpdate = true;
        }); //鼠标指针

        r.bind('mousemove', function () {
          var rectCursors = ['w-resize', 'nw-resize', 'n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize'];
          this.cursor = rectCursors[this.index];
        });
        r.bind('mouseleave', function () {
          this.cursor = 'default';
        });
      }
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
          } //如果当前控件能移动才能改变其位置


          if (this.movable !== false && (px || py)) {
            var p = this.position;
            p.x = location.left + px;
            p.y = location.top + py;
            this.position = p;
          } //触发大小改变事件


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
  }, {
    key: "rectSize",
    get: function get() {
      return this.__pro('rectSize');
    },
    set: function set(v) {
      return this.__pro('rectSize', v);
    }
    /**
     * 是否可以拉大缩小
     * @property resizable
     * @type {boolean}
     */

  }, {
    key: "resizable",
    get: function get() {
      return this.__pro('resizable');
    },
    set: function set(v) {
      return this.__pro('resizable', v);
    }
  }]);

  return jmResize;
}(_jmRect2.jmRect);

exports.jmResize = jmResize;

},{"../shapes/jmRect.js":22}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "jmUtils", {
  enumerable: true,
  get: function get() {
    return _jmUtils.jmUtils;
  }
});
Object.defineProperty(exports, "jmList", {
  enumerable: true,
  get: function get() {
    return _jmList.jmList;
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
Object.defineProperty(exports, "jmGradient", {
  enumerable: true,
  get: function get() {
    return _jmGradient.jmGradient;
  }
});
Object.defineProperty(exports, "jmEvents", {
  enumerable: true,
  get: function get() {
    return _jmEvents.jmEvents;
  }
});
Object.defineProperty(exports, "jmControl", {
  enumerable: true,
  get: function get() {
    return _jmControl2.jmControl;
  }
});
Object.defineProperty(exports, "jmPath", {
  enumerable: true,
  get: function get() {
    return _jmPath.jmPath;
  }
});
Object.defineProperty(exports, "jmArc", {
  enumerable: true,
  get: function get() {
    return _jmArc.jmArc;
  }
});
Object.defineProperty(exports, "jmArraw", {
  enumerable: true,
  get: function get() {
    return _jmArraw.jmArraw;
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
Object.defineProperty(exports, "jmHArc", {
  enumerable: true,
  get: function get() {
    return _jmHArc.jmHArc;
  }
});
Object.defineProperty(exports, "jmLine", {
  enumerable: true,
  get: function get() {
    return _jmLine.jmLine;
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
Object.defineProperty(exports, "jmArrawLine", {
  enumerable: true,
  get: function get() {
    return _jmArrawLine.jmArrawLine;
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
Object.defineProperty(exports, "jmResize", {
  enumerable: true,
  get: function get() {
    return _jmResize.jmResize;
  }
});
exports.default = exports.create = exports.jmGraph = void 0;

var _jmUtils = require("./common/jmUtils.js");

var _jmList = require("./common/jmList.js");

var _jmProperty = require("./common/jmProperty.js");

var _jmShadow = require("./models/jmShadow.js");

var _jmGradient = require("./models/jmGradient.js");

var _jmEvents = require("./common/jmEvents.js");

var _jmControl2 = require("./shapes/jmControl.js");

var _jmPath = require("./shapes/jmPath.js");

var _jmArc = require("./shapes/jmArc.js");

var _jmArraw = require("./shapes/jmArraw.js");

var _jmBezier = require("./shapes/jmBezier.js");

var _jmCircle = require("./shapes/jmCircle.js");

var _jmHArc = require("./shapes/jmHArc.js");

var _jmLine = require("./shapes/jmLine.js");

var _jmPrismatic = require("./shapes/jmPrismatic.js");

var _jmRect = require("./shapes/jmRect.js");

var _jmArrawLine = require("./controls/jmArrawLine.js");

var _jmImage = require("./controls/jmImage.js");

var _jmLabel = require("./controls/jmLabel.js");

var _jmResize = require("./controls/jmResize.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
var jmGraph =
/*#__PURE__*/
function (_jmControl) {
  _inherits(jmGraph, _jmControl);

  function jmGraph(canvas, option, callback) {
    var _this;

    _classCallCheck(this, jmGraph);

    if (typeof option == 'function') {
      callback = option;
      option = {};
    }

    option = option || {}; //不是用new实例化的话，返回一个promise

    if ((this instanceof jmGraph ? this.constructor : void 0) !== jmGraph) {
      return _possibleConstructorReturn(_this, new Promise(function (resolve, reject) {
        var g = new jmGraph(canvas, option, callback);
        if (resolve) resolve(g);
      }));
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmGraph).call(this, option, 'jmGraph'));
    _this.option = option || {};
    /**
     * 工具类
     * @property utils/util
     * @type {jmUtils}
     */

    _this.util = _this.utils = _jmUtils.jmUtils; //如果是小程序

    if (typeof wx != 'undefined' && wx.createCanvasContext) {
      _this.context = wx.createCanvasContext(canvas);
      canvas = wx.createSelectorQuery().select('#' + canvas);
    } else {
      if (typeof canvas === 'string' && typeof document != 'undefined') {
        canvas = document.getElementById(canvas);
      } else if (canvas.length) {
        canvas = canvas[0];
      }

      if (canvas.tagName != 'CANVAS') {
        var cn = document.createElement('canvas');
        canvas.appendChild(cn);
        cn.width = canvas.offsetWidth || canvas.clientWidth;
        cn.height = canvas.offsetHeight || canvas.clientHeight;
        canvas = cn;
      }

      _this.context = canvas.getContext('2d');
    }

    _this.canvas = canvas;

    _this.init(callback);

    return _this;
  }
  /**
   * 初始化画布
   * @method init
   */


  _createClass(jmGraph, [{
    key: "init",
    value: function init(callback) {
      /**
       * 当前所有图形类型
       * @property shapes
       * @type {object}
       */
      this.shapes = {
        "path": _jmPath.jmPath,
        "arc": _jmArc.jmArc,
        "arraw": _jmArraw.jmArraw,
        "bezier": _jmBezier.jmBezier,
        "circle": _jmCircle.jmCircle,
        "harc": _jmHArc.jmHArc,
        "line": _jmLine.jmLine,
        "prismatic": _jmPrismatic.jmPrismatic,
        "rect": _jmRect.jmRect,
        "arrawline": _jmArrawLine.jmArrawLine,
        "image": _jmImage.jmImage,
        "img": _jmImage.jmImage,
        "label": _jmLabel.jmLabel,
        "resize": _jmResize.jmResize
      };
      /**
       * 画控件前初始化
       * 为了解决一像素线条问题
       */

      this.on('beginDraw', function () {
        this.context.translate(0.5, 0.5);
      });
      /**
       * 结束控件绘制 为了解决一像素线条问题
       */

      this.on('endDraw', function () {
        this.context.translate(-0.5, -0.5);
      });
      if (this.option.width > 0) this.width = this.option.width;
      if (this.option.height > 0) this.height = this.option.height; //绑定事件

      this.eventHandler = new _jmEvents.jmEvents(this, this.canvas.canvas || this.canvas);
      if (callback) callback(this);
    }
    /**
     * 宽度
     * @property width
     * @type {number}
     */

  }, {
    key: "getPosition",

    /**
     * 获取当前画布在浏览器中的绝对定位
     *
     * @method getPosition
     * @return {postion} 返回定位坐标
     */
    value: function getPosition() {
      var p = _jmUtils.jmUtils.getElementPosition(this.canvas.canvas || this.canvas);

      p.width = this.canvas.width;
      p.height = this.canvas.height;
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
     * @param {string} name 注册控件的名称
     * @param {object} args 实例化控件的参数
     * @return {object} 已实例化控件的对象
     */

  }, {
    key: "createShape",
    value: function createShape(name, args) {
      var shape = this.shapes[name];

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
      var gradient = new _jmGradient.jmGradient({
        type: 'linear',
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2
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
      var gradient = new _jmGradient.jmGradient({
        type: 'radial',
        x1: x1,
        y1: y1,
        r1: r1,
        x2: x2,
        y2: y2,
        r2: r2
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
      //this.canvas.width = this.canvas.width;
      if (w && h) {
        //this.zoomActual();//恢复比例缩放
        this.canvas.width = w;
        this.canvas.height = h; //保留原有缩放比例

        if (this.scaleSize) {
          if (this.context.scale) this.context.scale(this.scaleSize.x, this.scaleSize.y);
        }
      } else {
        w = this.canvas.width;
        h = this.canvas.height;

        if (this.scaleSize) {
          w = w / this.scaleSize.x;
          h = h / this.scaleSize.y;
        }
      } //如果有指定背景，则等到draw再全屏绘制一次，也同样达到清除画布的功能


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
      } else if (this.context.clearRect) this.context.clearRect(0, 0, w, h);
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
      if (this.canvas) {
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
      var path = this.createShape('path', {
        points: points,
        style: style
      });
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

      this.context.scale(dx, dy);

      if (!this.scaleSize) {
        this.scaleSize = {
          x: dx,
          y: dy
        };
      } else {
        this.scaleSize = {
          x: dx * this.scaleSize.x,
          y: dy * this.scaleSize.y
        };
      }

      this.refresh();
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
      var self = this;

      function update() {
        if (self.needUpdate) self.redraw();
        requestAnimationFrame(update);
        if (callback) callback();
      }

      update();
      return this;
    }
  }, {
    key: "width",
    get: function get() {
      if (this.canvas) return this.canvas.width;
      return 0;
    },
    set: function set(v) {
      this.needUpdate = true;
      if (this.canvas) this.canvas.width = v;
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
      if (this.canvas) return this.canvas.height;
      return 0;
    },
    set: function set(v) {
      this.needUpdate = true;
      if (this.canvas) this.canvas.height = v;
      return v;
    }
    /**
     * 创建jmGraph的静态对象
     *
     * @method create
     * @return {jmGraph} jmGraph实例对象
     */

  }], [{
    key: "create",
    value: function create() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _construct(jmGraph, args);
    }
  }]);

  return jmGraph;
}(_jmControl2.jmControl); //创建实例


exports.jmGraph = jmGraph;

var createJmGraph = function createJmGraph() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _construct(jmGraph, args);
};

exports.create = createJmGraph;
var _default = jmGraph;
exports.default = _default;

},{"./common/jmEvents.js":1,"./common/jmList.js":2,"./common/jmProperty.js":4,"./common/jmUtils.js":5,"./controls/jmArrawLine.js":6,"./controls/jmImage.js":7,"./controls/jmLabel.js":8,"./controls/jmResize.js":9,"./models/jmGradient.js":11,"./models/jmShadow.js":12,"./shapes/jmArc.js":13,"./shapes/jmArraw.js":14,"./shapes/jmBezier.js":15,"./shapes/jmCircle.js":16,"./shapes/jmControl.js":17,"./shapes/jmHArc.js":18,"./shapes/jmLine.js":19,"./shapes/jmPath.js":20,"./shapes/jmPrismatic.js":21,"./shapes/jmRect.js":22}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmGradient = void 0;

var _jmUtils = require("../common/jmUtils.js");

var _jmList = require("../common/jmList.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 渐变类
 *
 * @class jmGradient
 * @param {object} op 渐变参数,type:[linear= 线性渐变,radial=放射性渐变] 
 */
var jmGradient =
/*#__PURE__*/
function () {
  function jmGradient(opt) {
    _classCallCheck(this, jmGradient);

    this.stops = new _jmList.jmList();

    if (opt && _typeof(opt) == 'object') {
      for (var k in opt) {
        this[k] = opt[k];
      }
    } //解析字符串格式
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


  _createClass(jmGradient, [{
    key: "addStop",
    value: function addStop(offset, color) {
      this.stops.add({
        offset: offset,
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
      } //let offsetLine = 1;//渐变长度或半径
      //处理百分比参数


      if (_jmUtils.jmUtils.checkPercent(x1)) {
        x1 = _jmUtils.jmUtils.percentToNumber(x1) * (location.width || d);
      }

      if (_jmUtils.jmUtils.checkPercent(x2)) {
        x2 = _jmUtils.jmUtils.percentToNumber(x2) * (location.width || d);
      }

      if (_jmUtils.jmUtils.checkPercent(y1)) {
        y1 = _jmUtils.jmUtils.percentToNumber(y1) * (location.height || d);
      }

      if (_jmUtils.jmUtils.checkPercent(y2)) {
        y2 = _jmUtils.jmUtils.percentToNumber(y2) * (location.height || d);
      }

      var sx1 = Number(x1) + bounds.left;
      var sy1 = Number(y1) + bounds.top;
      var sx2 = Number(x2) + bounds.left;
      var sy2 = Number(y2) + bounds.top;

      if (this.type === 'linear') {
        gradient = context.createLinearGradient(sx1, sy1, sx2, sy2); //let x = Math.abs(x2-x1);
        //let y = Math.abs(y2-y1);
        //offsetLine = Math.sqrt(x*x + y*y);
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
        } //offsetLine = Math.abs(r2 - r1);//二圆半径差
        //小程序的接口特殊


        if (context.createCircularGradient) {
          gradient = context.createCircularGradient(sx1, sy1, r2);
        } else {
          gradient = context.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2);
        }
      } //颜色渐变


      this.stops.each(function (i, s) {
        var c = _jmUtils.jmUtils.toColor(s.color); //s.offset 0.0 ~ 1.0


        gradient.addColorStop(s.offset, c);
      });
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
      var ms = s.match(/(linear|radial)-gradient\s*\(\s*([^,]+[^\)]+)\)/i);
      if (!ms || ms.length < 3) return;
      this.type = ms[1].toLowerCase();
      var pars = ms[2].split(',');

      if (pars.length) {
        var ps = _jmUtils.jmUtils.trim(pars[0]).split(/\s+/); //线性渐变


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
        } //径向渐变
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
          } //解析颜色偏移
        //color step


        if (pars.length > 1) {
          for (var i = 1; i < pars.length; i++) {
            var cs = _jmUtils.jmUtils.trim(pars[i]).split(/\s+/);

            if (cs.length) {
              this.addStop(cs[1] || 0, cs[0]);
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
      } //颜色渐变


      this.stops.each(function (i, s) {
        str += ',' + s.color + ' ' + s.offset;
      });
      return str + ')';
    }
  }]);

  return jmGradient;
}();

exports.jmGradient = jmGradient;

},{"../common/jmList.js":2,"../common/jmUtils.js":5}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmShadow = void 0;

var _jmUtils = require("../common/jmUtils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 画图阴影对象表示法
 *
 * @class jmShadow
 * @param {number} x 横坐标偏移量
 * @param {number} y 纵坐标编移量
 * @param {number} blur 模糊值
 * @param {string} color 阴影的颜色
 */
var jmShadow =
/*#__PURE__*/
function () {
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


  _createClass(jmShadow, [{
    key: "fromString",
    value: function fromString(s) {
      if (!s) return;
      var ms = s.match(/\s*([^,]+)\s*,\s*([^,]+)\s*(,[^,]+)?\s*(,[\s\S]+)?\s*/i);

      if (ms) {
        this.x = ms[1] || 0;
        this.y = ms[2] || 0;

        if (ms[3]) {
          ms[3] = _jmUtils.jmUtils.trim(ms[3], ', '); //如果第三位是颜色格式，则表示为颜色

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

  return jmShadow;
}();

exports.jmShadow = jmShadow;

},{"../common/jmUtils.js":5}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArc = void 0;

var _jmPath2 = require("./jmPath.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 圆弧图型 继承自jmPath
 *
 * @class jmArc
 * @extends jmPath
 * @param {object} params center=当前圆弧中心,radius=圆弧半径,start=圆弧起始角度,end=圆弧结束角度,anticlockwise=  false  顺时针，true 逆时针
 */
var jmArc =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmArc, _jmPath);

  function jmArc(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmArc';

    _classCallCheck(this, jmArc);

    if (!params) params = {};
    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmArc).call(this, params, t));
    _this.center = params.center || {
      x: 0,
      y: 0
    };
    _this.radius = params.radius || 0;
    _this.startAngle = params.start || params.startAngle || 0;
    _this.endAngle = params.end || params.endAngle || Math.PI * 2;
    _this.anticlockwise = params.anticlockwise || 0;
    return _this;
  }
  /**
   * 中心点
   * point格式：{x:0,y:0,m:true}
   * @property center
   * @type {point}
   */


  _createClass(jmArc, [{
    key: "initPoints",

    /**
     * 初始化图形点
     * 
     * @method initPoint
     * @private
     * @for jmArc
     */
    value: function initPoints() {
      var location = this.getLocation(); //获取位置参数

      var mw = 0;
      var mh = 0;
      var cx = location.center.x;
      var cy = location.center.y; //如果设定了半径。则以半径为主	

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
      var step = 1 / Math.max(mw, mh); //如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end

      if (anticlockwise) {
        var p2 = Math.PI * 2;
        start = p2 - start;
        end = p2 - end;
      }

      if (start > end) step = -step; //椭圆方程x=a*cos(r) ,y=b*sin(r)	

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
  }, {
    key: "center",
    get: function get() {
      return this.__pro('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('center', v);
    }
    /**
     * 半径
     * @property radius
     * @type {number}
     */

  }, {
    key: "radius",
    get: function get() {
      return this.__pro('radius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('radius', v);
    }
    /**
     * 扇形起始角度
     * @property startAngle
     * @type {number}
     */

  }, {
    key: "startAngle",
    get: function get() {
      return this.__pro('startAngle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('startAngle', v);
    }
    /**
     * 扇形结束角度
     * @property endAngle
     * @type {number}
     */

  }, {
    key: "endAngle",
    get: function get() {
      return this.__pro('endAngle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('endAngle', v);
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
      return this.__pro('anticlockwise');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('anticlockwise', v);
    }
  }]);

  return jmArc;
}(_jmPath2.jmPath);

exports.jmArc = jmArc;

},{"./jmPath.js":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmArraw = void 0;

var _jmPath2 = require("./jmPath.js");

var _jmUtils = require("../common/jmUtils.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画箭头,继承自jmPath
 *
 * @class jmArraw
 * @extends jmPath
 * @param {object} 生成箭头所需的参数
 */
var jmArraw =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmArraw, _jmPath);

  function jmArraw(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmArraw';

    _classCallCheck(this, jmArraw);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmArraw).call(this, params, t));
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
   * @for jmArraw
   * @type {point}
   */


  _createClass(jmArraw, [{
    key: "initPoints",

    /**
     * 初始化图形点
     * 
     * @method initPoint
     * @private
     * @param {boolean} solid 是否为实心的箭头
     * @for jmArraw
     */
    value: function initPoints(solid) {
      var rotate = this.angle;
      var start = this.start;
      var end = this.end;
      if (!end) return; //计算箭头指向角度

      if (!rotate) {
        rotate = Math.atan2(end.y - start.y, end.x - start.x);
      }

      this.points = [];
      var offx = this.offsetX;
      var offy = this.offsetY; //箭头相对于线的偏移角度

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
      this.points.push(p1); //如果实心箭头则封闭路线

      if (solid || this.style.fill) {
        this.points.push(p2);
        this.points.push(end);
      } else {
        this.points.push(s);
        this.points.push(p2);
      }

      return this.points;
    }
  }, {
    key: "start",
    get: function get() {
      return this.__pro('start');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('start', v);
    }
    /**
     * 控制结束点
     *
     * @property end
     * @for jmArraw
     * @type {point} 结束点
     */

  }, {
    key: "end",
    get: function get() {
      return this.__pro('end');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('end', v);
    }
    /**
     * 箭头角度
     *
     * @property angle
     * @for jmArraw
     * @type {number} 箭头角度
     */

  }, {
    key: "angle",
    get: function get() {
      return this.__pro('angle');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('angle', v);
    }
    /**
     * 箭头X偏移量
     *
     * @property offsetX
     * @for jmArraw
     * @type {number}
     */

  }, {
    key: "offsetX",
    get: function get() {
      return this.__pro('offsetX');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('offsetX', v);
    }
    /**
     * 箭头Y偏移量
     *
     * @property offsetY
     * @for jmArraw
     * @type {number}
     */

  }, {
    key: "offsetY",
    get: function get() {
      return this.__pro('offsetY');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('offsetY', v);
    }
  }]);

  return jmArraw;
}(_jmPath2.jmPath);

exports.jmArraw = jmArraw;

},{"../common/jmUtils.js":5,"./jmPath.js":20}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmBezier = void 0;

var _jmPath2 = require("./jmPath.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 贝塞尔曲线,继承jmPath
 * N阶，参数points中为控制点
 *
 * @class jmBezier
 * @extends jmPath
 * @param {object} params 参数
 */
var jmBezier =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmBezier, _jmPath);

  function jmBezier(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmBezier';

    _classCallCheck(this, jmBezier);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmBezier).call(this, params, t));
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


  _createClass(jmBezier, [{
    key: "initPoints",

    /**
     * 初始化图形点
     *
     * @method initPoints
     * @private
     */
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
        } //触发控件移动事件	


        this.emit('move', {
          offsetX: x,
          offsetY: y,
          trans: trans
        });
        this.getLocation(true); //重置
      }
    }
  }, {
    key: "cpoints",
    get: function get() {
      return this.__pro('cpoints');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('cpoints', v);
    }
  }]);

  return jmBezier;
}(_jmPath2.jmPath);

exports.jmBezier = jmBezier;

},{"./jmPath.js":20}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmCircle = void 0;

var _jmArc2 = require("./jmArc.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画规则的圆弧
 *
 * @class jmCircle
 * @extends jmArc
 * @param {object} params 圆的参数:center=圆中心,radius=圆半径,优先取此属性，如果没有则取宽和高,width=圆宽,height=圆高
 */
var jmCircle =
/*#__PURE__*/
function (_jmArc) {
  _inherits(jmCircle, _jmArc);

  function jmCircle(params) {
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmCircle';

    _classCallCheck(this, jmCircle);

    return _possibleConstructorReturn(this, _getPrototypeOf(jmCircle).call(this, params, t));
  }
  /**
   * 初始化图形点
   * 
   * @method initPoint
   * @private
   * @for jmCircle
   */


  _createClass(jmCircle, [{
    key: "initPoints",
    value: function initPoints() {
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
      var bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      var location = this.getLocation();

      if (!location.radius) {
        location.radius = Math.min(location.width, location.height) / 2;
      }

      var start = this.startAngle;
      var end = this.endAngle;
      var anticlockwise = this.anticlockwise; //context.arc(x,y,r,sAngle,eAngle,counterclockwise);

      this.context.arc(location.center.x + bounds.left, location.center.y + bounds.top, location.radius, start, end, anticlockwise);
    }
  }]);

  return jmCircle;
}(_jmArc2.jmArc);

exports.jmCircle = jmCircle;

},{"./jmArc.js":13}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmControl = void 0;

var _jmUtils = require("../common/jmUtils.js");

var _jmList = require("../common/jmList.js");

var _jmGradient = require("../models/jmGradient.js");

var _jmShadow = require("../models/jmShadow.js");

var _jmProperty2 = require("../common/jmProperty.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 控件基础对象
 * 控件的基础属性和方法
 *
 * @class jmControl
 * @extends jmProperty
 */
var jmControl =
/*#__PURE__*/
function (_jmProperty) {
  _inherits(jmControl, _jmProperty);

  function jmControl(params, t) {
    var _this2;

    _classCallCheck(this, jmControl);

    params = params || {};
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(jmControl).call(this));

    _this2.__pro('type', t || (this instanceof jmControl ? this.constructor : void 0).name);

    _this2.style = params && params.style ? params.style : {}; //this.position = params.position || {x:0,y:0};

    _this2.width = params.width || 0;
    _this2.height = params.height || 0;

    if (params.position) {
      _this2.position = params.position;
    }

    _this2.graph = params.graph || null;
    _this2.zIndex = params.zIndex || 0; //样式名称，也当做白名单使用		

    _this2.jmStyleMap = {
      'fill': 'fillStyle',
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

    _this2.initializing();

    _this2.on = _this2.bind;
    return _this2;
  } //# region 定义属性

  /**
   * 当前对象类型名jmRect
   *
   * @property type
   * @type string
   */


  _createClass(jmControl, [{
    key: "initializing",
    //# end region

    /**
     * 初始化对象，设定样式，初始化子控件对象
     * 此方法为所有控件需调用的方法
     *
     * @method initializing
     * @for jmControl
     */
    value: function initializing() {
      var self = this; //定义子元素集合

      this.children = this.children || new _jmList.jmList();
      var oadd = this.children.add; //当把对象添加到当前控件中时，设定其父节点

      this.children.add = function (obj) {
        if (_typeof(obj) === 'object') {
          if (obj.parent && obj.parent != self && obj.parent.children) {
            obj.parent.children.remove(obj); //如果有父节点则从其父节点中移除
          }

          obj.parent = self; //如果存在先移除

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

      this.children.oremove = this.children.remove; //当把对象从此控件中移除时，把其父节点置为空

      this.children.remove = function (obj) {
        if (_typeof(obj) === 'object') {
          obj.parent = null;
          obj.graph = null;
          obj.remove(true);
          this.oremove(obj);
          self.needUpdate = true; //self.emit('removeChild', obj, index);
        }
      };
      /**
       * 根据控件zIndex排序，越大的越高
       */


      this.children.sort = function () {
        var levelItems = {}; //提取zindex大于0的元素
        //为了保证0的层级不改变，只能把大于0的提出来。

        this.each(function (i, obj) {
          if (!obj) return;
          var zindex = obj.zIndex;

          if (!zindex && obj.style && obj.style.zIndex) {
            zindex = Number(obj.style.zIndex);
            if (isNaN(zindex)) zindex = obj.style.zIndex || 0;
          }

          if (zindex) {
            var items = levelItems[zindex] || (levelItems[zindex] = []);
            items.push(obj);
          }
        });

        for (var index in levelItems) {
          oadd.call(this, levelItems[index]);
        }

        self.needUpdate = true;
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

      style = style || this.style;
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

      var __setStyle = function __setStyle(style, name, mpkey) {
        //let styleValue = style[mpkey||name]||style;
        if (style) {
          var t = _typeof(style);

          var mpname = _this3.jmStyleMap[mpkey || name]; //如果为渐变对象

          if (style instanceof _jmGradient.jmGradient || t == 'string' && style.indexOf('-gradient') > -1) {
            //如果是渐变，则需要转换
            if (t == 'string' && style.indexOf('-gradient') > -1) {
              style = new _jmGradient.jmGradient(style);
            }

            __setStyle(style.toGradient(_this3), mpname || name);
          } else if (t == 'function') {
            if (mpname) {
              style = style.call(_this3, mpname);

              if (style) {
                __setStyle(style, mpname);
              }
            }
          } else if (mpname) {
            //只有存在白名单中才处理
            //颜色转换
            if (t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
              style = _jmUtils.jmUtils.toColor(style);
            }

            _this3.context[mpname] = style;
          } else {
            switch (name) {
              //阴影样式
              case 'shadow':
                {
                  if (t == 'string') {
                    __setStyle(new _jmShadow.jmShadow(style), name);

                    break;
                  }

                  for (var k in style) {
                    __setStyle(style[k], k, name + '.' + k);
                  }

                  break;
                }
              //平移

              case 'translate':
                {
                  _this3.context.translate(style.x, style.y);

                  break;
                }
              //旋转

              case 'rotation':
                {
                  //旋 转先移位偏移量
                  var tranX = 0;
                  var tranY = 0; //旋转，则移位，如果有中心位则按中心旋转，否则按左上角旋转
                  //这里只有style中的旋转才能生效，不然会导至子控件多次旋转

                  if (style.point) {
                    var bounds = _this3.absoluteBounds ? _this3.absoluteBounds : _this3.getAbsoluteBounds();
                    style = _this3.getRotation(style);
                    tranX = style.rotateX + bounds.left;
                    tranY = style.rotateY + bounds.top;
                  }

                  if (tranX != 0 || tranY != 0) _this3.context.translate(tranX, tranY);

                  _this3.context.rotate(style.angle);

                  if (tranX != 0 || tranY != 0) _this3.context.translate(-tranX, -tranY);
                  break;
                }

              case 'transform':
                {
                  if (Array.isArray(style)) {
                    _this3.context.transform.apply(_this3.context, style);
                  } else if (_typeof(style) == 'object') {
                    _this3.context.transform(style.scaleX, //水平缩放
                    style.skewX, //水平倾斜
                    style.skewY, //垂直倾斜
                    style.scaleY, //垂直缩放
                    style.offsetX, //水平位移
                    style.offsetY); //垂直位移

                  }

                  break;
                }
              //位移

              case 'translate':
                {
                  _this3.context.translate(style.x, style.y);

                  break;
                }
              //鼠标指针

              case 'cursor':
                {
                  _this3.cursor = style;
                  break;
                }
            }
          }
        }
      }; //一些特殊属性要先设置，否则会导致顺序不对出现错误的效果


      if (this.translate) {
        __setStyle({
          translate: this.translate
        }, 'translate');
      }

      if (this.transform) {
        __setStyle({
          transform: this.transform
        }, 'transform');
      } //设置样式


      for (var k in style) {
        var t = _typeof(style[k]); //先处理部分样式，以免每次都需要初始化解析


        if (t == 'string' && style[k].indexOf('-gradient') > -1) {
          style[k] = new _jmGradient.jmGradient(style[k]);
        } else if (t == 'string' && k == 'shadow') {
          style[k] = new _jmShadow.jmShadow(style[k]);
        }

        __setStyle(style[k], k);
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
        } else if (this.canvas.width) {
          rect.right = this.canvas.width;
        } else if (this.width) {
          rect.right = this.width;
        }

        if (typeof this.canvas.height === 'function') {
          rect.bottom = this.canvas.height();
        } else if (this.canvas.height) {
          rect.bottom = this.canvas.height;
        } else if (this.height) {
          rect.bottom = this.height;
        }
      } else if (this.points && this.points.length > 0) {
        for (var i in this.points) {
          var p = this.points[i];

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
      var margin = this.style.margin || {};
      margin.left = margin.left || 0;
      margin.top = margin.top || 0;
      margin.right = margin.right || 0;
      margin.bottom = margin.bottom || 0; //如果没有指定位置，但指定了margin。则位置取margin偏移量

      if (local.position) {
        local.left = local.position.x;
        local.top = local.position.y;
      } else {
        local.left = margin.left;
        local.top = margin.top;
      }

      if (!this.parent) return local; //没有父节点则直接返回

      var parentBounds = this.parent.getBounds(); //处理百分比参数

      if (_jmUtils.jmUtils.checkPercent(local.left)) {
        local.left = _jmUtils.jmUtils.percentToNumber(local.left) * parentBounds.width;
      }

      if (_jmUtils.jmUtils.checkPercent(local.top)) {
        local.top = _jmUtils.jmUtils.percentToNumber(local.top) * parentBounds.height;
      } //如果没有指定宽度或高度，则按百分之百计算其父宽度或高度


      if (_jmUtils.jmUtils.checkPercent(local.width)) {
        local.width = _jmUtils.jmUtils.percentToNumber(local.width) * parentBounds.width;
      }

      if (_jmUtils.jmUtils.checkPercent(local.height)) {
        local.height = _jmUtils.jmUtils.percentToNumber(local.height) * parentBounds.height;
      } //处理中心点


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

      return local;
    }
    /**
     * 获取当前控制的旋转信息
     * @returns {object} 旋转中心和角度
     */

  }, {
    key: "getRotation",
    value: function getRotation(rotation) {
      rotation = rotation || this.style.rotation;

      if (!rotation) {
        //如果本身没有，则可以继承父级的
        rotation = this.parent && this.parent.getRotation ? this.parent.getRotation() : null; //如果父级有旋转，则把坐标转换为当前控件区域

        if (rotation) {
          var bounds = this.getBounds();
          rotation.rotateX -= bounds.left;
          rotation.rotateY -= bounds.top;
        }
      } else {
        var _bounds = this.getBounds();

        rotation.rotateX = rotation.point.x;

        if (_jmUtils.jmUtils.checkPercent(rotation.rotateX)) {
          rotation.rotateX = _jmUtils.jmUtils.percentToNumber(rotation.rotateX) * _bounds.width;
        }

        rotation.rotateY = rotation.point.y;

        if (_jmUtils.jmUtils.checkPercent(rotation.rotateY)) {
          rotation.rotateY = _jmUtils.jmUtils.percentToNumber(rotation.rotateY) * _bounds.height;
        }
      }

      return rotation;
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
        local.top += y; // 由于local是clone出来的对象，为了保留位移，则要修改原属性

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
      } //触发控件移动事件	


      this.emit('move', {
        offsetX: x,
        offsetY: y,
        trans: trans,
        evt: evt
      });
      this.needUpdate = true;
    }
    /**
     * 把图形旋转一个角度
     * @param {number} angle 旋转角度
     * @param {object} point 旋转坐标，可以是百分比,例如：{x: '50%',y: '50%'}
     */

  }, {
    key: "rotate",
    value: function rotate(angle, point) {
      /*this.children.each(function(i,c){
      	c.rotate(angle);
      });*/
      this.style.rotation = {
        angle: angle,
        point: point
      };
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
     * 画控件前初始化
     * 执行beginPath开始控件的绘制
     * 
     * @method beginDraw
     */

  }, {
    key: "beginDraw",
    value: function beginDraw() {
      this.getLocation(true); //重置位置信息

      this.context.beginPath();
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
        this.context.closePath();
      }

      if (this.style['fill']) {
        this.context.fill();
      }

      if (this.style['stroke'] || !this.style['fill']) {
        this.context.stroke();
      }

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
        this.context.moveTo(this.points[0].x + bounds.left, this.points[0].y + bounds.top);
        var len = this.points.length;

        for (var i = 1; i < len; i++) {
          var p = this.points[i]; //移至当前坐标

          if (p.m) {
            this.context.moveTo(p.x + bounds.left, p.y + bounds.top);
          } else {
            this.context.lineTo(p.x + bounds.left, p.y + bounds.top);
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
        if (this.initPoints) this.initPoints(); //计算当前边界

        this.bounds = null;
        this.absoluteBounds = this.getAbsoluteBounds();
        var needDraw = true; //是否需要绘制

        if (!this.is('jmGraph') && this.graph) {
          if (this.absoluteBounds.left >= this.graph.width) needDraw = false;else if (this.absoluteBounds.top >= this.graph.height) needDraw = false;else if (this.absoluteBounds.right <= 0) needDraw = false;else if (this.absoluteBounds.bottom <= 0) needDraw = false;
        }

        this.context.save();
        this.setStyle(); //设定样式

        this.emit('beginDraw', this);
        if (needDraw && this.beginDraw) this.beginDraw();
        if (needDraw && this.draw) this.draw();
        if (needDraw && this.endDraw) this.endDraw();

        if (this.children) {
          this.children.each(function (i, item) {
            if (item && item.paint) item.paint();
          });
        }

        this.emit('endDraw', this);
        this.context.restore(); //兼容小程序

        if (this.is('jmGraph') && this.context.draw) this.context.draw();
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

        if (p.pageX > position.right || p.pageX < position.left) {
          return false;
        }

        if (p.pageY > position.bottom || p.pageY < position.top) {
          return false;
        }

        return true;
      }

      var bounds = this.getBounds();
      var rotation = this.getRotation(); //获取当前旋转参数

      var ps = this.points; //如果不是路径组成，则采用边界做为顶点

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
      } //如果有指定padding 表示接受区域加宽，命中更易


      pad = Number(pad || this.style['touchPadding'] || this.style['lineWidth'] || 1);

      if (ps && ps.length) {
        //如果有旋转参数，则需要转换坐标再处理
        if (rotation && rotation.angle != 0) {
          ps = _jmUtils.jmUtils.clone(ps, true); //拷贝一份数据
          //rotateX ,rotateY 是相对当前控件的位置

          ps = _jmUtils.jmUtils.rotatePoints(ps, {
            x: rotation.rotateX + bounds.left,
            y: rotation.rotateY + bounds.top
          }, rotation.angle);
        } //如果当前路径不是实心的
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
          } //不是封闭的图形，则直接返回


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

        var position = _jmUtils.jmUtils.getEventPosition(args, graph.scaleSize); //初始化事件位置		


        var srcElement = args.srcElement || args.target;
        args = {
          position: position,
          button: args.button == 0 || position.isTouch ? 1 : args.button,
          keyCode: args.keyCode || args.charCode || args.which,
          ctrlKey: args.ctrlKey,
          cancel: false,
          srcElement: srcElement
        };
      }

      args.path = args.path || []; //事件冒泡路径
      //先执行子元素事件，如果事件没有被阻断，则向上冒泡
      //var stoped = false;

      if (this.children) {
        this.children.each(function (j, el) {
          //未被阻止才执行			
          if (args.cancel !== true) {
            //如果被阻止冒泡，
            //stoped = el.raiseEvent(name,args) === false?true:stoped;
            el.raiseEvent(name, args);
          }
        }, true); //按逆序处理
      } //if(stoped) return false;
      //获取当前对象的父元素绝对位置
      //生成当前坐标对应的父级元素的相对位置


      var abounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
      if (!abounds) return false; //args = jmUtils.clone(args);//参数副本

      args.position.x = args.position.offsetX - abounds.left;
      args.position.y = args.position.offsetY - abounds.top; //事件发生在边界内或健盘事件发生在画布中才触发

      if (this.checkPoint(args.position)) {
        //如果没有指定触发对象，则认为当前为第一触发对象
        if (!args.target) {
          args.target = this;
        }

        args.path.push(this);

        if (args.cancel !== true) {
          //如果返回true则阻断冒泡
          this.runEventHandle(name, args); //执行事件		
        }

        if (!this.focused && name == 'mousemove') {
          this.focused = true; //表明当前焦点在此控件中

          this.raiseEvent('mouseover', args);
        }
      } else {
        //如果焦点不在，且原焦点在，则触发mouseleave事件
        if (this.focused && name == 'mousemove') {
          this.focused = false; //表明当前焦点离开

          this.runEventHandle('mouseleave', args); //执行事件	
        }
      }

      return args.cancel == false; //如果被阻止则返回false,否则返回true
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
          var _this = self; //如果鼠标经过当前可移动控件，则显示可移动指针
          //if(evt.path && evt.path.indexOf(_this)>-1) {
          //	_this.cursor('move');	
          //}

          if (_this.__mvMonitor.mouseDown) {
            _this.parent.bounds = null;

            var parentbounds = _this.parent.getAbsoluteBounds();

            var offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
            var offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y; //console.log(offsetx + ',' + offsety);
            //如果锁定边界

            if (_this.lockSide) {
              var thisbounds = _this.bounds || _this.getAbsoluteBounds(); //检查边界出界


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
              _this.__mvMonitor.curposition.y = evt.position.offsetY; //console.log(offsetx + '.' + offsety);
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
            _this.__mvMonitor.mouseDown = false; //_this.cursor('default');

            _this.emit('moveend', {
              position: _this.__mvMonitor.curposition
            }); //return false;

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
            _this.__mvMonitor.mouseDown = false; //_this.cursor('default');	

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
            this.__mvMonitor.mouseDown = true; //this.cursor('move');

            var parentbounds = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
            this.__mvMonitor.curposition.x = evt.position.x + parentbounds.left;
            this.__mvMonitor.curposition.y = evt.position.y + parentbounds.top; //触发控件移动事件

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

      return this;
    }
  }, {
    key: "type",
    get: function get() {
      return this.__pro('type');
    }
    /**
     * 当前canvas的context
     * @property context
     * @type {object}
     */

  }, {
    key: "context",
    get: function get() {
      var s = this.__pro('context');

      if (s) return s;else if (this.is('jmGraph') && this.canvas) {
        return this.context = this.canvas.getContext('2d');
      }
      var g = this.graph;
      if (g) return g.context;
      return g.canvas.getContext('2d');
    },
    set: function set(v) {
      return this.__pro('context', v);
    }
    /**
     * 样式
     * @property style
     * @type {object}
     */

  }, {
    key: "style",
    get: function get() {
      var s = this.__pro('style');

      if (!s) s = this.__pro('style', {});
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('style', v);
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
      var s = this.__pro('visible');

      if (typeof s == 'undefined') s = this.__pro('visible', true);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('visible', v);
    }
    /**
     * 当前控件的子控件集合
     * @property children
     * @type {list}
     */

  }, {
    key: "children",
    get: function get() {
      var s = this.__pro('children');

      if (!s) s = this.__pro('children', new _jmList.jmList());
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('children', v);
    }
    /**
     * 宽度
     * @property width
     * @type {number}
     */

  }, {
    key: "width",
    get: function get() {
      var s = this.__pro('width');

      if (typeof s == 'undefined') s = this.__pro('width', 0);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('width', v);
    }
    /**
     * 高度
     * @property height
     * @type {number}
     */

  }, {
    key: "height",
    get: function get() {
      var s = this.__pro('height');

      if (typeof s == 'undefined') s = this.__pro('height', 0);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('height', v);
    }
    /**
     * 控件层级关系，发生改变时，需要重新调整排序
     * @property zIndex
     * @type {number}
     */

  }, {
    key: "zIndex",
    get: function get() {
      var s = this.__pro('zIndex');

      if (!s) s = this.__pro('zIndex', 0);
      return s;
    },
    set: function set(v) {
      this.needUpdate = true;

      this.__pro('zIndex', v);

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
    set: function set(cur) {
      var graph = this.graph;

      if (graph) {
        graph.css('cursor', cur);
      }
    },
    get: function get() {
      var graph = this.graph;

      if (graph) {
        return graph.css('cursor');
      }
    }
  }]);

  return jmControl;
}(_jmProperty2.jmProperty);

exports.jmControl = jmControl;
;

},{"../common/jmList.js":2,"../common/jmProperty.js":4,"../common/jmUtils.js":5,"../models/jmGradient.js":11,"../models/jmShadow.js":12}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmHArc = void 0;

var _jmArc2 = require("./jmArc.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画空心圆弧,继承自jmPath
 *
 * @class jmHArc
 * @extends jmArc
 * @param {object} params 空心圆参数:minRadius=中心小圆半径,maxRadius=大圆半径,start=起始角度,end=结束角度,anticlockwise=false  顺时针，true 逆时针
 */
var jmHArc =
/*#__PURE__*/
function (_jmArc) {
  _inherits(jmHArc, _jmArc);

  function jmHArc(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmHArc';

    _classCallCheck(this, jmHArc);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmHArc).call(this, params, t));
    _this.minRadius = params.minRadius || style.minRadius || 0;
    _this.maxRadius = params.maxRadius || style.maxRadius || 0;
    return _this;
  }
  /**
   * 设定或获取内空心圆半径
   * 
   * @property minRadius
   * @for jmHArc
   * @type {number} 
   */


  _createClass(jmHArc, [{
    key: "initPoints",

    /**
     * 初始化图形点
     *
     * @method initPoints
     * @private
     */
    value: function initPoints() {
      var location = this.getLocation(); //如果设定了半径。则以半径为主

      var minr = this.minRadius;
      var maxr = this.maxRadius;
      var start = this.startAngle;
      var end = this.endAngle;
      var anticlockwise = this.anticlockwise; //如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end

      if (anticlockwise) {
        var p2 = Math.PI * 2;
        start = p2 - start;
        end = p2 - end;
      }

      var step = 0.1;
      if (start > end) step = -step;
      var minps = [];
      var maxps = []; //椭圆方程x=a*cos(r) ,y=b*sin(r)

      for (var r = start;; r += step) {
        if (step > 0 && r >= end) break;else if (step < 0 && r <= end) break;
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
      }

      maxps.reverse(); //大圆逆序

      if (!this.style || !this.style.close) {
        maxps[0].m = true; //开始画大圆时表示为移动
      }

      this.points = minps.concat(maxps);
    }
  }, {
    key: "minRadius",
    get: function get() {
      return this.__pro('minRadius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('minRadius', v);
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
      return this.__pro('maxRadius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('maxRadius', v);
    }
  }]);

  return jmHArc;
}(_jmArc2.jmArc);

exports.jmHArc = jmHArc;

},{"./jmArc.js":13}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmLine = void 0;

var _jmPath2 = require("./jmPath.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画一条直线
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数:start=起始点,end=结束点,lineType=线类型(solid=实线，dotted=虚线),dashLength=虚线间隔(=4)
 */
var jmLine =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmLine, _jmPath);

  function jmLine(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmLine';

    _classCallCheck(this, jmLine);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmLine).call(this, params, t));
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
    return _this;
  }
  /**
   * 控制起始点
   * 
   * @property start
   * @for jmLine
   * @type {point}
   */


  _createClass(jmLine, [{
    key: "initPoints",

    /**
     * 初始化图形点,如呆为虚线则根据跳跃间隔描点
     * @method initPoints
     * @private
     */
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
          if (dottedstart == false) {
            this.points.push({
              x: start.x + dx * l,
              y: start.y + dy * l
            });
            l += dottedsp;
          } else {
            this.points.push({
              x: start.x + dx * l,
              y: start.y + dy * l,
              m: true
            });
            l += dashLen;
          }

          dottedstart = !dottedstart;
        }
      }

      this.points.push(end);
      return this.points;
    }
  }, {
    key: "start",
    get: function get() {
      return this.__pro('start');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('start', v);
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
      return this.__pro('end');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('end', v);
    }
  }]);

  return jmLine;
}(_jmPath2.jmPath);

exports.jmLine = jmLine;

},{"./jmPath.js":20}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmPath = void 0;

var _jmControl2 = require("./jmControl.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 基础路径,大部分图型的基类
 * 指定一系列点，画出图形
 *
 * @class jmPath
 * @extends jmControl
 * @param {object} params 路径参数 points=所有描点
 */
var jmPath =
/*#__PURE__*/
function (_jmControl) {
  _inherits(jmPath, _jmControl);

  function jmPath(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmPath';

    _classCallCheck(this, jmPath);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmPath).call(this, params, t));
    _this.points = params && params.points ? params.points : [];
    return _this;
  }
  /**
   * 描点集合
   * point格式：{x:0,y:0,m:true}
   * @property points
   * @type {array}
   */


  _createClass(jmPath, [{
    key: "points",
    get: function get() {
      var s = this.__pro('points');

      return s;
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('points', v);
    }
  }]);

  return jmPath;
}(_jmControl2.jmControl);

exports.jmPath = jmPath;

},{"./jmControl.js":17}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmPrismatic = void 0;

var _jmPath2 = require("./jmPath.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画棱形
 *
 * @class jmPrismatic
 * @extends jmPath
 * @param {object} params 参数 center=棱形中心点，width=棱形宽,height=棱形高
 */
var jmPrismatic =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmPrismatic, _jmPath);

  function jmPrismatic(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmPrismatic';

    _classCallCheck(this, jmPrismatic);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmPrismatic).call(this, params, t));
    _this.style.close = typeof _this.style.close == 'undefined' ? true : _this.style.close;
    _this.center = params.center || {
      x: 0,
      y: 0
    };
    _this.width = params.width || 0; //this.on('PropertyChange',this.initPoints);

    _this.height = params.height || 0;
    return _this;
  }
  /**
   * 中心点
   * point格式：{x:0,y:0,m:true}
   * @property center
   * @type {point}
   */


  _createClass(jmPrismatic, [{
    key: "initPoints",

    /**
     * 初始化图形点
     * 计算棱形顶点
     * 
     * @method initPoints
     * @private
     */
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
  }, {
    key: "center",
    get: function get() {
      return this.__pro('center');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('center', v);
    }
  }]);

  return jmPrismatic;
}(_jmPath2.jmPath);

exports.jmPrismatic = jmPrismatic;

},{"./jmPath.js":20}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jmRect = void 0;

var _jmPath2 = require("./jmPath.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 画矩形
 *
 * @class jmRect
 * @extends jmPath
 * @param {object} params 参数 position=矩形左上角顶点坐标,width=宽，height=高,radius=边角弧度
 */
var jmRect =
/*#__PURE__*/
function (_jmPath) {
  _inherits(jmRect, _jmPath);

  function jmRect(params) {
    var _this;

    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'jmRect';

    _classCallCheck(this, jmRect);

    params = params || {};
    _this = _possibleConstructorReturn(this, _getPrototypeOf(jmRect).call(this, params, t));
    _this.style.close = true;
    _this.radius = params.radius || _this.style.radius || 0;
    return _this;
  }
  /**
   * 圆角半径
   * @property radius
   * @type {number}
   */


  _createClass(jmRect, [{
    key: "getBounds",

    /**
     * 获取当前控件的边界
     *
     * @method getBounds
     * @return {bound} 当前控件边界
     */
    value: function getBounds() {
      var rect = {};
      this.initPoints();
      var p = this.getLocation();
      rect.left = p.left;
      rect.top = p.top;
      rect.right = p.left + p.width;
      rect.bottom = p.top + p.height;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
      return rect;
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
      }; //如果指定为虚线 , 则初始化一个直线组件，来构建虚线点集合

      if (this.style.lineType === 'dotted' && !this.dottedLine) {
        this.dottedLine = this.graph.createShape('line', {
          style: this.style
        });
      } //如果有边界弧度则借助圆弧对象计算描点


      if (location.radius && location.radius < location.width / 2 && location.radius < location.height / 2) {
        var q = Math.PI / 2;
        var arc = this.graph.createShape('arc', {
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
        arc = this.graph.createShape('arc', {
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
        arc = this.graph.createShape('arc', {
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
        arc = this.graph.createShape('arc', {
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
        this.points.push(p1); //如果是虚线

        if (this.dottedLine) {
          this.dottedLine.start = p1;
          this.dottedLine.end = p2;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }

        this.points.push(p2); //如果是虚线

        if (this.dottedLine) {
          this.dottedLine.start = p2;
          this.dottedLine.end = p3;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }

        this.points.push(p3); //如果是虚线

        if (this.dottedLine) {
          this.dottedLine.start = p3;
          this.dottedLine.end = p4;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }

        this.points.push(p4); //如果是虚线

        if (this.dottedLine) {
          this.dottedLine.start = p4;
          this.dottedLine.end = p1;
          this.points = this.points.concat(this.dottedLine.initPoints());
        }
      }

      return this.points;
    }
  }, {
    key: "radius",
    get: function get() {
      return this.__pro('radius');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('radius', v);
    }
    /**
     * 当前位置左上角
     * @property position
     * @type {point}
     */

  }, {
    key: "position",
    get: function get() {
      return this.__pro('position');
    },
    set: function set(v) {
      this.needUpdate = true;
      return this.__pro('position', v);
    }
  }]);

  return jmRect;
}(_jmPath2.jmPath);

exports.jmRect = jmRect;

},{"./jmPath.js":20}]},{},[10]);
var _r=_m(10);_g.jmGraph=_r;return _r;})})(typeof window!=='undefined'?window:(typeof global!=='undefined'?global:(typeof self!=='undefined'?self:this)));