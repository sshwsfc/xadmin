webpackJsonp([0],{

/***/ "../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../xadmin-dashboard/src/main.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.dashboard-container {\n  pointer-events: none !important;\n}\n.dashboard-cell-wrap > *:not(.dashboard-container) {\n  pointer-events: auto;\n}\n.widget-ctl-bar {\n  position: absolute;\n  top: -18px;\n  z-index: 9999;\n  text-align: right;\n  background-color: #F00;\n  right: -1px;\n  left: -1px;\n}\n.react-grid-layout .panel {\n  height: 100%\n}\n.react-grid-layout {\n  position: relative;\n  transition: height 200ms ease;\n}\n.react-grid-item {\n  transition: all 200ms ease;\n  transition-property: left, top;\n}\n.react-grid-item.cssTransforms {\n  transition-property: transform;\n}\n.react-grid-item.resizing {\n  z-index: 1;\n  opacity: 0.9;\n}\n.react-grid-item.react-draggable-dragging {\n  transition: none;\n  z-index: 3;\n}\n.react-grid-item.react-grid-placeholder {\n  background: red;\n  opacity: 0.2;\n  transition-duration: 100ms;\n  z-index: 2;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n}\n.react-grid-item > .react-resizable-handle {\n  position: absolute;\n  width: 20px;\n  height: 20px;\n  bottom: 0;\n  right: 0;\n  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');\n  background-position: bottom right;\n  padding: 0 3px 3px 0;\n  background-repeat: no-repeat;\n  background-origin: content-box;\n  box-sizing: border-box;\n  cursor: se-resize;\n  z-index: 9999;\n  pointer-events: auto;\n}\n.reflex-layout > .reflex-element {\n  overflow: visible;\n}\n.reflex-layout.horizontal > .reflex-splitter {\n  pointer-events: auto;\n}\n.dashboard-container-panelgroup .panel-heading {\n  pointer-events: auto;\n}", ""]);

// exports


/***/ }),

/***/ "../../xadmin-core/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StoreWrap = exports.Wrap = exports.BlockTag = exports.Block = exports.config = exports.app = undefined;

var _possibleConstructorReturn2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _objectWithoutProperties2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../../node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("../node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = __webpack_require__("../../xadmin-core/node_modules/react-redux/es/index.js");

var _redux = __webpack_require__("../../xadmin-core/node_modules/redux/es/index.js");

var _reduxSaga = __webpack_require__("../../xadmin-core/node_modules/redux-saga/es/index.js");

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reactRouter = __webpack_require__("../../xadmin-core/node_modules/react-router/lib/index.js");

var _effects = __webpack_require__("../../xadmin-core/node_modules/redux-saga/es/effects.js");

var _isPlainObject = __webpack_require__("../../xadmin-core/node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _waterfall = __webpack_require__("../../xadmin-core/node_modules/async/waterfall.js");

var _waterfall2 = _interopRequireDefault(_waterfall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function () {
  function App() {
    (0, _classCallCheck3.default)(this, App);

    this.apps = [];
    this.context = {};
    this._cache = {};
  }

  (0, _createClass3.default)(App, [{
    key: 'use',
    value: function use(app) {
      this.apps.push(app.app || app);
      return this;
    }
  }, {
    key: 'unuse',
    value: function unuse(name) {
      this.apps = this.apps.filter(function (app) {
        return app.name != name;
      });
      return this;
    }
  }, {
    key: 'get_value',
    value: function get_value(value) {
      if (typeof value == 'function' && value.length == 1) {
        if (value.constructor.name == 'GeneratorFunction') {
          var it = value(this);
          var go = function go(result) {
            if (result.done) return result.value;
            return result.value.then(function (v) {
              return go(it.next(v));
            }, function (error) {
              return go(it.throw(error));
            });
          };
          return it;
        } else {
          return value(this);
        }
      } else {
        return value;
      }
    }
  }, {
    key: 'load_apps',
    value: function load_apps(key, load_reducer) {
      var init_state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this._cache[key] == undefined) {
        this._cache[key] = this.apps.reduce(function (prev, app) {
          return app[key] !== undefined ? load_reducer(prev, app[key]) : prev;
        }, init_state) || init_state;
      }
      return this._cache[key];
    }
  }, {
    key: 'load_dict',
    value: function load_dict(key) {
      var self = this;
      return this.load_apps(key, function (prev, value) {
        return (0, _extends3.default)({}, prev, self.get_value(value));
      }, {});
    }
  }, {
    key: 'load_list',
    value: function load_list(key) {
      var self = this;
      return this.load_apps(key, function (prev, value) {
        return prev.concat(self.get_value(value));
      }, []);
    }
  }, {
    key: 'load_dict_list',
    value: function load_dict_list(key) {
      var self = this;
      return this.load_apps(key, function (prev, value) {
        var values = self.get_value(value);
        for (var _key in values) {
          prev[_key] = prev[_key] || [];
          var com_value = values[_key];
          if (Array.isArray(com_value)) {
            prev[_key] = prev[_key].concat(com_value);
          } else {
            prev[_key].push(com_value);
          }
        }
        return prev;
      }, {});
    }
  }, {
    key: 'start',
    value: function start() {
      var init_context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var self = this;

      (0, _waterfall2.default)([function (cb) {
        cb(null, init_context);
      }].concat((0, _toConsumableArray3.default)(this.load_list('context'))), function (err, context) {
        self.context = context;
        self.load_list('start').forEach(function (starter) {
          starter(self);
        });
      });
    }
  }, {
    key: 'log',
    value: function log(level, message, error) {
      this.load_list('logger').forEach(function (logger) {
        return logger(level, message, error);
      });
    }
  }, {
    key: 'error',
    value: function error(err) {
      this.log('error', err.toString(), err);
    }
  }]);
  return App;
}();

// redux app


var redux_app = {
  context: function context(app) {
    return function (context, cb) {

      var devtools = window.devToolsExtension || function () {
        return function (noop) {
          return noop;
        };
      };
      var enhancers = [_redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(app.load_list('middlewares')))].concat((0, _toConsumableArray3.default)(app.load_list('store_enhancers')), [devtools()]);

      var enhance_reducer = function enhance_reducer(key, reducer) {
        var reducer_enhance = app.load_dict_list('reducer_enhance');
        if (reducer_enhance[key] !== undefined) {
          var reducers = [reducer].concat((0, _toConsumableArray3.default)(reducer_enhance[key]));
          return function (state, action) {
            return reducers.reduce(function (prev, reducer) {
              return reducer(prev, action);
            }, state);
          };
        }
        return reducer;
      };

      var combine_reducer = function combine_reducer(key, reducers) {
        if (reducers.length > 1) {
          return function (state, action) {
            return reducers.reduce(function (prev, reducer) {
              return reducer(prev, action);
            }, state);
          };
        } else {
          return reducers[0];
        }
      };

      var create_reducers = function create_reducers() {
        var reducers_map = app.load_dict_list('reducers');
        var reducers = {};
        for (var key in reducers_map) {
          reducers[key] = combine_reducer(key, reducers_map[key]);
        }
        return (0, _redux.combineReducers)(reducers);
      };

      // create store
      var store = (0, _redux.createStore)(create_reducers(), context['initial_state'] || {}, _redux.compose.apply(undefined, (0, _toConsumableArray3.default)(enhancers)));

      cb(null, (0, _extends3.default)({}, context, { store: store }));
    };
  },
  start: function start(app) {
    return function () {
      // store change
      var store = app.context.store;

      var listeners = app.load_list('subscribe');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;

          store.subscribe(listener);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      app.load_list('on_create_store').forEach(function (callback) {
        return callback(store);
      });
    };
  }

  // saga app
};var sagaMiddleware = (0, _reduxSaga2.default)();
var sage_app = {
  context: function context(app) {
    return function (context, cb) {
      // extend store
      var store = context.store;

      store.runSaga = sagaMiddleware.run;

      // start saga
      var effects = app.load_list('effects');
      effects.forEach(sagaMiddleware.run);
      cb(null, context);
    };
  },
  middlewares: function middlewares(app) {
    return sagaMiddleware;
  }

  // react & react-router app
};var react_app = {
  context: function context(app) {
    return function (context, cb) {
      app.go = function (uri) {
        app.context.router.push(uri);
      };

      var routerType = config('router', 'browser');
      var router = typeof routerType === 'string' ? {
        browser: _reactRouter.browserHistory,
        hash: _reactRouter.hashHistory
      }[routerType] : routerType;

      cb(null, (0, _extends3.default)({}, context, { router: router }));
    };
  },
  start: function start(app) {
    return function () {
      // init container
      var container = app.context.container;

      if (typeof container === 'string') {
        container = document.querySelector(container);
      }

      var rs = app.load_dict_list('routers');
      var find_childs = function find_childs(path) {
        return (rs[path] || []).map(function (r) {
          var childs = find_childs((path == '@' ? '' : path) + r.path);
          return childs.length > 0 ? (0, _extends3.default)({}, r, { childRoutes: [].concat((0, _toConsumableArray3.default)(r.childRoutes || []), (0, _toConsumableArray3.default)(childs)) }) : r;
        });
      };
      var routers = find_childs('@')[0];

      var RootComponent = app.load_list('root_component').reduce(function (PrevComponent, render) {
        return render(PrevComponent);
      }, function () {
        return _react2.default.createElement(_reactRouter.Router, { history: app.context.router, routes: routers });
      });

      _reactDom2.default.render(_react2.default.createElement(RootComponent, null), container);
    };
  }

  // react-redux app
};var react_redux_app = {
  root_component: function root_component(app) {
    return function (PrevComponent) {
      var store = app.context.store;

      return function () {
        return _react2.default.createElement(
          _reactRedux.Provider,
          { store: store },
          _react2.default.createElement(PrevComponent, null)
        );
      };
    };
  }
};

if (window.__app == undefined) {
  window.__app = new App();
  window.__app.use(redux_app).use(sage_app).use(react_app).use(react_redux_app);
}
var app = window.__app;

var Block = function Block(tag, element, props) {
  var blocks = app.load_dict_list('blocks');
  if (blocks[tag] !== undefined) {
    return blocks[tag].reduce(function (prev, block) {
      var ret = block((0, _extends3.default)({ nodes: prev }, element.props, props));
      if (ret !== undefined && ret != prev) {
        if (Array.isArray(ret)) {
          prev = prev.concat(ret);
        } else {
          prev.push(ret);
        }
      }
      return prev;
    }, []);
  }
};

var BlockTag = function BlockTag(_ref) {
  var tag = _ref.tag,
      children = _ref.children,
      props = _ref.props,
      extraProps = (0, _objectWithoutProperties3.default)(_ref, ['tag', 'children', 'props']);

  var blocks = app.load_dict_list('blocks') && app.load_dict_list('blocks')[tag];
  if (blocks !== undefined) {
    return blocks.reduce(function (prev, block) {
      var ret = block((0, _extends3.default)({ nodes: prev }, props, extraProps));
      if (ret !== undefined && ret != prev) {
        if (Array.isArray(ret)) {
          prev = prev.concat(ret);
        } else {
          prev.push(ret);
        }
      }
      return prev;
    }, [children]);
  } else {
    return children;
  }
};

// Helps track hot reloading.
var nextVersion = 0;

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var shallowEqual = function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }
  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }
  return true;
};

var _wrap_component = function _wrap_component(tag, WrappedComponent, wrappers, defaultMapper) {
  var connectDisplayName = 'Connect(' + getDisplayName(WrappedComponent) + ')';
  // Helps track hot reloading.
  var version = nextVersion++;

  var Connect = function (_React$Component) {
    (0, _inherits3.default)(Connect, _React$Component);

    function Connect(props, context) {
      (0, _classCallCheck3.default)(this, Connect);

      var _this = (0, _possibleConstructorReturn3.default)(this, (Connect.__proto__ || Object.getPrototypeOf(Connect)).call(this, props, context));

      _this.version = version;
      _this.stateContext = _this.getState();
      _this.clearCache();

      _this.trySubscribe();
      return _this;
    }

    (0, _createClass3.default)(Connect, [{
      key: 'getState',
      value: function getState() {
        var context = this.context;
        return wrappers.reduce(function (prev, wrapper) {
          if (wrapper.getState !== undefined) {
            return (0, _extends3.default)({}, prev, wrapper.getState(context));
          } else {
            return prev;
          }
        }, {});
      }
    }, {
      key: 'isSubscribed',
      value: function isSubscribed() {
        return (0, _isPlainObject2.default)(this.unsubscribe);
      }
    }, {
      key: 'trySubscribe',
      value: function trySubscribe() {
        if (!this.unsubscribe) {
          var callback = this.handleChange.bind(this);
          var context = this.context;
          this.unsubscribe = wrappers.reduce(function (prev, wrapper) {
            if (wrapper.subscribe !== undefined) {
              return (0, _extends3.default)({}, prev, wrapper.subscribe(context, callback));
            } else {
              return prev;
            }
          }, {});
          //this.handleChange()
        }
      }
    }, {
      key: 'tryUnsubscribe',
      value: function tryUnsubscribe() {
        if (this.unsubscribe) {
          var unsubscribe = this.unsubscribe;
          wrappers.forEach(function (wrapper) {
            if (wrapper.unsubscribe !== undefined) {
              wrapper.unsubscribe(unsubscribe);
            }
          });
          this.unsubscribe = null;
        }
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        this.getMappers().forEach(function (mapper) {
          if (mapper.event && mapper.event.mount) {
            _this2.runBindMethod(mapper.event.mount, _this2);
          }
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this3 = this;

        this.tryUnsubscribe();
        this.getMappers().forEach(function (mapper) {
          if (mapper.event && mapper.event.unmount) {
            _this3.runBindMethod(mapper.event.unmount, _this3);
          }
        });
        this.clearCache();
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var _this4 = this;

        if (shallowEqual(nextProps, this.props)) {
          return;
        }
        this.getMappers().forEach(function (mapper) {
          if (mapper.event && mapper.event.receiveProps) {
            _this4.runBindMethod(mapper.event.receiveProps, nextProps);
          }
        });
      }
    }, {
      key: 'clearCache',
      value: function clearCache() {
        this.methodProps = null;
        this.dataProps = null;
        this.computeProps = null;
        this.wrapProps = null;
        this.mappers = null;
      }
    }, {
      key: 'getMappers',
      value: function getMappers() {
        if (this.mappers == null) {
          this.mappers = (defaultMapper !== undefined ? [defaultMapper] : []).concat(app.load_dict_list('mappers')[tag] || []);
        }
        return this.mappers;
      }
    }, {
      key: 'computeDataProps',
      value: function computeDataProps() {
        var stateContext = this.stateContext,
            props = this.props;

        return this.getMappers().reduce(function (prev, mapper) {
          if (mapper.data === undefined) {
            return prev;
          }
          return (0, _extends3.default)({}, prev, mapper.data(stateContext, props, prev));
        }, this.dataProps || {});
      }
    }, {
      key: 'computeComputeProps',
      value: function computeComputeProps() {
        var _this5 = this;

        var stateContext = this.stateContext,
            props = this.props;

        return this.getMappers().reduce(function (prev, mapper) {
          if (mapper.compute === undefined) {
            return prev;
          }
          return (0, _extends3.default)({}, prev, mapper.compute(stateContext, (0, _extends3.default)({}, props, _this5.dataProps), prev));
        }, this.computeProps || {});
      }
    }, {
      key: 'computeWrapProps',
      value: function computeWrapProps() {
        var _this6 = this;

        var stateContext = this.stateContext,
            props = this.props;

        return wrappers.reduce(function (prev, wrapper) {
          if (wrapper.computeProps === undefined) {
            return prev;
          }
          return (0, _extends3.default)({}, prev, wrapper.computeProps(tag, stateContext, (0, _extends3.default)({}, props, _this6.dataProps), prev));
        }, this.wrapProps || {});
      }
    }, {
      key: 'runBindMethod',
      value: function runBindMethod(method, args) {
        var stateContext = this.stateContext,
            props = this.props;

        return method(stateContext, props, args);
      }
    }, {
      key: 'computeMethodProps',
      value: function computeMethodProps() {
        var bindMethod = this.runBindMethod.bind(this);
        return this.getMappers().reduce(function (prev, mapper) {
          if (mapper.method === undefined) {
            return prev;
          }
          var methods = mapper.method;
          var bindMethods = {};

          var _loop = function _loop(key) {
            var method = methods[key];
            bindMethods[key] = function (e) {
              return bindMethod(method)(e);
            };
          };

          for (var key in methods) {
            _loop(key);
          }
          return (0, _extends3.default)({}, prev, bindMethods);
        }, {});
      }
    }, {
      key: 'updateDataProps',
      value: function updateDataProps() {
        var nextDataProps = this.computeDataProps();
        if (this.dataProps && shallowEqual(nextDataProps, this.dataProps)) {
          return false;
        }
        this.dataProps = nextDataProps;
        return true;
      }
    }, {
      key: 'handleChange',
      value: function handleChange() {
        if (!this.unsubscribe) {
          return;
        }
        var newState = this.getState();
        if (shallowEqual(newState, this.stateContext)) {
          return;
        }
        this.stateContext = newState;

        var haveDataPropsChanged = this.updateDataProps();
        if (haveDataPropsChanged) {
          this.forceUpdate();
        }
      }
    }, {
      key: 'render',
      value: function render() {
        if (this.dataProps == null) {
          this.dataProps = this.computeDataProps();
        }
        this.computeProps = this.computeComputeProps();
        if (this.methodProps == null) {
          this.methodProps = this.computeMethodProps();
        }
        if (this.wrapProps == null) {
          this.wrapProps = this.computeWrapProps();
        }
        return _react2.default.createElement(WrappedComponent, (0, _extends3.default)({}, this.props, this.wrapProps, this.methodProps, this.dataProps, this.computeProps));
      }
    }]);
    return Connect;
  }(_react2.default.Component);

  Connect.displayName = connectDisplayName;
  Connect.WrappedComponent = WrappedComponent;
  Connect.contextTypes = wrappers.reduce(function (prev, wrapper) {
    return (0, _extends3.default)({}, prev, wrapper.contextTypes);
  }, {});

  if (true) {
    Connect.prototype.componentWillUpdate = function componentWillUpdate() {
      if (this.version === version) {
        return;
      }
      // We are hot reloading!
      this.version = version;
      this.trySubscribe();
      this.clearCache();
    };
  }
  return Connect;
  //return hoistStatics(Connect, WrappedComponent) // will invoke the error "cannot call class as a function" in IE<=10
};

var _wrap = function _wrap(magic, mapper) {
  var wrappers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if ((0, _isPlainObject2.default)(magic)) {
    return function (arg1, arg2) {
      return _wrap(arg1, arg2, [].concat((0, _toConsumableArray3.default)(wrappers), [magic]));
    };
  } else {
    return function (component) {
      return _wrap_component(magic, component, wrappers, mapper);
    };
  }
};

var Wrap = _wrap({
  contextTypes: {
    router: _react2.default.PropTypes.object.isRequired
  },
  getState: function getState(context) {
    var router = context.router;

    return { router: router };
  }
});

var StoreWrap = Wrap({
  contextTypes: {
    store: _react2.default.PropTypes.object.isRequired
  },
  getState: function getState(context) {
    var store = context.store;

    return { state: store.getState(), dispatch: store.dispatch };
  },
  subscribe: function subscribe(context, callback) {
    var store = context.store;

    return { store: store.subscribe(callback) };
  },
  unsubscribe: function unsubscribe(_unsubscribe) {
    _unsubscribe['store']();
  }
});

var config = function config(key, default_value) {
  return app.load_dict('config')[key] || default_value;
};

exports.default = app;
exports.app = app;
exports.config = config;
exports.Block = Block;
exports.BlockTag = BlockTag;
exports.Wrap = Wrap;
exports.StoreWrap = StoreWrap;

/***/ }),

/***/ "../../xadmin-dashboard/src/components/Animate.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactTransitionGroup = __webpack_require__("../../xadmin-dashboard/node_modules/react-transition-group/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Animation = function (_React$Component) {
  (0, _inherits3.default)(Animation, _React$Component);

  function Animation(props) {
    (0, _classCallCheck3.default)(this, Animation);
    return (0, _possibleConstructorReturn3.default)(this, (Animation.__proto__ || Object.getPrototypeOf(Animation)).call(this, props));
  }

  (0, _createClass3.default)(Animation, [{
    key: 'renderStyle',
    value: function renderStyle(id, enterAnimation, enterDuration, exitAnimation, exitDuration) {
      return '\n        .' + id + '-entering.' + enterAnimation + ' {\n          animation-duration: ' + enterDuration / 1000 + 's;\n          animation-fill-mode: both;\n        }\n        .' + id + '-exiting.' + exitAnimation + ' {\n          animation-duration: ' + exitDuration / 1000 + 's;\n          animation-fill-mode: both;\n        }\n        ';
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          id = _props.id,
          children = _props.children,
          enterAnimation = _props.enterAnimation,
          enterDuration = _props.enterDuration,
          exitAnimation = _props.exitAnimation,
          exitDuration = _props.exitDuration,
          show = _props.show,
          extProps = (0, _objectWithoutProperties3.default)(_props, ['id', 'children', 'enterAnimation', 'enterDuration', 'exitAnimation', 'exitDuration', 'show']);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('style', { dangerouslySetInnerHTML: { __html: this.renderStyle(id, enterAnimation, enterDuration, exitAnimation, exitDuration) } }),
        _react2.default.createElement(
          _reactTransitionGroup.Transition,
          (0, _extends3.default)({ appear: true, 'in': show, timeout: { enter: enterDuration, exit: exitDuration } }, extProps),
          function (state) {
            var classes = id + '-' + state;
            if (state == 'entering') {
              classes += ' ' + enterAnimation;
            }
            if (state == 'exiting') {
              classes += ' ' + exitAnimation;
            }
            return _react2.default.createElement(
              'div',
              { className: classes },
              children
            );
          }
        )
      );
    }
  }]);
  return Animation;
}(_react2.default.Component);

Animation.propTypes = {
  id: _react.PropTypes.string.isRequired,
  enterAnimation: _react.PropTypes.string.isRequired,
  enterDuration: _react.PropTypes.number.isRequired,
  exitAnimation: _react.PropTypes.string.isRequired,
  exitDuration: _react.PropTypes.number.isRequired,
  show: _react.PropTypes.bool.isRequired
};
exports.default = Animation;

/***/ }),

/***/ "../../xadmin-dashboard/src/components/Cell.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _reactFontawesome = __webpack_require__("../../xadmin-dashboard/node_modules/react-fontawesome/lib/index.js");

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

var _Animate = __webpack_require__("../../xadmin-dashboard/src/components/Animate.js");

var _Animate2 = _interopRequireDefault(_Animate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _transformSheet = function _transformSheet(stylesheet, namespace) {
  return stylesheet.
  // Prettier output.
  replace(/}\s*/ig, '\n}\n').
  // Regular rules are namespaced.
  replace(/(^|{|}|;|,)\s*([&a-z0-9\-~_=\.:#^\|\(\)\[\]\$'",>*\s]+)\s*(\{)/ig, function (matched) {
    return matched.replace(/[\&|#_]/g, '#' + namespace);
  });
};

var ControlBar = _react2.default.createClass({
  displayName: 'ControlBar',
  getInitialState: function getInitialState() {
    return { show: false };
  },
  onClose: function onClose() {
    this.setState({ show: false });
  },
  render: function render() {
    var _props = this.props,
        onRemove = _props.onRemove,
        cellKey = _props.cellKey,
        onCopy = _props.onCopy;

    return _react2.default.createElement(
      'div',
      { className: 'widget-ctl-bar' },
      _react2.default.createElement(_reactFontawesome2.default, { onClick: onRemove, name: 'trash-o' })
    );
  }
});

var MissWidgetType = function MissWidgetType(_ref) {
  var type = _ref.type;
  return _react2.default.createElement(
    'span',
    null,
    '\u7EC4\u4EF6\u7C7B\u578B [',
    type,
    '] \u672A\u5B9A\u4E49'
  );
};

var convertData = function convertData(data, value, editMode) {
  if (typeof value == 'string' && value.indexOf('{{') >= 0) {
    try {
      value = _lodash2.default.template(value)(data);
    } catch (error) {
      if (!editMode) {
        console.error(error);
      }
    }
  }

  if (typeof value == 'string' && value.indexOf('data:') == 0) {
    return _lodash2.default.get(data, value.substring(5));
  } else if (_lodash2.default.isArray(value)) {
    return value.map(function (v) {
      return convertData(data, v, editMode);
    });
  } else if (_lodash2.default.isPlainObject(value)) {
    return _lodash2.default.mapValues(value, function (v) {
      return convertData(data, v, editMode);
    });
  } else {
    return value;
  }
};

var shallowEqual = function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  if (!_lodash2.default.isPlainObject(objA) || !_lodash2.default.isPlainObject(objB)) {
    return false;
  }
  // object
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }
  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !shallowEqual(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
};

var Cell = (_dec = (0, _wrap2.default)('dashboard.cell'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Cell, _React$Component);

  function Cell(props) {
    (0, _classCallCheck3.default)(this, Cell);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Cell.__proto__ || Object.getPrototypeOf(Cell)).call(this, props));

    _initialiseProps.call(_this);

    var cellKey = props.cellKey,
        editMode = props.editMode,
        data = props.data,
        cells = props.cells,
        params = props.params;

    var widgetParams = convertData(data, params, editMode);

    var display = true;
    if (!editMode && widgetParams['__display__']) {
      display = eval(widgetParams['__display__']);
    }

    // 初始化不会跟随data改变而改变的东西
    _this.state = {
      childrenCells: (params.childrenCells || []).map(function (key) {
        return cells[key];
      }),
      events: _this.getEvents(params.events),
      widgetParams: widgetParams,
      display: display, widgetDisplay: display
    };
    return _this;
  }

  (0, _createClass3.default)(Cell, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var newState = {};
      if (nextProps.cells !== this.props.cells || nextProps.params !== this.props.params) {
        newState['childrenCells'] = (nextProps.params.childrenCells || []).map(function (key) {
          return nextProps.cells[key];
        });
      }
      if (nextProps.params && this.props.params && nextProps.params.events !== this.props.params.events) {
        newState['events'] = this.getEvents(nextProps.params.events);
      }
      if (nextProps.data !== this.props.data || nextProps.params !== this.props.params) {
        var oldParams = this.state.widgetParams;
        var newParams = convertData(nextProps.data, nextProps.params);
        if (!shallowEqual(oldParams, newParams)) {
          newState['widgetParams'] = newParams;
        }

        if (!nextProps.editMode && newParams['__display__']) {
          var data = nextProps.data;
          var display = eval(newParams['__display__']);
          if (display != this.state.display) {
            newState['widgetDisplay'] = display;
            var animed = newParams.animate && newParams.animate.active;

            if (display || !animed) {
              newState['display'] = display;
            }
          }
        }
      }
      if (Object.keys(newState).length > 0) {
        this.setState(newState);
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.editMode) {
        return true;
      }
      // 在运行模式只有state变化时才刷新
      if (nextState != this.state) {
        return true;
      }
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          selected = _props2.selected,
          _props2$params = _props2.params,
          params = _props2$params === undefined ? {} : _props2$params,
          data = _props2.data,
          cellKey = _props2.cellKey,
          editMode = _props2.editMode,
          wrapStyle = _props2.wrapStyle,
          widgetWrap = _props2.widgetWrap,
          dispatchData = _props2.dispatchData,
          removeCell = _props2.removeCell,
          selectCell = _props2.selectCell,
          copyCell = _props2.copyCell,
          onSettings = _props2.onSettings,
          extraProps = (0, _objectWithoutProperties3.default)(_props2, ['selected', 'params', 'data', 'cellKey', 'editMode', 'wrapStyle', 'widgetWrap', 'dispatchData', 'removeCell', 'selectCell', 'copyCell', 'onSettings']);

      // is should display

      if (!this.state.display) {
        return null;
      }

      var animed = params.animate && params.animate.active;
      var Widget = _xadminCore.app.load_dict('dashboard_widgets')[params.type] || MissWidgetType;
      var style = (0, _extends3.default)({ height: '100%', padding: 0, position: 'relative', userSelect: 'none' }, wrapStyle);
      var cellSelected = selected && editMode;

      if (cellSelected) {
        style['boxShadow'] = '0px 0px 1px #f00';
      }
      var widgetParams = this.state.widgetParams;

      var canSelect = Widget.CanSelect || !Widget.Container;
      var wrapId = 'dashboard-cell-wrap-' + cellKey.replace(/[\/\.]/g, '_');
      var cellStyle = widgetParams.style ? _react2.default.createElement(
        'style',
        { scope: true },
        _transformSheet(widgetParams.style, wrapId)
      ) : null;
      var typeClassName = 'dashboard-widget-' + params.type.replace(/[\/\.]/g, '_');
      var wrapClassName = ['dashboard-cell-wrap', typeClassName].join(' ');

      var wrap = widgetWrap || function (widget) {
        return editMode ? _react2.default.createElement(
          'div',
          { id: wrapId, className: wrapClassName, style: style },
          cellSelected && _react2.default.createElement(ControlBar, { onRemove: function onRemove() {
              return removeCell(cellKey);
            }, onCopy: function onCopy() {
              return copyCell(cellKey);
            }, cellKey: cellKey }),
          canSelect ? _react2.default.createElement(
            'div',
            { onClick: function onClick() {
                return editMode && selectCell(cellKey);
              }, style: { height: '100%' } },
            widget
          ) : widget,
          cellStyle
        ) : _react2.default.createElement(
          'div',
          { id: wrapId, className: wrapClassName, style: style },
          animed ? _react2.default.createElement(
            _Animate2.default,
            (0, _extends3.default)({ id: wrapId + '-anim' }, params.animate, {
              show: _this2.state.widgetDisplay,
              onExited: function onExited() {
                return _this2.setState({ display: false });
              }
            }),
            widget
          ) : widget,
          cellStyle
        );
      };

      return wrap(Widget ? _react2.default.createElement(Widget, (0, _extends3.default)({ key: cellKey, cellKey: cellKey, editMode: editMode,
        childrenCells: this.state.childrenCells, events: this.state.events, dispatchData: dispatchData
      }, extraProps, widgetParams)) : _react2.default.createElement(
        'div',
        null,
        '\u6CA1\u6709\u627E\u5230\u7EC4\u4EF6\u7C7B\u578B ',
        params.type,
        ' '
      ));
    }
  }]);
  return Cell;
}(_react2.default.Component)) || _class);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.getEvents = function (events) {
    var _props3 = _this3.props,
        data = _props3.data,
        dispatchData = _props3.dispatchData;

    var es = {};
    if (events) {
      es = Object.keys(events).reduce(function (prev, eventName) {
        prev[eventName] = function (data, func) {
          return function (e, args) {
            var result = eval('result = ' + func);
            if (result && _lodash2.default.isPlainObject(result)) {
              dispatchData(result);
            }
          };
        }(data, events[eventName]);
        return prev;
      }, {});
    }
    return es;
  };
};

exports.default = Cell;

/***/ }),

/***/ "../../xadmin-dashboard/src/components/Dashboard.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

var _Root = __webpack_require__("../../xadmin-dashboard/src/components/Root.js");

var _Root2 = _interopRequireDefault(_Root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dashboard = (0, _wrap2.default)('dashboard.view')(_react2.default.createClass({
  displayName: 'Dashboard',
  renderContent: function renderContent() {
    var _props = this.props,
        params = _props.params,
        scale = _props.scale,
        cells = _props.cells,
        _props$editMode = _props.editMode,
        editMode = _props$editMode === undefined ? true : _props$editMode;
    var _params$background = params.background,
        background = _params$background === undefined ? 'transparent' : _params$background,
        _params$height = params.height,
        height = _params$height === undefined ? 1080 : _params$height,
        _params$width = params.width,
        width = _params$width === undefined ? 'auto' : _params$width;

    var childrenCells = Object.keys(cells).filter(function (key) {
      return cells[key].parent == _Root2.default.key;
    });

    var style = { position: 'relative', height: height, width: width, background: background };
    if (!editMode) {
      style['overflow'] = 'hidden';
    }
    if (scale) {
      style['transform'] = 'scale(' + scale + ')';
    }
    var Main = _Root2.default.getWidget();

    return _react2.default.createElement(Main, { className: 'dashboard', editMode: editMode, style: style, cellKey: _Root2.default.key, childrenCells: childrenCells });
  },
  render: function render() {
    var _props$params = this.props.params,
        _props$params$height = _props$params.height,
        height = _props$params$height === undefined ? 1080 : _props$params$height,
        _props$params$width = _props$params.width,
        width = _props$params$width === undefined ? 'auto' : _props$params$width;

    return _react2.default.createElement(
      'div',
      { className: 'dashboard', style: { width: width, height: height, margin: '0 auto' } },
      this.renderContent()
    );
  }
}));

exports.default = Dashboard;

/***/ }),

/***/ "../../xadmin-dashboard/src/components/Root.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _Box = __webpack_require__("../../xadmin-dashboard/src/containers/Box.js");

var _Box2 = _interopRequireDefault(_Box);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  key: 'root',
  getWidget: function getWidget() {
    return _xadminCore.app.load_dict('dashboard_widgets')['xadmin-dashboard/main'] || _Box2.default;
  }
};

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/Box.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Box = (_dec = (0, _wrap2.default)('dashboard.container'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Box, _React$Component);

  function Box() {
    (0, _classCallCheck3.default)(this, Box);
    return (0, _possibleConstructorReturn3.default)(this, (Box.__proto__ || Object.getPrototypeOf(Box)).apply(this, arguments));
  }

  (0, _createClass3.default)(Box, [{
    key: 'generateDOM',
    value: function generateDOM() {
      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode,
          selectedChild = _props.selectedChild,
          cellKey = _props.cellKey;

      var style = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

      var children = childrenCells.filter(function (key) {
        return !editMode || key != selectedChild;
      }).map(function (key) {
        return _react2.default.createElement(_Cell2.default, { key: 'box-child-' + key, cellKey: key, editMode: editMode, widgetProps: widgetProps, wrapStyle: (0, _extends3.default)({}, style, editMode && selectedChild ? { opacity: 0.3 } : {}) });
      });
      if (editMode && selectedChild) {
        children.push(_react2.default.createElement(_Cell2.default, { key: 'box-child-' + selectedChild, cellKey: selectedChild, editMode: editMode, widgetProps: widgetProps, wrapStyle: style }));
      }
      return children;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey,
          style = _props2.style;

      return _react2.default.createElement(
        'div',
        { key: 'layer-' + cellKey + '-Box', className: 'dashboard-container dashboard-container-box', style: (0, _extends3.default)({ height: '100%', position: 'relative' }, style) },
        this.generateDOM()
      );
    }
  }]);
  return Box;
}(_react2.default.Component)) || _class);


Box.Title = '盒子容器';
Box.Category = '容器组件';
Box.Container = true;

Box.ParamSchema = {
  type: 'object',
  properties: {}
};

Box.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return state;
  }
  return state;
};

exports.default = Box;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/Flex.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/defineProperty.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends5 = _interopRequireDefault(_extends4);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Flex = (_dec = (0, _wrap2.default)('dashboard.container'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Flex, _React$Component);

  function Flex() {
    (0, _classCallCheck3.default)(this, Flex);
    return (0, _possibleConstructorReturn3.default)(this, (Flex.__proto__ || Object.getPrototypeOf(Flex)).apply(this, arguments));
  }

  (0, _createClass3.default)(Flex, [{
    key: 'generateDOM',
    value: function generateDOM() {
      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode,
          _props$layout = _props.layout,
          layout = _props$layout === undefined ? {} : _props$layout;


      return childrenCells.map(function (key) {
        var _ref = layout[key] || {},
            _ref$width = _ref.width,
            width = _ref$width === undefined ? 'auto' : _ref$width,
            _ref$height = _ref.height,
            height = _ref$height === undefined ? 'auto' : _ref$height,
            _ref$order = _ref.order,
            order = _ref$order === undefined ? 0 : _ref$order,
            _ref$flexGrow = _ref.flexGrow,
            flexGrow = _ref$flexGrow === undefined ? 0 : _ref$flexGrow,
            _ref$flexShrink = _ref.flexShrink,
            flexShrink = _ref$flexShrink === undefined ? 1 : _ref$flexShrink,
            _ref$flexBasis = _ref.flexBasis,
            flexBasis = _ref$flexBasis === undefined ? 'auto' : _ref$flexBasis,
            _ref$alignSelf = _ref.alignSelf,
            alignSelf = _ref$alignSelf === undefined ? 'auto' : _ref$alignSelf;

        return _react2.default.createElement(
          'div',
          { style: {
              width: width,
              height: height,
              order: order,
              flexGrow: flexGrow,
              flexShrink: flexShrink,
              flexBasis: flexBasis,
              alignSelf: alignSelf
            } },
          _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey,
          _props2$flexDirection = _props2.flexDirection,
          flexDirection = _props2$flexDirection === undefined ? 'row' : _props2$flexDirection,
          _props2$flexWrap = _props2.flexWrap,
          flexWrap = _props2$flexWrap === undefined ? 'wrap' : _props2$flexWrap,
          _props2$justifyConten = _props2.justifyContent,
          justifyContent = _props2$justifyConten === undefined ? 'flex-start' : _props2$justifyConten,
          _props2$alignItems = _props2.alignItems,
          alignItems = _props2$alignItems === undefined ? 'flex-start' : _props2$alignItems,
          _props2$alignContent = _props2.alignContent,
          alignContent = _props2$alignContent === undefined ? 'flex-start' : _props2$alignContent;


      var style = {
        height: '100%',
        display: 'flex',
        flexDirection: flexDirection,
        flexWrap: flexWrap,
        justifyContent: justifyContent,
        alignItems: alignItems,
        alignContent: alignContent
      };

      return _react2.default.createElement(
        'div',
        { style: style, key: 'container-' + cellKey + '-Flow', className: 'dashboard-container dashboard-container-flow' },
        this.generateDOM()
      );
    }
  }]);
  return Flex;
}(_react2.default.Component)) || _class);


Flex.Title = 'Flex布局容器';
Flex.Category = '容器组件';
Flex.Container = true;

Flex.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    var layout = (0, _extends5.default)({
      width: 100,
      height: 100
    }, action.layout);
    return (0, _extends5.default)({}, state, {
      layout: (0, _extends5.default)({}, state.layout || {}, (0, _defineProperty3.default)({}, action.key, layout))
    });
  } else if (action.type == '@@x-dashboard/REMOVE_CELL') {
    return (0, _extends5.default)({}, state, {
      layout: (0, _extends5.default)({}, _lodash2.default.omit(state.layout, action.key))
    });
  }
  return state;
};

Flex.ParamSchema = {
  type: 'object',
  properties: {
    flexDirection: {
      type: 'string',
      title: '排列方向',
      enum: ['row', 'row-reverse', 'column', 'column-reverse'],
      enum_title: ['水平方向，起点在左端', '水平方向，起点在右端', '垂直方向，起点在上沿', '垂直方向，起点在下沿']
    },
    flexWrap: {
      type: 'string',
      title: '换行方式',
      enum: ['nowrap', 'wrap', 'wrap-reverse'],
      enum_title: ['不换行', '换行', '向上换行']
    },
    justifyContent: {
      type: 'string',
      title: '主轴对齐',
      enum: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
      enum_title: ['左对齐', '右对齐', '居中', '两端对齐', '两侧的间隔相等']
    },
    alignItems: {
      type: 'string',
      title: '交叉轴对齐',
      enum: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      enum_title: ['起点对齐', '终点对齐', '中点对齐', '文字基线对齐', '占满容器']
    },
    alignContent: {
      type: 'string',
      title: '多轴对齐',
      enum: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
      enum_title: ['左对齐', '右对齐', '居中', '两端对齐', '两侧的间隔相等', '占满容器']
    }
  }
};

Flex.LayoutSchema = {
  type: 'object',
  properties: {
    width: {
      title: '宽',
      type: 'string'
    },
    height: {
      title: '高',
      type: 'string'
    },
    order: {
      title: '排列顺序',
      type: 'number'
    },
    flexGrow: {
      title: '放大比例',
      type: 'number'
    },
    flexShrink: {
      title: '缩小比例',
      type: 'number'
    },
    flexBasis: {
      title: '占据主轴空间',
      type: 'string'
    },
    alignSelf: {
      type: 'string',
      title: '对齐方式',
      enum: ['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      enum_title: ['自动', '起点对齐', '终点对齐', '中点对齐', '文字基线对齐', '占满容器']
    }
  }
};

Flex.getChildLayout = function (state, key) {
  return (state.layout || {})[key];
};
Flex.saveChildLayout = function (state, key, values) {
  var layout = state.layout || {};
  return {
    layout: (0, _extends5.default)({}, layout, (0, _defineProperty3.default)({}, key, (0, _extends5.default)({}, layout[key], values)))
  };
};

exports.default = Flex;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/FreeBox.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/defineProperty.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends5 = _interopRequireDefault(_extends4);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactRnd = __webpack_require__("../../xadmin-dashboard/node_modules/react-rnd/lib/index.js");

var _reactRnd2 = _interopRequireDefault(_reactRnd);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FreeBox = (_dec = (0, _wrap2.default)('dashboard.container'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(FreeBox, _React$Component);

  function FreeBox() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, FreeBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = FreeBox.__proto__ || Object.getPrototypeOf(FreeBox)).call.apply(_ref, [this].concat(args))), _this), _this.onResize = function (key, ele) {
      var _this$props$layout = _this.props.layout,
          layout = _this$props$layout === undefined ? {} : _this$props$layout;

      layout[key] = (0, _extends5.default)({}, layout[key] || {}, {
        width: ele.clientWidth, height: ele.clientHeight
      });
      _this.props.mergeParams({ layout: layout });
    }, _this.onDrag = function (key, _ref2) {
      var x = _ref2.x,
          y = _ref2.y;
      var _this$props$layout2 = _this.props.layout,
          layout = _this$props$layout2 === undefined ? {} : _this$props$layout2;

      layout[key] = (0, _extends5.default)({}, layout[key] || {}, {
        x: x, y: y
      });
      _this.props.mergeParams({ layout: layout });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(FreeBox, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return this.props.editMode;
    }
  }, {
    key: 'generateDOM',
    value: function generateDOM() {
      var _this2 = this;

      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode,
          selectedCell = _props.selectedCell,
          selectedChild = _props.selectedChild,
          cellKey = _props.cellKey,
          resizeGrid = _props.resizeGrid,
          dragGrid = _props.dragGrid,
          _props$layout = _props.layout,
          layout = _props$layout === undefined ? {} : _props$layout;


      if (editMode) {
        var dnrProps = {};
        if (resizeGrid) {
          dnrProps['resizeGrid'] = [resizeGrid.x, resizeGrid.y];
        }
        if (dragGrid) {
          dnrProps['dragGrid'] = [dragGrid.x, dragGrid.y];
        }
        return childrenCells.map(function (key) {
          return _react2.default.createElement(
            _reactRnd2.default,
            (0, _extends5.default)({
              'default': {
                x: 50,
                y: 50,
                width: 100,
                height: 100
              },
              size: (0, _extends5.default)({}, layout[key]),
              position: (0, _extends5.default)({}, layout[key]),
              style: { pointerEvents: 'auto' },
              bounds: 'parent',
              onResizeStop: function onResizeStop(e, direction, ele, delta) {
                return _this2.onResize(key, ele);
              },
              onDragStop: function onDragStop(e, data) {
                return _this2.onDrag(key, data);
              },
              disableDragging: selectedCell != selectedChild
            }, dnrProps),
            _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
          );
        });
      } else {
        return childrenCells.map(function (key) {
          return _react2.default.createElement(
            'div',
            { style: (0, _extends5.default)({ position: 'absolute' }, {
                left: layout[key].x !== undefined ? layout[key].x : 50,
                top: layout[key].y !== undefined ? layout[key].y : 50,
                width: layout[key].width !== undefined ? layout[key].width : 100,
                height: layout[key].height !== undefined ? layout[key].height : 100
              }) },
            _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
          );
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey,
          style = _props2.style;

      return _react2.default.createElement(
        'div',
        { key: 'layer-' + cellKey + '-FreeBox', style: { height: '100%', position: 'relative' }, className: 'dashboard-container dashboard-container-freebox' },
        this.generateDOM()
      );
    }
  }]);
  return FreeBox;
}(_react2.default.Component)) || _class);


FreeBox.Title = '自由容器';
FreeBox.Category = '容器组件';
FreeBox.Container = true;

FreeBox.ParamSchema = {
  type: 'object',
  properties: {
    resizeGrid: {
      title: '尺寸栅格',
      type: 'object',
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        }
      }
    },
    dragGrid: {
      title: '拖拽栅格',
      type: 'object',
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        }
      }
    }
  }
};

FreeBox.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    var layout = (0, _extends5.default)({
      x: 50,
      y: 50,
      width: 100,
      height: 100
    }, action.layout);
    if (action.copyFrom && state.layout && state.layout[action.copyFrom]) {
      var c = state.layout[action.copyFrom];
      layout = (0, _extends5.default)({}, c, { x: c.x + 10, y: c.y + 10 });
    }
    return (0, _extends5.default)({}, state, {
      layout: (0, _extends5.default)({}, state.layout || {}, (0, _defineProperty3.default)({}, action.key, layout))
    });
  } else if (action.type == '@@x-dashboard/REMOVE_CELL') {
    return (0, _extends5.default)({}, state, {
      layout: (0, _extends5.default)({}, _lodash2.default.omit(state.layout, action.key))
    });
  }
  return state;
};

FreeBox.LayoutSchema = {
  type: 'object',
  properties: {
    x: {
      title: 'X坐标',
      type: 'number'
    },
    y: {
      title: 'Y坐标',
      type: 'number'
    },
    width: {
      title: '宽',
      type: 'number'
    },
    height: {
      title: '高',
      type: 'number'
    }
  }
};

FreeBox.getChildLayout = function (state, key) {
  return (state.layout || {})[key];
};
FreeBox.saveChildLayout = function (state, key, values) {
  var layout = state.layout || {};
  return {
    layout: (0, _extends5.default)({}, layout, (0, _defineProperty3.default)({}, key, (0, _extends5.default)({}, layout[key], values)))
  };
};

exports.default = FreeBox;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/Grid.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactGridLayout = __webpack_require__("../../xadmin-dashboard/node_modules/react-grid-layout/index.js");

var _reactGridLayout2 = _interopRequireDefault(_reactGridLayout);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout2.default);

var Grid = (_dec = (0, _wrap2.default)('dashboard.container'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Grid, _React$Component);

  function Grid() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Grid);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Grid.__proto__ || Object.getPrototypeOf(Grid)).call.apply(_ref, [this].concat(args))), _this), _this.getLayerProps = function () {
      var _this$props = _this.props,
          _this$props$cols = _this$props.cols,
          cols = _this$props$cols === undefined ? 36 : _this$props$cols,
          _this$props$yheight = _this$props.yheight,
          yheight = _this$props$yheight === undefined ? 10 : _this$props$yheight,
          _this$props$margin = _this$props.margin,
          margin = _this$props$margin === undefined ? 15 : _this$props$margin,
          _this$props$gridMargi = _this$props.gridMargin,
          gridMargin = _this$props$gridMargi === undefined ? 0 : _this$props$gridMargi,
          _this$props$verticalF = _this$props.verticalFree,
          verticalFree = _this$props$verticalF === undefined ? false : _this$props$verticalF,
          layout = _this$props.layout,
          editMode = _this$props.editMode,
          selectedCell = _this$props.selectedCell,
          selectedChild = _this$props.selectedChild;

      return (0, _extends3.default)({
        className: 'layout',
        style: { margin: -1 * gridMargin },
        margin: [margin, margin],
        draggableHandle: '.widget-ctl-bar',
        cols: cols,
        rowHeight: yheight,
        verticalCompact: !verticalFree
      }, editMode && selectedCell == selectedChild ? {} : {
        isDraggable: false,
        isResizable: false
      }, {
        onLayoutChange: function onLayoutChange() {}
      });
    }, _this.layoutChange = function (layout) {
      _this.props.mergeParams({ layout: layout });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Grid, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return this.props.editMode;
    }
  }, {
    key: 'generateDOM',
    value: function generateDOM() {
      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode;

      return childrenCells.map(function (key) {
        return _react2.default.createElement(
          'div',
          { key: key },
          _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          _props2$layout = _props2.layout,
          layout = _props2$layout === undefined ? [] : _props2$layout,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey;

      return _react2.default.createElement(
        'div',
        { className: 'dashboard-container dashboard-container-grid' },
        _react2.default.createElement(
          GridLayout,
          (0, _extends3.default)({
            key: 'layer-' + cellKey + '-grid'
          }, this.getLayerProps(), {
            layout: layout,
            onLayoutChange: function onLayoutChange(layout) {
              return _this2.layoutChange(layout);
            }
          }),
          this.generateDOM()
        )
      );
    }
  }]);
  return Grid;
}(_react2.default.Component)) || _class);


Grid.Title = '栅格容器';
Grid.Category = '容器组件';
Grid.Container = true;

Grid.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'number'
    },
    yheight: {
      title: '行高度',
      type: 'number'
    },
    margin: {
      title: '间距',
      type: 'number'
    },
    gridMargin: {
      title: '容器外间距',
      type: 'number'
    },
    verticalFree: {
      title: '自由摆放',
      type: 'boolean'
    }
  }
};

Grid.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return (0, _extends3.default)({}, state, {
      layout: [].concat((0, _toConsumableArray3.default)(state.layout || []), [(0, _extends3.default)({ i: action.key, x: 0, y: 0, w: 4, h: 4 }, action.layout)])
    });
  } else if (action.type == '@@x-dashboard/REMOVE_CELL') {
    return (0, _extends3.default)({}, state, {
      layout: state.layout.filter(function (l) {
        return l.i !== action.key;
      })
    });
  }
  return state;
};

exports.default = Grid;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/PanelGroup.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PanelGroupContainer = function (_React$Component) {
  (0, _inherits3.default)(PanelGroupContainer, _React$Component);

  function PanelGroupContainer(props) {
    (0, _classCallCheck3.default)(this, PanelGroupContainer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PanelGroupContainer.__proto__ || Object.getPrototypeOf(PanelGroupContainer)).call(this));

    _this.handleSelect = function (activeKey) {
      _this.setState({ activeKey: activeKey });
    };

    _this.onClickSubHeader = function (e, subHeader, index) {
      var events = _this.props.events;

      if (events && events.onClickSubHeader) {
        events.onClickSubHeader(e, { subHeader: subHeader, index: index });
        e.stopPropagation();
      }
    };

    var defaultPanel = props.defaultPanel === undefined ? 1 : props.defaultPanel;
    _this.state = {
      activeKey: 'panel-' + (defaultPanel - 1)
    };
    return _this;
  }

  (0, _createClass3.default)(PanelGroupContainer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$accordion = _props.accordion,
          accordion = _props$accordion === undefined ? true : _props$accordion,
          _props$headers = _props.headers,
          headers = _props$headers === undefined ? [] : _props$headers,
          _props$subHeaders = _props.subHeaders,
          subHeaders = _props$subHeaders === undefined ? [] : _props$subHeaders,
          _props$defaultPanel = _props.defaultPanel,
          defaultPanel = _props$defaultPanel === undefined ? 1 : _props$defaultPanel,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode,
          cellKey = _props.cellKey;

      return _react2.default.createElement(
        _reactBootstrap.PanelGroup,
        { key: 'container-' + cellKey + '-PanelGroup', className: 'dashboard-container dashboard-container-panelgroup',
          accordion: accordion,
          onSelect: this.handleSelect,
          activeKey: this.state.activeKey },
        childrenCells.map(function (cellKey, index) {
          return _react2.default.createElement(
            _reactBootstrap.Panel,
            { className: 'panel-' + index == _this2.state.activeKey ? 'active' : '', header: _react2.default.createElement(
                'span',
                null,
                headers[index] || '\u9762\u677F' + (index + 1),
                subHeaders[index] ? _react2.default.createElement(
                  'span',
                  { onClick: function onClick(e) {
                      return _this2.onClickSubHeader(e, subHeaders[index], index);
                    }, className: 'sub-header' },
                  subHeaders[index]
                ) : null
              ), eventKey: 'panel-' + index },
            _react2.default.createElement(_Cell2.default, { cellKey: cellKey, editMode: editMode, widgetProps: widgetProps })
          );
        })
      );
    }
  }]);
  return PanelGroupContainer;
}(_react2.default.Component);

PanelGroupContainer.Title = '面板组容器';
PanelGroupContainer.Category = '容器组件';
PanelGroupContainer.Container = true;

PanelGroupContainer.ParamSchema = {
  type: 'object',
  properties: {
    accordion: {
      type: 'boolean',
      title: '手风琴效果'
    },
    headers: {
      type: 'array',
      title: '面板标题',
      items: {
        type: 'string'
      }
    },
    subHeaders: {
      type: 'array',
      title: '面板副标题',
      items: {
        type: 'string'
      }
    },
    defaultPanel: {
      type: 'number',
      title: '默认展开面板'
    }
  }
};

PanelGroupContainer.EventSchema = {
  type: 'object',
  properties: {
    onClickSubHeader: {
      type: 'string',
      title: '副标题点击事件'
    }
  }
};

exports.default = PanelGroupContainer;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/ReFlex.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

__webpack_require__("../../xadmin-dashboard/node_modules/react-reflex/styles.css");

var _reactReflex = __webpack_require__("../../xadmin-dashboard/node_modules/react-reflex/dist/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Flex = function (_React$Component) {
  (0, _inherits3.default)(Flex, _React$Component);

  function Flex() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Flex);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Flex.__proto__ || Object.getPrototypeOf(Flex)).call.apply(_ref, [this].concat(args))), _this), _this.onStopResize = function (e) {
      console.log(e);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Flex, [{
    key: 'generateDOM',
    value: function generateDOM() {
      var _this2 = this;

      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          _props$orientation = _props.orientation,
          orientation = _props$orientation === undefined ? 'vertical' : _props$orientation,
          editMode = _props.editMode;

      var children = [];
      childrenCells.forEach(function (key, index) {
        children.push(_react2.default.createElement(
          _reactReflex.ReflexElement,
          null,
          _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
        ));
        if (editMode && index !== childrenCells.length - 1) {
          children.push(_react2.default.createElement(_reactReflex.ReflexSplitter, { propagate: true, onStopResize: _this2.onStopResize }));
        }
      });
      return _react2.default.createElement(
        _reactReflex.ReflexContainer,
        { orientation: orientation },
        children
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey;

      return _react2.default.createElement(
        'div',
        { key: 'container-' + cellKey + '-Flow', className: 'dashboard-container dashboard-container-flow', style: { height: '100%' } },
        this.generateDOM()
      );
    }
  }]);
  return Flex;
}(_react2.default.Component);

// then you can import the components


Flex.Title = '流布局容器';
Flex.Category = '容器组件';
Flex.Container = true;

Flex.ParamSchema = {
  type: 'object',
  properties: {
    orientation: {
      type: 'string',
      title: '方向',
      enum: ['vertical', 'horizontal'],
      enum_title: ['水平', '垂直']
    }
  }
};

exports.default = Flex;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/Responsive.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactGridLayout = __webpack_require__("../../xadmin-dashboard/node_modules/react-grid-layout/index.js");

var _reactGridLayout2 = _interopRequireDefault(_reactGridLayout);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GridLayout = (0, _reactGridLayout.WidthProvider)(_reactGridLayout.Responsive);

var Grid = function (_React$Component) {
  (0, _inherits3.default)(Grid, _React$Component);

  function Grid() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Grid);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Grid.__proto__ || Object.getPrototypeOf(Grid)).call.apply(_ref, [this].concat(args))), _this), _this.getLayerProps = function () {
      var _this$props = _this.props,
          _this$props$cols = _this$props.cols,
          cols = _this$props$cols === undefined ? {} : _this$props$cols,
          _this$props$yheight = _this$props.yheight,
          yheight = _this$props$yheight === undefined ? 10 : _this$props$yheight,
          _this$props$margin = _this$props.margin,
          margin = _this$props$margin === undefined ? 15 : _this$props$margin,
          _this$props$gridMargi = _this$props.gridMargin,
          gridMargin = _this$props$gridMargi === undefined ? 0 : _this$props$gridMargi,
          _this$props$verticalF = _this$props.verticalFree,
          verticalFree = _this$props$verticalF === undefined ? false : _this$props$verticalF,
          layout = _this$props.layout,
          editMode = _this$props.editMode;

      return (0, _extends3.default)({
        className: 'layout',
        style: { margin: -1 * gridMargin },
        margin: [margin, margin],
        draggableHandle: '.widget-ctl-bar',
        cols: (0, _extends3.default)({ lg: 36, md: 36, sm: 24, xs: 12, xxs: 6 }, cols),
        rowHeight: yheight,
        verticalCompact: !verticalFree
      }, editMode ? {} : {
        isDraggable: false,
        isResizable: false
      }, {
        onLayoutChange: function onLayoutChange() {}
      });
    }, _this.layoutChange = function (layouts) {
      _this.props.mergeParams({ layouts: layouts });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Grid, [{
    key: 'generateDOM',
    value: function generateDOM() {
      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode;

      return childrenCells.map(function (key) {
        return _react2.default.createElement(
          'div',
          { key: key },
          _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey;

      return _react2.default.createElement(
        'div',
        { className: 'dashboard-container dashboard-container-grid' },
        _react2.default.createElement(
          GridLayout,
          (0, _extends3.default)({
            key: 'layer-' + cellKey + '-grid'
          }, this.getLayerProps(), {
            layouts: layouts,
            onLayoutChange: function onLayoutChange(layout, layouts) {
              return _this2.layoutChange(layouts);
            }
          }),
          this.generateDOM()
        )
      );
    }
  }]);
  return Grid;
}(_react2.default.Component);

Grid.Title = '响应式容器';
Grid.Category = '容器组件';
Grid.Container = true;

Grid.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'object',
      properties: {
        lg: {
          title: 'LG',
          type: 'number'
        },
        md: {
          title: 'MD',
          type: 'number'
        },
        sm: {
          title: 'SM',
          type: 'number'
        },
        xs: {
          title: 'XS',
          type: 'number'
        },
        xxs: {
          title: 'XXS',
          type: 'number'
        }
      }
    },
    yheight: {
      title: '行高度',
      type: 'number'
    },
    margin: {
      title: '间距',
      type: 'number'
    },
    gridMargin: {
      title: '容器外间距',
      type: 'number'
    },
    verticalFree: {
      title: '自由摆放',
      type: 'boolean'
    }
  }
};

Grid.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return (0, _extends3.default)({}, state, {
      layouts: (0, _extends3.default)({}, state.layouts, {
        lg: [].concat((0, _toConsumableArray3.default)(state.layouts && state.layouts.lg || []), [{ i: action.key, x: 0, y: 0, w: 4, h: 4 }])
      })
    });
  }
  return state;
};

exports.default = Grid;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/Table.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table = function (_React$Component) {
  (0, _inherits3.default)(Table, _React$Component);

  function Table() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Table);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Table.__proto__ || Object.getPrototypeOf(Table)).call.apply(_ref, [this].concat(args))), _this), _this.layoutChange = function (layouts) {
      _this.props.mergeParams({ layouts: layouts });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Table, [{
    key: 'generateDOM',
    value: function generateDOM() {
      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode;

      return childrenCells.map(function (key) {
        return _react2.default.createElement(
          'div',
          { key: key },
          _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps })
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          layouts = _props2.layouts,
          editMode = _props2.editMode,
          cellKey = _props2.cellKey;

      return _react2.default.createElement(
        'table',
        {
          className: 'dashboard-container dashboard-container-table',
          key: 'layer-' + cellKey + '-Table'
        },
        this.generateDOM()
      );
    }
  }]);
  return Table;
}(_react2.default.Component);

Table.Title = '表格容器';
Table.Category = '容器组件';
Table.Container = true;

Table.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'number'
    },
    rows: {
      title: '行数',
      type: 'number'
    }
  }
};

Table.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return state;
  }
  return state;
};

exports.default = Table;

/***/ }),

/***/ "../../xadmin-dashboard/src/containers/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Grid = __webpack_require__("../../xadmin-dashboard/src/containers/Grid.js");

var _Grid2 = _interopRequireDefault(_Grid);

var _Flex = __webpack_require__("../../xadmin-dashboard/src/containers/Flex.js");

var _Flex2 = _interopRequireDefault(_Flex);

var _ReFlex = __webpack_require__("../../xadmin-dashboard/src/containers/ReFlex.js");

var _ReFlex2 = _interopRequireDefault(_ReFlex);

var _Box = __webpack_require__("../../xadmin-dashboard/src/containers/Box.js");

var _Box2 = _interopRequireDefault(_Box);

var _FreeBox = __webpack_require__("../../xadmin-dashboard/src/containers/FreeBox.js");

var _FreeBox2 = _interopRequireDefault(_FreeBox);

var _Table = __webpack_require__("../../xadmin-dashboard/src/containers/Table.js");

var _Table2 = _interopRequireDefault(_Table);

var _Responsive = __webpack_require__("../../xadmin-dashboard/src/containers/Responsive.js");

var _Responsive2 = _interopRequireDefault(_Responsive);

var _PanelGroup = __webpack_require__("../../xadmin-dashboard/src/containers/PanelGroup.js");

var _PanelGroup2 = _interopRequireDefault(_PanelGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  'xadmin-dashboard/container/grid': _Grid2.default,
  'xadmin-dashboard/container/flex': _Flex2.default,
  'xadmin-dashboard/container/box': _Box2.default,
  'xadmin-dashboard/container/freebox': _FreeBox2.default,
  'xadmin-dashboard/container/table': _Table2.default,
  'xadmin-dashboard/container/responsive': _Responsive2.default,
  'xadmin-dashboard/container/panelgroup': _PanelGroup2.default,
  'xadmin-dashboard/container/reflex': _ReFlex2.default,
  'xadmin-dashboard/main': _Box2.default
};

/***/ }),

/***/ "../../xadmin-dashboard/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dashboard = exports.DashboardWrap = undefined;

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _Dashboard = __webpack_require__("../../xadmin-dashboard/src/components/Dashboard.js");

var _Dashboard2 = _interopRequireDefault(_Dashboard);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _models = __webpack_require__("../../xadmin-dashboard/src/models.js");

var _models2 = _interopRequireDefault(_models);

var _mappers = __webpack_require__("../../xadmin-dashboard/src/mappers.js");

var _mappers2 = _interopRequireDefault(_mappers);

var _reducers = __webpack_require__("../../xadmin-dashboard/src/reducers.js");

var _reducers2 = _interopRequireDefault(_reducers);

var _widgets = __webpack_require__("../../xadmin-dashboard/src/widgets/index.js");

var _widgets2 = _interopRequireDefault(_widgets);

var _wrap = __webpack_require__("../../xadmin-dashboard/src/wrap.js");

var _wrap2 = _interopRequireDefault(_wrap);

__webpack_require__("../../xadmin-dashboard/node_modules/animate.css/animate.css");

__webpack_require__("../../xadmin-dashboard/src/main.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_lodash2.default.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

var routers = function routers(app) {
  return {
    '/app/dashboard/': [{
      path: 'show',
      component: function component(props) {
        return _react2.default.createElement(_Dashboard2.default, (0, _extends3.default)({}, props, { editMode: false }));
      }
    }]
  };
};

exports.DashboardWrap = _wrap2.default;
exports.Dashboard = _Dashboard2.default;
exports.default = {
  routers: routers,
  models: _models2.default,
  mappers: _mappers2.default,
  reducers: _reducers2.default,
  dashboard_widgets: _widgets2.default
};

/***/ }),

/***/ "../../xadmin-dashboard/src/main.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../xadmin-dashboard/src/main.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../../../node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../xadmin-dashboard/src/main.css", function() {
			var newContent = __webpack_require__("../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../xadmin-dashboard/src/main.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "../../xadmin-dashboard/src/mappers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _Root = __webpack_require__("../../xadmin-dashboard/src/components/Root.js");

var _Root2 = _interopRequireDefault(_Root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genCellKey = function genCellKey(type) {
  return type.replace(/[\/\,\.]/g, '_') + '_' + Math.random().toString(36).substr(4);
};

exports.default = {
  'dashboard.view': {
    data: function data(_ref) {
      var dashboard = _ref.dashboard;
      return {
        params: dashboard.params,
        cells: dashboard.cells,
        layouts: dashboard.layouts,
        selectedCell: dashboard.selectCell
      };
    },
    method: {
      addCell: function addCell(_ref2) {
        var dispatch = _ref2.dispatch,
            dashboard = _ref2.dashboard;
        return function (_ref3) {
          var key = _ref3.key,
              type = _ref3.type,
              params = _ref3.params;

          if (!dashboard.selectCell) {
            // 请选择容器
            dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
                type: 'danger', headline: '错误', message: '请选择容器'
              } });
            return;
          }
          var Container = null;
          if (dashboard.selectCell != _Root2.default.key) {
            if (!dashboard.cells[dashboard.selectCell]) {
              // 组件信息错误
              dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
                  type: 'danger', headline: '错误', message: '组件信息错误'
                } });
              return;
            }
            var container = dashboard.cells[dashboard.selectCell];
            Container = _xadminCore.app.load_dict('dashboard_widgets')[container.type];
          } else {
            Container = _Root2.default.getWidget();
          }

          if (!Container) {
            // 容器组件未定义
            dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
                type: 'danger', headline: '错误', message: '容器组件未定义'
              } });
            return;
          }
          if (!Container.Container) {
            // 请选择容器组件添加
            dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
                type: 'danger', headline: '错误', message: '请选择容器组件添加子组件'
              } });
            return;
          }

          dispatch({ dashboard: dashboard, type: '@@x-dashboard/ADD_CELL',
            key: key || genCellKey(type),
            params: (0, _extends3.default)({}, params, { type: type, parent: dashboard.selectCell
            }), Container: Container });
        };
      },
      selectCell: function selectCell(_ref4) {
        var dispatch = _ref4.dispatch,
            dashboard = _ref4.dashboard;
        return function (cellKey) {
          dispatch({ dashboard: dashboard, type: '@@x-dashboard/TRIGGER_SELECT_CELL', key: cellKey });
        };
      },
      moveCell: function moveCell(_ref5) {
        var dispatch = _ref5.dispatch,
            dashboard = _ref5.dashboard;
        return function (_ref6) {
          var info = _ref6.info,
              dropKey = _ref6.dropKey,
              dragKey = _ref6.dragKey,
              dropPos = _ref6.dropPos,
              dropPosition = _ref6.dropPosition;


          var drop = dashboard.cells[dropKey];
          var drag = dashboard.cells[dragKey];

          // 1. 不管任何情况，首先找到parent，如果是拖动节点上，parent就是节点，否则parent是drop.parent
          var parentKey = info.dropToGap ? drop.parent || 'root' : dropKey;
          var parent = dashboard.cells[parentKey];

          // 2. 如果parent变更，将拖动元素从老parent中删除，移入新parent
          if (parent && drag.parent != parentKey) {
            var Container = parentKey != _Root2.default.key ? _xadminCore.app.load_dict('dashboard_widgets')[parent.type] : _Root2.default.getWidget();
            // 先判断拖动到的这个节点是不是容器节点
            if (Container.Container) {
              var oldParent = dashboard.cells[drag.parent];
              // 从老parent中删除
              if (oldParent) {
                dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_CELL', key: drag.parent, params: (0, _extends3.default)({}, oldParent, { childrenCells: oldParent.childrenCells ? oldParent.childrenCells.filter(function (k) {
                      return k !== dragKey;
                    }) : []
                  }) });
              }
              // 移入新parent
              dispatch({ dashboard: dashboard, type: '@@x-dashboard/ADD_CELL',
                key: dragKey,
                params: (0, _extends3.default)({}, drag, { parent: parentKey
                }), Container: Container });
            }
          }

          // 3. 如果是拖动到间隙中，要处理排序
          if (info.dropToGap) {
            var ar = [].concat((0, _toConsumableArray3.default)(parent.childrenCells || []));
            ar = ar.filter(function (key) {
              return key !== dragKey;
            });
            var i = Math.max(0, ar.indexOf(dropKey));
            ar.splice(dropPosition === -1 ? i : i + 1, 0, dragKey);

            dispatch({ dashboard: dashboard, type: '@@x-dashboard/MERGE_CELL', key: parentKey, params: {
                childrenCells: ar
              } });

            dispatch({ dashboard: dashboard, type: '@@x-dashboard/SELECT_CELL', key: parentKey });
          }
        };
      },
      layoutChange: function layoutChange(_ref7) {
        var dispatch = _ref7.dispatch,
            dashboard = _ref7.dashboard;
        return function (_ref8) {
          var key = _ref8.key,
              layouts = _ref8.layouts;

          dispatch({ dashboard: dashboard, type: '@@x-dashboard/CHANGE_LAYOUTS', key: key, payload: layouts });
        };
      },
      saveParams: function saveParams(_ref9) {
        var dispatch = _ref9.dispatch,
            dashboard = _ref9.dashboard;
        return function (params) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_DASHBOARD', params: params });
        };
      },
      testData: function testData(_ref10) {
        var dispatch = _ref10.dispatch,
            dashboard = _ref10.dashboard;
        return function () {
          var cells = dashboard.cells;
          Object.keys(cells).map(function (key) {
            var cell = cells[key];
            var Widget = _xadminCore.app.load_dict('dashboard_widgets')[cell.type];
            if (Widget && Widget.sampleData) {
              Widget.sampleData(cell, function (key, data) {
                dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_DATA', key: key, data: data });
              });
            }
          });
        };
      }
    }
  },
  'dashboard.cell': {
    data: function data(_ref11, _ref12) {
      var dashboard = _ref11.dashboard;
      var key = _ref12.cellKey;
      return {
        data: dashboard.data,
        cells: dashboard.cells,
        params: dashboard.cells && dashboard.cells[key || dashboard.selectCell] || null,
        cellKey: key || dashboard.selectCell,
        selected: dashboard.selectCell == key
      };
    },
    method: {
      selectCell: function selectCell(_ref13) {
        var dispatch = _ref13.dispatch,
            dashboard = _ref13.dashboard;
        return function (cellKey) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/TRIGGER_SELECT_CELL', key: cellKey });
        };
      },

      removeCell: function removeCell(_ref14) {
        var dispatch = _ref14.dispatch,
            dashboard = _ref14.dashboard;
        return function (cellKey) {
          var Container = null;
          var params = dashboard.cells[cellKey];
          if (params.parent != _Root2.default.key) {
            if (dashboard.cells[params.parent]) {
              Container = _xadminCore.app.load_dict('dashboard_widgets')[dashboard.cells[params.parent].type];
            }
          } else {
            Container = _Root2.default.getWidget();
          }
          dispatch({ dashboard: dashboard, type: '@@x-dashboard/REMOVE_CELL', key: cellKey, Container: Container });
        };
      },

      copyCell: function copyCell(_ref15) {
        var dispatch = _ref15.dispatch,
            dashboard = _ref15.dashboard;
        return function (cell) {
          var params = dashboard.cells[cell];
          var parent = dashboard.cells[params.parent];

          var ContainerWidget = params.parent != _Root2.default.key ? _xadminCore.app.load_dict('dashboard_widgets')[parent.type] : _Root2.default.getWidget();

          dispatch({ dashboard: dashboard, type: '@@x-dashboard/ADD_CELL',
            key: genCellKey(params.type),
            copyFrom: cell,
            params: params, Widget: ContainerWidget });
        };
      },

      mergeParams: function mergeParams(_ref16, _ref17) {
        var dispatch = _ref16.dispatch,
            dashboard = _ref16.dashboard;
        var cellKey = _ref17.cellKey;
        return function (params) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params: params });
        };
      },

      updateData: function updateData(_ref18) {
        var dispatch = _ref18.dispatch,
            dashboard = _ref18.dashboard;
        return function (payload) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_ALL_DATA', payload: payload });
        };
      },

      dispatchData: function dispatchData(_ref19) {
        var dispatch = _ref19.dispatch,
            dashboard = _ref19.dashboard;
        return function (data) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_DATA', payload: data });
        };
      }
    }
  },
  'dashboard.form': {
    data: function data(_ref20, _ref21) {
      var dashboard = _ref20.dashboard;
      var key = _ref21.cellKey;
      return {
        data: dashboard.data,
        params: dashboard.cells && dashboard.cells[key || dashboard.selectCell] || null,
        cellKey: key || dashboard.selectCell
      };
    },
    method: {
      saveParams: function saveParams(_ref22, _ref23) {
        var dispatch = _ref22.dispatch,
            dashboard = _ref22.dashboard;
        var cellKey = _ref23.cellKey;
        return function (params) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_CELL', key: cellKey || dashboard.selectCell, params: params });
        };
      },

      saveEvents: function saveEvents(_ref24, _ref25) {
        var dispatch = _ref24.dispatch,
            dashboard = _ref24.dashboard;
        var cellKey = _ref25.cellKey;
        return function (events) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params: { events: events } });
        };
      },

      mergeParams: function mergeParams(_ref26, _ref27) {
        var dispatch = _ref26.dispatch,
            dashboard = _ref26.dashboard;
        var cellKey = _ref27.cellKey;
        return function (params) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/MERGE_CELL', key: cellKey || dashboard.selectCell, params: params });
        };
      }
    }
  },
  'dashboard.container': {
    data: function data(_ref28, _ref29) {
      var dashboard = _ref28.dashboard;
      var cellKey = _ref29.cellKey;
      return {
        selectedCell: dashboard.selectCell
      };
    },
    compute: function compute(_ref30, _ref31) {
      var dashboard = _ref30.dashboard;
      var cellKey = _ref31.cellKey;

      var findSelectedChild = function findSelectedChild(key) {
        var cell = dashboard.cells[key];
        if (cell) {
          if (cell.parent == cellKey) {
            return key;
          } else {
            return findSelectedChild(cell.parent);
          }
        } else {
          return null;
        }
      };
      return { selectedChild: findSelectedChild(dashboard.selectCell) };
    }
  },
  'dashboard.endpoint': {
    data: function data(_ref32) {
      var dashboard = _ref32.dashboard;
      return {
        endpoints: dashboard.endpoints
      };
    },
    method: {
      saveEndpoint: function saveEndpoint(_ref33) {
        var dispatch = _ref33.dispatch,
            dashboard = _ref33.dashboard;
        return function (payload) {
          return dispatch({ dashboard: dashboard, type: '@@x-dashboard/UPDATE_ENDPOINT', payload: payload });
        };
      }
    }
  }
};

/***/ }),

/***/ "../../xadmin-dashboard/src/models.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashboard = function dashboard(_ref) {
  var _t = _ref.context._t;
  return {
    name: 'dashboard',
    type: 'object',
    icon: 'dashboard',
    title: _t('Dashboard'),
    properties: {
      id: { type: 'string' },
      name: {
        type: 'string',
        title: _t('Dashboard Name')
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    list_display: ['name'],
    form: ['name'],
    required: ['name'],
    components: {}
  };
};

exports.default = function (app) {
  return {
    dashboard: dashboard(app)
  };
};

/***/ }),

/***/ "../../xadmin-dashboard/src/reducers.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/defineProperty.js");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends7 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends8 = _interopRequireDefault(_extends7);

var _toConsumableArray2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _redux = __webpack_require__("../../xadmin-core/node_modules/redux/es/index.js");

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = __webpack_require__("../../xadmin-dashboard/node_modules/immutable/dist/immutable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { REHYDRATE } from 'redux-persist/constants'
var findRelateCells = function findRelateCells(cells, parentKey) {
  return Object.keys(cells).reduce(function (prev, key) {
    return cells[key].parent == parentKey ? [].concat((0, _toConsumableArray3.default)(prev), (0, _toConsumableArray3.default)(findRelateCells(cells, key))) : prev;
  }, [parentKey]);
};

var paramsReducer = function paramsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];
  var type = action.type,
      payload = action.payload,
      params = action.params;

  switch (type) {
    case '@@x-dashboard/UPDATE_DASHBOARD':
      return params;
    // case REHYDRATE:
    //   return action.payload.dashboard.params
    default:
      return state;
  }
};

var cellsReducer = function cellsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];
  var type = action.type,
      key = action.key,
      params = action.params,
      Container = action.Container;

  switch (type) {
    case '@@x-dashboard/ADD_CELL':
      {
        var newState = (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, key, params));

        if (params.parent) {
          var parent = Container && Container.CellReducer ? Container.CellReducer(newState[params.parent], action) : newState[params.parent];
          newState[params.parent] = (0, _extends8.default)({}, parent, { childrenCells: [].concat((0, _toConsumableArray3.default)(parent.childrenCells || []), [key])
          });
        }
        return newState;
      }
    case '@@x-dashboard/REMOVE_CELL':
      {
        var parentKey = state[key].parent;
        var _newState = _lodash2.default.omit(state, findRelateCells(state, key));

        if (parentKey) {
          var _parent = Container && Container.CellReducer ? Container.CellReducer(_newState[parentKey], action) : state[parentKey];
          _newState[parentKey] = (0, _extends8.default)({}, _parent, { childrenCells: _parent.childrenCells ? _parent.childrenCells.filter(function (k) {
              return k !== key;
            }) : []
          });
        }
        return _newState;
      }
    case '@@x-dashboard/UPDATE_CELL':
      return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, key, params));
    case '@@x-dashboard/MERGE_CELL':
      return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, key, _lodash2.default.merge({}, state[key], params)));
    default:
      return state;
  }
};

var layoutReducer = function layoutReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments[1];
  var type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case '@@x-dashboard/ADD_CELL':
      return (0, _extends8.default)({}, state, {
        lg: [].concat((0, _toConsumableArray3.default)(state.lg || []), [(0, _extends8.default)({ i: payload.key }, payload.layout)])
      });
    case '@@x-dashboard/CHANGE_LAYOUTS':
      return payload || state;
    default:
      return state;
  }
};

var layoutsReducer = function layoutsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case '@@x-dashboard/ADD_CELL':
      {
        var key = action.payload.params.layer;
        return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, key, layoutReducer(state[key], action)));
      }
    case '@@x-dashboard/CHANGE_LAYOUTS':
      {
        return (0, _extends8.default)({}, state, (0, _defineProperty3.default)({}, action.key, layoutReducer(action.key, action)));
      }
    default:
      return state;
  }
};

var dataReducer = function dataReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    // case '@@x-dashboard/ADD_CELL':
    //   if(action.payload.key) {
    //     return state.setIn( action.payload.key, action.payload.data )
    //   } else {
    //     return state
    //   }
    case '@@x-dashboard/UPDATE_DATA':
      if (action.data !== undefined) {
        var path = action.cell || action.key;
        return (0, _extends8.default)({}, _lodash2.default.set(state, path, action.data));
      } else if (action.payload !== undefined) {
        var keys = Object.keys(action.payload);
        if (keys.length == 1) {
          var _path = keys[0];
          var value = action.payload[_path];
          if (_lodash2.default.isPlainObject(value)) {
            value = _lodash2.default.mergeWith(_lodash2.default.get(state, _path), value, function (objValue, srcValue) {
              if (_lodash2.default.isArray(objValue)) {
                return srcValue;
              }
            });
          }
          return (0, _extends8.default)({}, _lodash2.default.set(state, _path, value));
        } else {
          return _lodash2.default.mergeWith(_lodash2.default.cloneDeep(state), action.payload, function (objValue, srcValue) {
            if (_lodash2.default.isArray(objValue)) {
              return srcValue;
            }
          });
        }
        //return state.mergeDeepWith(action.payload)
      } else {
        return state;
      }
    case '@@x-dashboard/UPDATE_ALL_DATA':
      return action.payload;
    default:
      return state;
  }
};

var endpointReducer = function endpointReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case '@@x-dashboard/UPDATE_ENDPOINT':
      return action.payload;
    default:
      return state;
  }
};

var selectCellReducer = function selectCellReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments[1];

  if (action.type == '@@x-dashboard/SELECT_CELL') {
    return action.key;
  } else if (action.type == '@@x-dashboard/TRIGGER_SELECT_CELL') {
    return action.key && state != action.key ? action.key : null;
  } else if (action.type == '@@x-dashboard/REMOVE_CELL' && state == action.key) {
    return null;
  }
  return state;
};

var dashboardReducer = (0, _redux.combineReducers)({
  params: paramsReducer,
  cells: cellsReducer,
  selectCell: selectCellReducer,
  //layouts: layoutsReducer,
  data: dataReducer,
  endpoints: endpointReducer
});

exports.default = {
  dashboard: function dashboard() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (action.type == '@@x-dashboard/LOAD_DASHBOARD') {
      var cells = action.payload.cells || {};
      var ts = Object.keys(cells).reduce(function (prev, key) {
        var cell = cells[key];
        if (cell.parent) {
          prev[cell.parent] = [].concat((0, _toConsumableArray3.default)(prev[cell.parent] || []), [key]);
        }
        return prev;
      }, {});

      Object.keys(ts).forEach(function (key) {
        if (cells[key] && cells[key].childrenCells == undefined) {
          cells[key].childrenCells = ts[key];
        }
      });

      return (0, _extends8.default)({}, action.payload, { cells: cells });
    } else {
      return dashboardReducer(state, action);
    }
  }
};

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/EChartBase.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _echarts = __webpack_require__("../../xadmin-dashboard/node_modules/echarts/index.js");

var _echarts2 = _interopRequireDefault(_echarts);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _elementResizeEvent = __webpack_require__("../../xadmin-dashboard/node_modules/element-resize-event/index.js");

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EChartBase = function (_React$Component) {
  (0, _inherits3.default)(EChartBase, _React$Component);

  function EChartBase() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EChartBase);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EChartBase.__proto__ || Object.getPrototypeOf(EChartBase)).call.apply(_ref, [this].concat(args))), _this), _this.getEvents = function () {
      return _this.props.onEvents || {};
    }, _this.isLayer = function () {
      return _this.props.echartParent !== undefined;
    }, _this.getSeries = function () {
      return [];
    }, _this.getOption = function () {
      var _this$props = _this.props,
          title = _this$props.title,
          toolbox = _this$props.toolbox,
          commonSc = _this$props.commonSc;


      var opts = (0, _extends3.default)({
        backgroundColor: {
          type: 'radial',
          x: 0.4,
          y: 0.4,
          r: 0.35,
          colorStops: [{
            offset: 0,
            color: '#895355' // 0% 处的颜色
          }, {
            offset: .4,
            color: '#593640' // 100% 处的颜色
          }, {
            offset: 1,
            color: '#39273d' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        title: {
          text: '无标题',
          textStyle: {
            color: 'rgba(255,255,255,0.9)'
          },
          x: 'left'
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 'right',
          data: []
        },
        xAxis: {
          axisLabel: {
            show: true,
            inside: false,
            formatter: function formatter(val) {
              return val;
            }
          },
          axisTick: {
            inside: true,
            show: true
          },
          type: 'category',
          data: []
        },
        yAxis: {
          axisLabel: {
            show: true,
            inside: false,
            formatter: function formatter(val) {
              return val;
            }
          },
          axisTick: {
            inside: false,
            show: true
          },
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: _this.getSeries()
      }, commonSc);

      return opts;
    }, _this.bindEvents = function (instance, events) {
      var _loop = function _loop(eventName) {
        // ignore the event config which not satisfy
        if (typeof eventName === 'string' && typeof events[eventName] === 'function') {
          // binding event
          instance.off(eventName);
          instance.on(eventName, function (param) {
            events[eventName](param, instance);
          });
        }
      };

      for (var eventName in events) {
        _loop(eventName);
      }
    }, _this.renderEchartDom = function () {
      setTimeout(_this.renderEchartDomTick, 0);
    }, _this.renderEchartDomTick = function () {
      // init the echart object
      var echartObj = _this.getEchartsInstance();
      // set the echart option
      echartObj.setOption(_this.getOption(), false, false);
      // set loading mask
      if (_this.props.showLoading) echartObj.showLoading();else echartObj.hideLoading();
      _this.bindEvents(echartObj, _this.getEvents());

      return echartObj;
    }, _this.getEchartsInstance = function () {
      if (_lodash2.default.isNil(_this.refs.echartsDom)) {
        return null;
      }
      return _echarts2.default.getInstanceByDom(_this.refs.echartsDom) || _echarts2.default.init(_this.refs.echartsDom, _this.props.theme);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(EChartBase, [{
    key: 'componentDidMount',


    // first add
    value: function componentDidMount() {
      if (!this.isLayer()) {
        var echartObj = this.renderEchartDom();
        // on resize
        if (echartObj) {
          (0, _elementResizeEvent2.default)(this.refs.echartsDom, function () {
            echartObj.resize();
          });
        }
      } else {
        var _props = this.props,
            cellKey = _props.cellKey,
            echartParent = _props.echartParent;

        echartParent.series[cellKey] = this.getSeries();
      }
    }

    // update

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (!this.isLayer()) {
        this.renderEchartDom();
      } else {
        var _props2 = this.props,
            cellKey = _props2.cellKey,
            echartParent = _props2.echartParent;

        echartParent.series[cellKey] = this.getSeries();
        echartParent.renderEchartDom();
      }
    }

    // remove

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!this.isLayer()) {
        _echarts2.default.dispose(this.refs.echartsDom);
      } else {
        var _props3 = this.props,
            cellKey = _props3.cellKey,
            echartParent = _props3.echartParent;

        echartParent.series = _lodash2.default.omit(echartParent.series, cellKey);
        echartParent.renderEchartDom();
      }
    }

    //bind the events

    // render the dom


    // render the dom

  }, {
    key: 'render',
    value: function render() {
      // for render
      return !this.isLayer() ? _react2.default.createElement('div', { ref: 'echartsDom',
        className: this.props.className,
        style: { height: '100%' } }) : null;
    }
  }]);
  return EChartBase;
}(_react2.default.Component);

EChartBase.PropTypes = {
  notMerge: _react2.default.PropTypes.bool,
  lazyUpdate: _react2.default.PropTypes.bool,
  theme: _react2.default.PropTypes.string,
  showLoading: _react2.default.PropTypes.bool,
  events: _react2.default.PropTypes.object
};

EChartBase.ParamSchema = {
  type: 'object',
  properties: {
    showLoading: {
      title: '显示Loading',
      type: 'boolean'
    },
    notMerge: {
      title: '不使用合并参数',
      type: 'boolean'
    },
    lazyUpdate: {
      title: '延迟更新',
      type: 'boolean'
    }
  }
};

exports.default = EChartBase;

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/EChartContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _echarts = __webpack_require__("../../xadmin-dashboard/node_modules/echarts/index.js");

var _echarts2 = _interopRequireDefault(_echarts);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _EChartBase2 = __webpack_require__("../../xadmin-dashboard/src/widgets/EChartBase.js");

var _EChartBase3 = _interopRequireDefault(_EChartBase2);

var _Cell = __webpack_require__("../../xadmin-dashboard/src/components/Cell.js");

var _Cell2 = _interopRequireDefault(_Cell);

var _elementResizeEvent = __webpack_require__("../../xadmin-dashboard/node_modules/element-resize-event/index.js");

var _elementResizeEvent2 = _interopRequireDefault(_elementResizeEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EChartContainer = function (_EChartBase) {
  (0, _inherits3.default)(EChartContainer, _EChartBase);

  function EChartContainer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EChartContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EChartContainer.__proto__ || Object.getPrototypeOf(EChartContainer)).call.apply(_ref, [this].concat(args))), _this), _this.series = {}, _this.getSeries = function () {
      return Object.values(_this.series);
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(EChartContainer, [{
    key: 'generateLayers',
    value: function generateLayers() {
      var _this2 = this;

      var _props = this.props,
          childrenCells = _props.childrenCells,
          widgetProps = _props.widgetProps,
          editMode = _props.editMode;

      return childrenCells.map(function (key) {
        return _react2.default.createElement(_Cell2.default, { cellKey: key, editMode: editMode, widgetProps: widgetProps, echartParent: _this2,
          widgetWrap: function widgetWrap(widget) {
            return widget || null;
          } });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      // for render
      return _react2.default.createElement(
        'div',
        { style: { height: '100%' } },
        _react2.default.createElement('div', { ref: 'echartsDom',
          className: this.props.className,
          style: { height: '100%' } }),
        _react2.default.createElement(
          'div',
          { style: { position: 'absolute', top: -1000, display: 'none' } },
          this.generateLayers()
        )
      );
    }
  }]);
  return EChartContainer;
}(_EChartBase3.default);

EChartContainer.Title = 'EChart容器';
EChartContainer.Category = '容器组件';
EChartContainer.Container = true;
EChartContainer.CanSelect = true;

EChartContainer.ParamSchema = {
  type: 'object',
  properties: {}
};

EChartContainer.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return state;
  }
  return state;
};

exports.default = EChartContainer;

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/HtmlPart.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _reactFontawesome = __webpack_require__("../../xadmin-dashboard/node_modules/react-fontawesome/lib/index.js");

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _Textarea = __webpack_require__("../../xadmin-form/src/components/Textarea.js");

var _Textarea2 = _interopRequireDefault(_Textarea);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlPart = _react2.default.createClass({
  displayName: 'HtmlPart',
  render: function render() {
    var _props = this.props,
        html = _props.html,
        _props$params = _props.params,
        params = _props$params === undefined ? [] : _props$params;

    var vs = params.reduce(function (prev, _ref) {
      var key = _ref.key,
          value = _ref.value;

      prev[key] = value;
      return prev;
    }, {});
    return _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: _lodash2.default.template(html)(vs) } });
  }
});

HtmlPart.Title = 'HTML组件';

HtmlPart.ParamSchema = {
  type: 'object',
  properties: {
    html: {
      type: 'string',
      format: 'code'
    },
    params: {
      type: 'array',
      title: '变量',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            title: '变量名'
          },
          value: {
            type: 'string',
            title: '变量值'
          }
        }
      }
    }
  },
  form: ['*', { key: 'html', component: _Textarea2.default }, 'params']
};

exports.default = HtmlPart;

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/MapContainer.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _lodash = __webpack_require__("../../xadmin-dashboard/node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _EChartContainer2 = __webpack_require__("../../xadmin-dashboard/src/widgets/EChartContainer.js");

var _EChartContainer3 = _interopRequireDefault(_EChartContainer2);

__webpack_require__("../../xadmin-dashboard/src/widgets/china.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EChartMap = function (_EChartContainer) {
  (0, _inherits3.default)(EChartMap, _EChartContainer);

  function EChartMap() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, EChartMap);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = EChartMap.__proto__ || Object.getPrototypeOf(EChartMap)).call.apply(_ref, [this].concat(args))), _this), _this.getOption = function () {
      var opts = {
        tooltip: {},
        geo: [{
          type: 'map',
          map: 'china',
          itemStyle: {
            normal: {
              borderWidth: 3,
              shadowBlur: 50,
              shadowColor: 'rgba(255, 255, 255, 0.2)',
              borderColor: '#51ccfe'
            },
            emphasis: {
              color: 'rgba(64, 173, 229, 1)',
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 1)'
            }
          }
        }],
        series: _this.getSeries()
      };
      return opts;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  return EChartMap;
}(_EChartContainer3.default);

EChartMap.Title = '地图容器';
EChartMap.Category = '地图组件';
EChartMap.Container = true;
EChartMap.CanSelect = true;

EChartMap.ParamSchema = {
  type: 'object',
  properties: {}
};

EChartMap.CellReducer = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type == '@@x-dashboard/ADD_CELL') {
    return state;
  }
  return state;
};

exports.default = EChartMap;

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/china.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/typeof.js");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__("../../xadmin-dashboard/node_modules/echarts/index.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : (0, _typeof3.default)(exports)) === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
})(undefined, function (exports, echarts) {
    var log = function log(msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    if (!echarts.registerMap) {
        log('ECharts Map is not loaded');
        return;
    }
    echarts.registerMap('china', { "type": "FeatureCollection", "features": [{ "id": "710000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@°Ü¯Û", "@@ƛĴÕƊÉɼģºðʀ\\ƎsÆNŌÔĚänÜƤɊĂǀĆĴĤǊŨxĚĮǂƺòƌâÔ®ĮXŦţƸZûÐƕƑGđ¨ĭMó·ęcëƝɉlÝƯֹÅŃ^Ó·śŃǋƏďíåɛGɉ¿IċããF¥ĘWǬÏĶñÄ", "@@\\p|WoYG¿¥Ij@", "@@¡@V^RqBbAnTXeQr©C", "@@ÆEEkWqë I"]], "encodeOffsets": [[[122886, 24033], [123335, 22980], [122375, 24193], [122518, 24117], [124427, 22618]]] }, "properties": { "cp": [121.509062, 25.044332], "name": "台湾", "childNum": 5 } }, { "id": "130000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@\\aM`Ç½ÓnUKĜēs¤­©yrý§uģcJ»eIP]ªrºc_ħ²G¼s`jÎŸnüsÂľP", "@@U`Ts¿mÄ", "@@FOhđ©OiÃ`ww^ÌkÑH«ƇǤŗĺtFu{Z}Ö@U´ʚLg®¯Oı°Ãw ^VbÉsmAê]]w§RRl£ŭuwNÁ`ÇFēÝčȻuT¡Ĺ¯Õ¯sŗő£YªhVƍ£ƅnëYNgq¼ś¿µı²UºÝUąąŖóxV@tƯJ]eR¾fe|rHA|h~Ėƍl§ÏjVë` ØoÅbbx³^zÃĶ¶Sj®AyÂhðk`«PËµEFÛ¬Y¨Ļrõqi¼Wi°§Ð±²°`[À|ĠO@ÆxO\\ta\\p_Zõ^û{ġȧXýĪÓjùÎRb^Î»j{íděYfíÙTymńŵōHim½éŅ­aVcř§ax¹XŻácWU£ôãºQ¨÷Ñws¥qEHÙ|šYQoŕÇyáĂ£MÃ°oťÊP¡mWO¡v{ôvîēÜISpÌhp¨ jdeŔQÖjX³àĈ[n`Yp@UcM`RKhEbpŞlNut®EtqnsÁgAiúoHqCXhfgu~ÏWP½¢G^}¯ÅīGCÑ^ãziMáļMTÃƘrMc|O_¯Ŏ´|morDkO\\mĆJfl@cĢ¬¢aĦtRıÒXòë¬WP{ŵǫƝīÛ÷ąV×qƥV¿aȉd³BqPBmaËđŻģmÅ®V¹d^KKonYg¯XhqaLdu¥Ípǅ¡KąÅkĝęěhq}HyÃ]¹ǧ£Í÷¿qágPmoei¤o^á¾ZEY^Ný{nOl±Í@Mċèk§daNaÇį¿]øRiiñEūiǱàUtėGyl}ÓM}jpEC~¡FtoQiHkk{ILgĽxqÈƋÄdeVDJj£J|ÅdzÂFt~KŨ¸IÆv|¢r}èonb}`RÎÄn°ÒdÞ²^®lnÐèĄlðÓ×]ªÆ}LiĂ±Ö`^°Ç¶p®đDcŋ`ZÔ¶êqvFÆN®ĆTH®¦O¾IbÐã´BĐɢŴÆíȦpĐÞXR·nndO¤OÀĈƒ­QgµFo|gȒęSWb©osx|hYhgŃfmÖĩnºTÌSp¢dYĤ¶UĈjlǐpäðëx³kÛfw²Xjz~ÂqbTÑěŨ@|oMzv¢ZrÃVw¬ŧĖ¸f°ÐTªqs{S¯r æÝl¼ÖĞ ǆiGĘJ¼lr}~K¨ŸƐÌWö¼Þ°nÞoĦL|C~D©|q]SvKÑcwpÏÏĿćènĪWlĄkT}¬Tp~®Hgd˒ĺBVtEÀ¢ôPĎƗè@~kü\\rÊĔÖæW_§¼F´©òDòjYÈrbĞāøŀG{ƀ|¦ðrb|ÀH`pʞkvGpuARhÞÆǶgĘTǼƹS£¨¡ù³ŘÍ]¿ÂyôEP xX¶¹ÜO¡gÚ¡IwÃé¦ÅBÏ|Ç°N«úmH¯âbęU~xĈbȒ{^xÖlD¸dɂ~"]], "encodeOffsets": [[[120023, 41045], [121616, 39981], [122102, 42307]]] }, "properties": { "cp": [114.502461, 38.045474], "name": "河北", "childNum": 3 } }, { "id": "140000", "geometry": { "type": "Polygon", "coordinates": ["@@ħÜ_ªlìwGkÛÃǏokćiµVZģ¡coTSË¹ĪmnÕńehZg{gtwªpXaĚThȑp{¶Eh®RćƑP¿£PmcªaJyý{ýȥoÅîɡųAďä³aÏJ½¥PG­ąSM­sWz½µÛYÓŖgxoOkĒCo­Èµ]¯_²ÕjāK~©ÅØ^ÔkïçămÏk]­±cÝ¯ÑÃmQÍ~_apm~ç¡qu{JÅŧ·Ls}EyÁÆcI{¤IiCfUcƌÃp§]ě«vD@¡SÀµMÅwuYY¡DbÑc¡h×]nkoQdaMç~eDÛtT©±@¥ù@É¡ZcW|WqOJmĩl«ħşvOÓ«IqăV¥D[mI~Ó¢cehiÍ]Ɠ~ĥqX·eƷn±}v[ěďŕ]_œ`¹§ÕōIo©b­s^}Ét±ū«³p£ÿ¥WÑxçÁ«h×u×¥ř¾dÒ{ºvĴÎêÌɊ²¶ü¨|ÞƸµȲLLúÉƎ¤ϊęĔV`_bªS^|dzY|dz¥pZbÆ£¶ÒK}tĦÔņƠPYznÍvX¶Ěn ĠÔzý¦ª÷ÑĸÙUȌ¸dòÜJð´ìúNM¬XZ´¤ŊǸ_tldI{¦ƀðĠȤ¥NehXnYGR° ƬDj¬¸|CĞKqºfƐiĺ©ª~ĆOQª ¤@ìǦɌ²æBÊTĞHƘÁĪËĖĴŞȀÆÿȄlŤĒötÎ½î¼ĨXh|ªM¤ÐzÞĩÒSrao³"], "encodeOffsets": [[117016, 41452]] }, "properties": { "cp": [112.549248, 37.857014], "name": "山西", "childNum": 1 } }, { "id": "150000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@ǪƫÌÛMĂ[`ÕCn}¶Vcês¯PqFB|S³C|kñHdiÄ¥sŉÅPóÑÑE^ÅPpy_YtShQ·aHwsOnŉÃs©iqjUSiº]ïW«gW¡ARëśĳĘů`çõh]y»ǃǛҤxÒm~zf}pf|ÜroÈzrKÈĵSƧż؜Ġu~è¬vîS¼ĂhĖMÈÄw\\fŦ°W ¢¾luŸDw\\Ŗĝ", "@@GVu»Aylßí¹ãe]Eāò³C¹ð¾²iÒAdkò^P²CǜңǄ z¼g^èöŰ_Ĳĕê}gÁnUI«m]jvV¼euhwqAaW_µj»çjioQR¹ēÃßt@r³[ÛlćË^ÍÉáGOUÛOB±XkÅ¹£k|e]olkVÍ¼ÕqtaÏõjgÁ£§U^RLËnX°ÇBz^~wfvypV ¯ƫĉ˭ȫƗŷɿÿĿƑ˃ĝÿÃǃßËőó©ǐȍŒĖM×ÍEyxþp]ÉvïèvƀnÂĴÖ@V~Ĉ³MEĸÅĖtējyÄDXÄxGQuv_i¦aBçw˛wD©{tāmQ{EJ§KPśƘƿ¥@sCTÉ}ɃwƇy±gÑ}T[÷kÐç¦«SÒ¥¸ëBX½HáÅµÀğtSÝÂa[ƣ°¯¦Pï¡]£ġÒk®G²èQ°óMq}EóƐÇ\\@áügQÍu¥FTÕ¿Jû]|mvāÎYua^WoÀa·­ząÒot×¶CLƗi¯¤mƎHǊ¤îìɾŊìTdåwsRÖgĒųúÍġäÕ}Q¶¿A[¡{d×uQAMxVvMOmăl«ct[wº_ÇÊjbÂ£ĦS_éQZ_lwgOiýe`YYJq¥IÁǳ£ÙË[ÕªuƏ³ÍTs·bÁĽäė[b[ŗfãcn¥îC¿÷µ[ŏÀQ­ōĉm¿Á^£mJVmL[{Ï_£F¥Ö{ŹA}×Wu©ÅaųĳƳhB{·TQqÙIķËZđ©Yc|M¡LeVUóK_QWk_ĥ¿ãZ»X\\ĴuUèlG®ěłTĠğDŃGÆÍz]±ŭ©Å]ÅÐ}UË¥©TċïxgckfWgi\\ÏĒ¥HkµEë{»ÏetcG±ahUiñiWsɁ·cCÕk]wȑ|ća}wVaĚá G°ùnM¬¯{ÈÐÆA¥ÄêJxÙ¢hP¢ÛºµwWOóFÁz^ÀŗÎú´§¢T¤ǻƺSėǵhÝÅQgvBHouʝl_o¿Ga{ïq{¥|ſĿHĂ÷aĝÇqZñiñC³ª»E`¨åXēÕqÉû[l}ç@čƘóO¿¡FUsAʽīccocÇS}£IS~ălkĩXçmĈŀÐoÐdxÒuL^T{r@¢ÍĝKén£kQyÅõËXŷƏL§~}kq»IHėǅjĝ»ÑÞoå°qTt|r©ÏS¯·eŨĕx«È[eM¿yupN~¹ÏyN£{©għWí»Í¾səšǅ_ÃĀɗ±ąĳĉʍŌŷSÉA±åǥɋ@ë£R©ąP©}ĹªƏj¹erLDĝ·{i«ƫC½ÉshVzGS|úþXgp{ÁX¿ć{ƱȏñZáĔyoÁhA}ŅĆfdŉ_¹Y°ėǩÑ¡H¯¶oMQqð¡Ë|Ñ`ƭŁX½·óÛxğįÅcQs«tȋǅFù^it«Č¯[hAi©á¥ÇĚ×l|¹y¯Kȝqgů{ñǙµïċĹzŚȭ¶¡oŽäÕG\\ÄT¿Òõr¯LguÏYęRƩɷŌO\\İÐ¢æ^Ŋ ĲȶȆbÜGĝ¬¿ĚVĎgª^íu½jÿĕęjık@Ľ]ėl¥ËĭûÁėéV©±ćn©­ȇÍq¯½YÃÔŉÉNÑÅÝy¹NqáʅDǡËñ­ƁYÅy̱os§ȋµʽǘǏƬɱàưN¢ƔÊuľýľώȪƺɂļxZĈ}ÌŉŪĺœĭFЛĽ̅ȣͽÒŵìƩÇϋÿȮǡŏçƑůĕ~Ç¼ȳÐUfdIxÿ\\G zâɏÙOº·pqy£@qþ@Ǟ˽IBäƣzsÂZÁàĻdñ°ŕzéØűzșCìDȐĴĺf®Àľưø@ɜÖÞKĊŇƄ§͑těï͡VAġÑÑ»d³öǍÝXĉĕÖ{þĉu¸ËʅğU̎éhɹƆ̗̮ȘǊ֥ड़ࡰţાíϲäʮW¬®ҌeרūȠkɬɻ̼ãüfƠSצɩςåȈHϚÎKǳͲOðÏȆƘ¼CϚǚ࢚˼ФÔ¤ƌĞ̪Qʤ´¼mȠJˀƲÀɠmɆǄĜƠ´ǠN~ʢĜ¶ƌĆĘźʆȬ˪ĚĒ¸ĞGȖƴƀj`ĢçĶāàŃºēĢĖćYÀŎüôQÐÂŎŞǆŞêƖoˆDĤÕºÑǘÛˤ³̀gńƘĔÀ^ªƂ`ªt¾äƚêĦĀ¼ÐĔǎ¨Ȕ»͠^ˮÊȦƤøxRrŜH¤¸ÂxDÄ|ø˂˜ƮÐ¬ɚwɲFjĔ²Äw°ǆdÀÉ_ĸdîàŎjÊêTĞªŌŜWÈ|tqĢUB~´°ÎFCU¼pĀēƄN¦¾O¶łKĊOjĚj´ĜYp{¦SĚÍ\\T×ªV÷Ší¨ÅDK°ßtŇĔK¨ǵÂcḷ̌ĚǣȄĽFlġUĵŇȣFʉɁMğįʏƶɷØŭOǽ«ƽū¹Ʊő̝Ȩ§ȞʘĖiɜɶʦ}¨֪ࠜ̀ƇǬ¹ǨE˦ĥªÔêFxúQEr´Wrh¤Ɛ \\talĈDJÜ|[Pll̚¸ƎGú´P¬W¦^¦H]prRn|or¾wLVnÇIujkmon£cX^Bh`¥V¦U¤¸}xRj[^xN[~ªxQ[`ªHÆÂExx^wN¶Ê|¨ìMrdYpoRzNyÀDs~bcfÌ`L¾n|¾T°c¨È¢ar¤`[|òDŞĔöxElÖdHÀI`Ď\\Àì~ÆR¼tf¦^¢ķ¶eÐÚMptgjɡČÅyġLûŇV®ÄÈƀĎ°P|ªVVªj¬ĚÒêp¬E|ŬÂ_~¼rƐK f{ĘFĒƌXưăkÃĄ}nµo×q£ç­kX{uĩ«āíÓUŅÝVUŌ]Ť¥lyň[oi{¦LĸĦ^ôâJ¨^UZðÚĒL¿Ìf£K£ʺoqNwğc`uetOj×°KJ±qÆġmĚŗos¬qehqsuH{¸kH¡ÊRǪÇƌbȆ¢´äÜ¢NìÉʖ¦â©Ɨؗ"]], "encodeOffsets": [[[128500, 52752], [127089, 51784]]] }, "properties": { "cp": [111.670801, 40.818311], "name": "内蒙古", "childNum": 2 } }, { "id": "210000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@L@@s]", "@@MnNm", "@@dc", "@@eÀC@b", "@@fXwkbrÄ`qg", "@@^jtWQ", "@@~ Y[c", "@@I`ĖN^_¿ZÁM", "@@Ïxǌ{q_×^Gigp", "@@iX¶BY", "@@YZ", "@@L_yG`b", "@@^WqCTZ", "@@\\[§t|]", "@@m`p[", "@@@é^BntaÊU]x ¯ÄPĲ­°hʙK³VÕ@Y~|EvĹsÇ¦­L^pÃ²ŸÒG Ël]xxÄ_fT¤Ď¤cPC¨¸TVjbgH²sdÎdHt`B²¬GJję¶[ÐhjeXdlwhðSČ¦ªVÊÏÆZÆŶ®²^ÎyÅHńĚDMħĜŁH­kçvV[ĳ¼WYÀäĦ`XlR`ôLUVfK¢{NZdĒªYĸÌÚJRr¸SA|ƴgŴĴÆbvªØX~źB|¦ÕE¤Ð`\\|KUnnI]¤ÀÂĊnŎR®Ő¿¶\\ÀøíDm¦ÎbŨabaĘ\\ľãÂ¸atÎSƐ´©v\\ÖÚÌǴ¤Â¨JKrZ_ZfjþhPkx`YRIjJcVf~sCN¤ EhæmsHy¨SðÑÌ\\\\ĐRÊwS¥fqŒßýáĞÙÉÖ[^¯ǤŲê´\\¦¬ĆPM¯£»uïpùzExanµyoluqe¦W^£ÊL}ñrkqWňûPUP¡ôJoo·U}£[·¨@XĸDXm­ÛÝºGUCÁª½{íĂ^cjk¶Ã[q¤LÉö³cux«|Zd²BWÇ®Yß½ve±ÃCý£W{Ú^q^sÑ·¨ËMr¹·C¥GDrí@wÕKţÃ«V·i}xËÍ÷i©ĝɝǡ]{c±OW³Ya±_ç©HĕoƫŇqr³Lys[ñ³¯OSďOMisZ±ÅFC¥Pq{Ã[Pg}\\¿ghćOk^ĩÃXaĕËĥM­oEqqZûěŉ³F¦oĵhÕP{¯~TÍlªNßYÐ{Ps{ÃVUeĎwk±ŉVÓ½ŽJãÇÇ»Jm°dhcÀffdF~ĀeĖd`sx² ®EĦ¦dQÂd^~ăÔH¦\\LKpĄVez¤NP ǹÓRÆąJSh­a[¦´ÂghwmBÐ¨źhI|VV|p] Â¼èNä¶ÜBÖ¼L`¼bØæKVpoúNZÞÒKxpw|ÊEMnzEQIZZNBčÚFÜçmĩWĪñtÞĵÇñZ«uD±|ƏlǗw·±PmÍada CLǑkùó¡³Ï«QaċÏOÃ¥ÕđQȥċƭy³ÁA"]], "encodeOffsets": [[[123686, 41445], [126019, 40435], [124393, 40128], [126117, 39963], [125322, 40140], [126686, 40700], [126041, 40374], [125584, 40168], [125509, 40217], [125453, 40165], [125362, 40214], [125280, 40291], [125774, 39997], [125976, 40496], [125822, 39993], [122731, 40949]]] }, "properties": { "cp": [123.429096, 41.796767], "name": "辽宁", "childNum": 16 } }, { "id": "220000", "geometry": { "type": "Polygon", "coordinates": ["@@ñr½ÉKāGÁ¤ia ÉÈ¹`\\xs¬dĆkNnuNUwNx¶c¸|\\¢GªóĄ~RãÖÎĢùđŴÕhQxtcæëSɽŉíëǉ£ƍG£nj°KƘµDsØÑpyĆ¸®¿bXp]vbÍZuĂ{n^IüÀSÖ¦EvRÎûh@â[ƏÈô~FNr¯ôçR±­HÑlĢ^¤¢OðætxsŒ]ÞÁTĠs¶¿âÆGW¾ìA¦·TÑ¬è¥ÏÐJ¨¼ÒÖ¼ƦɄxÊ~StD@Ă¼Ŵ¡jlºWvÐzƦZÐ²CH AxiukdGgetqmcÛ£Ozy¥cE}|¾cZk¿uŐã[oxGikfeäT@SUwpiÚFM©£è^Ú`@v¶eňf heP¶täOlÃUgÞzŸU`l}ÔÆUvØ_Ō¬Öi^ĉi§²ÃB~¡ĈÚEgc|DC_Ȧm²rBx¼MÔ¦ŮdĨÃâYxƘDVÇĺĿg¿cwÅ\\¹¥Yĭl¤OvLjM_a W`zļMž·\\swqÝSAqŚĳ¯°kRē°wx^ĐkǂÒ\\]nrĂ}²ĊŲÒøãh·M{yMzysěnĒġV·°G³¼XÀ¤¹i´o¤ŃÈ`ÌǲÄUĞd\\iÖmÈBĤÜɲDEh LG¾ƀÄ¾{WaYÍÈĢĘÔRîĐj}ÇccjoUb½{h§Ǿ{KƖµÎ÷GĄØŜçưÌs«lyiē«`å§H¥Ae^§GK}iã\\c]v©ģZmÃ|[M}ģTɟĵÂÂ`ÀçmFK¥ÚíÁbX³ÌQÒHof{]ept·GŋĜYünĎųVY^ydõkÅZW«WUa~U·SbwGçǑiW^qFuNĝ·EwUtW·Ýďæ©PuqEzwAVXRãQ`­©GYYhcUGorBd}ģÉb¡·µMicF«Yƅ»é\\ɹ~ǙG³mØ©BšuT§Ĥ½¢Ã_Ã½L¡ûsT\\rke\\PnwAKy}ywdSefµ]UhĿD@mÿvaÙNSkCuncÿ`lWėVâ¦÷~^fÏ~vwHCį`xqT­­lW«ï¸skmßEGqd¯R©Ý¯¯S\\cZ¹iűƏCuƍÓXoR}M^o£R}oªU­FuuXHlEÅÏ©¤ßgXþ¤D²ÄufàÀ­XXÈ±Ac{Yw¬dvõ´KÊ£\\rµÄlidā]|î©¾DÂVH¹Þ®ÜWnCķ W§@\\¸~¤Vp¸póIO¢VOŇürXql~òÉK]¤¥Xrfkvzpm¶bwyFoúvð¼¤ N°ąO¥«³[éǣű]°Õ\\ÚÊĝôîŇÔaâBYlďQ[ Ë[ïÒ¥RI|`j]P"], "encodeOffsets": [[126831, 44503]] }, "properties": { "cp": [125.3245, 43.886841], "name": "吉林", "childNum": 1 } }, { "id": "230000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@UµNÿ¥īèçHÍøƕ¶Lǽ|g¨|a¾pVidd~ÈiíďÓQġėÇZÎXb½|ſÃH½KFgɱCģÛÇAnjÕc[VĝǱÃËÇ_ £ń³pj£º¿»WH´¯U¸đĢmtĜyzzNN|g¸÷äűÑ±ĉā~mq^[ǁÑďlw]¯xQĔ¯l°řĴrBÞTxr[tŽ¸ĻN_yX`biNKuP£kZĮ¦[ºxÆÀdhĹŀUÈƗCwáZħÄŭcÓ¥»NAw±qȥnD`{ChdÙFć}¢A±Äj¨]ĊÕjŋ«×`VuÓÅ~_kŷVÝyhVkÄãPsOµfgeŇµf@u_Ù ÙcªNªÙEojVxT@ãSefjlwH\\pŏäÀvlY½d{F~¦dyz¤PÜndsrhfHcvlwjF£G±DÏƥYyÏu¹XikĿ¦ÏqƗǀOŜ¨LI|FRĂn sª|C˜zxAè¥bfudTrFWÁ¹Am|ĔĕsķÆF´N}ćUÕ@Áĳſmuçuð^ÊýowFzØÎĕNőǏȎôªÌŒǄàĀÄ˄ĞŀƒʀĀƘŸˮȬƬĊ°Uzouxe]}AyÈW¯ÌmKQ]Īºif¸ÄX|sZt|½ÚUÎ lk^p{f¤lºlÆW A²PVÜPHÊâ]ÎĈÌÜk´\\@qàsĔÄQºpRij¼èi`¶bXrBgxfv»uUi^v~J¬mVp´£´VWrnP½ì¢BX¬hðX¹^TjVriªjtŊÄmtPGx¸bgRsT`ZozÆO]ÒFôÒOÆŊvÅpcGêsx´DR{AEOr°x|íb³Wm~DVjºéNNËÜ˛ɶ­GxŷCSt}]ûōSmtuÇÃĕNāg»íT«u}ç½BĵÞʣ¥ëÊ¡MÛ³ãȅ¡ƋaǩÈÉQG¢·lG|tvgrrf«ptęŘnÅĢrI²¯LiØsPf_vĠdxM prʹL¤¤eËÀđKïÙVY§]Ióáĥ]ķK¥j|pŇ\\kzţ¦šnņäÔVĂîĪ¬|vW®l¤èØrxm¶ă~lÄƯĄ̈́öȄEÔ¤ØQĄĄ»ƢjȦOǺ¨ìSŖÆƬyQv`cwZSÌ®ü±Ǆ]ŀç¬B¬©ńzƺŷɄeeOĨSfm ĊƀP̎ēz©ĊÄÕÊmgÇsJ¥ƔŊśæÎÑqv¿íUOµªÂnĦÁ_½ä@êí£P}Ġ[@gġ}gɊ×ûÏWXá¢užƻÌsNÍ½ƎÁ§čŐAēeL³àydl¦ĘVçŁpśǆĽĺſÊQíÜçÛġÔsĕ¬Ǹ¯YßċġHµ ¡eå`ļrĉŘóƢFìĎWøxÊkƈdƬv|I|·©NqńRŀ¤éeŊŀàŀU²ŕƀBQ£Ď}L¹Îk@©ĈuǰųǨÚ§ƈnTËÇéƟÊcfčŤ^XmHĊĕË«W·ċëx³ǔķÐċJāwİ_ĸȀ^ôWr­°oú¬ĦŨK~ȰCĐ´Ƕ£fNÎèâw¢XnŮeÂÆĶ¾¾xäLĴĘlļO¤ÒĨA¢Êɚ¨®ØCÔ ŬGƠƦYĜĘÜƬDJg_ͥœ@čŅĻA¶¯@wÎqC½Ĉ»NăëKďÍQÙƫ[«ÃígßÔÇOÝáWñuZ¯ĥŕā¡ÑķJu¤E å¯°WKÉ±_d_}}vyõu¬ï¹ÓU±½@gÏ¿rÃ½DgCdµ°MFYxw¿CG£Rƛ½Õ{]L§{qqą¿BÇƻğëܭǊË|c²}Fµ}ÙRsÓpg±QNqǫŋRwŕnéÑÉK«SeYRŋ@{¤SJ}D Ûǖ֍]gr¡µŷjqWÛham³~S«Ü[", "@@ƨĶTLÇyqpÇÛqe{~oyen}s`qiXGù]Ëp½©lÉÁp]Þñ´FĂ^fäîºkàz¼BUv¬D"]], "encodeOffsets": [[[134456, 44547], [127123, 51780]]] }, "properties": { "cp": [126.642464, 45.756967], "name": "黑龙江", "childNum": 2 } }, { "id": "320000", "geometry": { "type": "Polygon", "coordinates": ["@@Õg^vÁbnÀ`Jnĝ¬òM¶ĘTÖŒbe¦¦{¸ZâćNp©Hp|`mjhSEb\\afv`sz^lkljÄtg¤D­¾X¿À|ĐiZȀåB·î}GL¢õcßjayBFµÏC^ĭcÙt¿sğH]j{s©HM¢QnDÀ©DaÜÞ·jgàiDbPufjDk`dPOîhw¡ĥ¥GP²ĐobºrYî¶aHŢ´ ]´rılw³r_{£DB_Ûdåuk|Ũ¯F Cºyr{XFye³Þċ¿ÂkĭB¿MvÛpm`rÚã@Ę¹hågËÖƿxnlč¶Åì½Ot¾dJlVJĂǀŞqvnO^JZż·Q}êÍÅmµÒ]ƍ¦Dq}¬R^èĂ´ŀĻĊIÔtĲyQŐĠMNtR®òLhĚs©»}OÓGZz¶A\\jĨFäOĤHYJvÞHNiÜaĎÉnFQlNM¤B´ĄNöɂtpŬdZÅglmuÇUšŞÚb¤uŃJŴu»¹ĄlȖħŴw̌ŵ²ǹǠ͛hĭłƕrçü±Yrřl¥i`ã__¢ćSÅr[Çq^ùzWmOĈaŐÝɞï²ʯʊáĘĳĒǭPħ͍ôƋÄÄÍīçÛɈǥ£­ÛmY`ó£Z«§°Ó³QafusNıǅ_k}¢m[ÝóDµ¡RLčiXyÅNïă¡¸iĔÏNÌķoıdōîåŤûHcs}~Ûwbù¹£¦ÓCtOPrE^ÒogĉIµÛÅʹK¤½phMú`mR¸¦PƚgÉLRs`£¯ãhD¨|³¤C"], "encodeOffsets": [[121451, 32518]] }, "properties": { "cp": [118.767413, 32.041544], "name": "江苏", "childNum": 1 } }, { "id": "330000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@jX^n", "@@sfdM", "@@qP\\xz[_i", "@@o\\VzRZ}mECy", "@@R¢FX}°[m]", "@@Cb\\}", "@@e|v\\laus", "@@v~s{", "@@QxÂF©}", "@@¹nvÞs©m", "@@rQgYIh", "@@bi«ZX", "@@p[}ILd", "@@À¿|", "@@¹dnb", "@@rS}[Kl", "@@g~h}", "@@FlCk", "@@ůTG°ĄLHm°UF", "@@OdRe", "@@v[u\\", "@@FjâL~wyoo~sµLZ", "@@¬e¹aH", "@@\\nÔ¡q]L³ë\\ÿ®QÌ", "@@ÊA­©]ª", "@@Kxv{­", "@@@hlIk_", "@@pWcrxp", "@@Md|_iA", "@@¢X£½z\\ðpN", "@@hlÜ[LykAvyfw^E ", "@@fp¤MusH", "@@®_ma~LÁ¬`", "@@@°¡mÛGĕ¨§Ianá[ýƤjfæÐNäGp", "@@iMt\\", "@@Zc[b", "@@X®±GrÆ°Zæĉm", "@@Z~dOSo|A¿qZv", "@@@`EN£p", "@@|s", "@@@nDi", "@@na£¾uYL¯QªmĉÅdMgÇjcº«ę¬­K­´B«Âącoċ\\xK`cįŧ«®á[~ıxu·ÅKsËÉc¢Ù\\ĭƛëbf¹­ģSĜkáƉÔ­ĈZB{aMµfzŉfÓÔŹŁƋǝÊĉ{ğč±g³ne{ç­ií´S¬\\ßðK¦w\\iqªĭiAuA­µ_W¥ƣO\\lċĢttC¨£t`PZäuXßBsĻyekOđġĵHuXBµ]×­­\\°®¬F¢¾pµ¼kŘó¬Wät¸|@L¨¸µrºù³Ù~§WIZW®±Ð¨ÒÉx`²pĜrOògtÁZ{üÙ[|ûKwsPlU[}¦Rvn`hsª^nQ´ĘRWb_ rtČFIÖkĦPJ¶ÖÀÖJĈĄTĚòC ²@PúØz©Pî¢£CÈÚĒ±hŖl¬â~nm¨f©iļ«mntqÒTÜÄjL®EÌFª²iÊxØ¨IÈhhst[Ôx}dtüGæţŔïĬaĸpMËÐjē¢·ðĄÆMzjWKĎ¢Q¶À_ê_@ıi«pZgf¤Nrq]§ĂN®«H±yƳí¾×ŊďŀĐÏŴǝĂíÀBŖÕªÁŐTFqĉ¯³ËCĕģi¨hÜ·ñt»¯Ï", "@@ºwZRkĕWK "]], "encodeOffsets": [[[125785, 31436], [125729, 31431], [125513, 31380], [125329, 30690], [125223, 30438], [125115, 30114], [124815, 29155], [124419, 28746], [124095, 28635], [124005, 28609], [125000, 30713], [125111, 30698], [125078, 30682], [125150, 30684], [124014, 28103], [125008, 31331], [125411, 31468], [125329, 31479], [125369, 31139], [125626, 30916], [125417, 30956], [125254, 30976], [125199, 30997], [125095, 31058], [125083, 30915], [124885, 31015], [125218, 30798], [124867, 30838], [124755, 30788], [124802, 30809], [125267, 30657], [125218, 30578], [125200, 30562], [125192, 30787], [124968, 30474], [125167, 30396], [125115, 30363], [124955, 29879], [124714, 29781], [124762, 29462], [124325, 28754], [124863, 30077], [125366, 31477]]] }, "properties": { "cp": [120.153576, 30.287459], "name": "浙江", "childNum": 43 } }, { "id": "340000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@^iuLV\\", "@@e©Edh", "@@´CE¶zAXêeödK¡~H¸íæAȽd{ďÅÀ½W®£ChÃsikkly]_teu[bFaTign{]GqªoĈMYá|·¥f¥őaSÕėNµñĞ«Im_m¿Âa]uĜp Z_§{Cäg¤°r[_YjÆOdý[I[á·¥Q_nùgL¾mzˆDÜÆ¶ĊJhpc¹O]iŠ]¥ jtsggDÑ¡w×jÉ©±EFË­KiÛÃÕYvsm¬njĻª§emná}k«ŕgđ²ÙDÇ¤í¡ªOy×Où±@DñSęćăÕIÕ¿IµĥOlJÕÍRÍ|JìĻÒåyķrĕq§ÄĩsWÆßF¶X®¿mwRIÞfßoG³¾©uyHį{Ɓħ¯AFnuPÍÔzVdàôº^Ðæd´oG¤{S¬ćxã}ŧ×Kǥĩ«ÕOEÐ·ÖdÖsƘÑ¨[Û^Xr¢¼§xvÄÆµ`K§ tÒ´Cvlo¸fzŨð¾NY´ı~ÉĔēßúLÃÃ_ÈÏ|]ÂÏHlg`ben¾¢pUh~ƴĖ¶_r sĄ~cƈ]|r c~`¼{À{ȒiJjz`îÀT¥Û³]u}fïQl{skloNdjäËzDvčoQďHI¦rbrHĖ~BmlNRaĥTX\\{fÁKÁ®TLÂÄMtÊgĀDĄXƔvDcÎJbt[¤D@®hh~kt°ǾzÖ@¾ªdbYhüóV´ŮŒ¨Üc±r@J|àuYÇÔG·ĚąĐlŪÚpSJ¨ĸLvÞcPæķŨ®mÐálsgd×mQ¨ųÆ©Þ¤IÎs°KZpĄ|XwWdĎµmkǀwÌÕæhºgBĝâqÙĊzÖgņtÀÁĂÆáhEz|WzqD¹°Eŧl{ævÜcA`¤C`|´qxĲkq^³³GšµbíZ¹qpa±ď OH¦Ħx¢gPícOl_iCveaOjChß¸iÝbÛªCC¿mRV§¢A|tbkĜEÀtîm^g´fÄ"]], "encodeOffsets": [[[121722, 32278], [119475, 30423], [121606, 33646]]] }, "properties": { "cp": [117.283042, 31.86119], "name": "安徽", "childNum": 3 } }, { "id": "350000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@zht´}[", "@@aj^~ĆGå", "@@edHse", "@@@vPGsyQ", "@@sBzddW[O", "@@S¨Qy", "@@NVucW", "@@qptB@q", "@@¸[iu", "@@Q\\pD[_", "@@jSwUappI", "@@eXª~", "@@AjvFoo", "@@fT_Çí\\v|ba¦jZÆy|®", "@@IjLg", "@@wJIx«¼AoNe{M¥", "@@K±¡ÓČ~N¾", "@@k¡¹Eh~c®uDqZì¡I~Māe£bN¨gZý¡a±Öcp©PhI¢QqÇGj|¥U g[Ky¬ŏv@OptÉEF\\@ åA¬V{XģĐBycpě¼³Ăp·¤¥ohqqÚ¡ŅLs^Ã¡§qlÀhH¨MCe»åÇGD¥zPO£čÙkJA¼ßėuĕeûÒiÁŧS[¡Uûŗ½ùěcÝ§SùĩąSWó«íęACµeRåǃRCÒÇZÍ¢ź±^dlstjD¸ZpuÔâÃH¾oLUêÃÔjjēò´ĄWƛ^Ñ¥Ħ@ÇòmOw¡õyJyD}¢ďÑÈġfZda©º²z£NjD°Ötj¶¬ZSÎ~¾c°¶ÐmxO¸¢Pl´SL|¥AȪĖMņĲg®áIJČĒü` QF¬h|ĂJ@zµ |ê³È ¸UÖŬŬÀCtrĸr]ðM¤ĶĲHtÏ AĬkvsq^aÎbvdfÊòSD´Z^xPsĂrvƞŀjJd×ŘÉ ®AÎ¦ĤdxĆqAZRÀMźnĊ»İÐZ YXæJyĊ²·¶q§·K@·{sXãô«lŗ¶»o½E¡­«¢±¨Y®Ø¶^AvWĶGĒĢPlzfļtàAvWYãO_¤sD§ssČġ[kƤPX¦`¶®BBvĪjv©jx[L¥àï[F¼ÍË»ğV`«Ip}ccÅĥZEãoP´B@D¸m±z«Ƴ¿å³BRØ¶Wlâþäą`]Z£Tc ĹGµ¶Hm@_©k¾xĨôȉðX«½đCIbćqK³ÁÄš¬OAwã»aLŉËĥW[ÂGIÂNxĳ¤D¢îĎÎB§°_JGs¥E@¤ućPåcuMuw¢BI¿]zG¹guĮI"]], "encodeOffsets": [[[123250, 27563], [122541, 27268], [123020, 27189], [122916, 27125], [122887, 26845], [122808, 26762], [122568, 25912], [122778, 26197], [122515, 26757], [122816, 26587], [123388, 27005], [122450, 26243], [122578, 25962], [121255, 25103], [120987, 24903], [122339, 25802], [121042, 25093], [122439, 26024]]] }, "properties": { "cp": [119.306239, 26.075302], "name": "福建", "childNum": 18 } }, { "id": "360000", "geometry": { "type": "Polygon", "coordinates": ["@@ÖP¬ǦĪØLŨä~Ĉw«|TH£pc³Ïå¹]ĉđxe{ÎÓvOEm°BƂĨİ|Gvz½ª´HàpeJÝQxnÀW­EµàXÅĪt¨ÃĖrÄwÀFÎ|Ă¡WÕ¸cf¥XaęST±m[r«_gmQu~¥V\\OkxtL E¢Ú^~ýØkbēqoě±_Êw§Ñ²ÏƟė¼mĉŹ¿NQYBąrwģcÍ¥B­ŗÊcØiIƝĿuqtāwO]³YCñTeÉcaubÍ]trluīBÐGsĵıN£ï^ķqsq¿DūūVÕ·´Ç{éĈýÿOER_đûIċâJh­ŅıNȩĕB¦K{Tk³¡OP·wnµÏd¯}½TÍ«YiµÕsC¯iM¤­¦¯P|ÿUHvhe¥oFTuõ\\OSsMòđƇiaºćXĊĵà·çhƃ÷Ç{ígu^đgm[ÙxiIN¶Õ»lđÕwZSÆv©_ÈëJbVkĔVÀ¤P¾ºÈMÖxlò~ªÚàGĂ¢B±ÌKyñ`w²¹·`gsÙfIěxŕeykpudjuTfb·hh¿Jd[\\LáƔĨƐAĈepÀÂMD~ņªe^\\^§ý©j×cZØ¨zdÒa¶lÒJìõ`oz÷@¤uŞ¸´ôęöY¼HČƶajlÞƩ¥éZ[|h}^U  ¥pĄžƦO lt¸Æ Q\\aÆ|CnÂOjt­ĚĤdÈF`¶@Ðë ¦ōÒ¨SêvHĢÛ@[ÆQoxHW[ŰîÀt¦Ǆ~NĠ¢lĄtZoCƞÔºCxrpČNpj¢{f_Y`_eq®Aot`@oDXfkp¨|s¬\\DÄSfè©Hn¬^DhÆyøJhØxĢĀLÊƠPżċĄwĮ¶"], "encodeOffsets": [[118923, 30536]] }, "properties": { "cp": [115.892151, 28.676493], "name": "江西", "childNum": 1 } }, { "id": "370000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@Xjd]mE", "@@itnq", "@@Dl@k", "@@TGw", "@@K¬U", "@@Wd`c", "@@PtMs", "@@LnXlc", "@@ppVu]Qn", "@@cdzAU_", "@@udRhnCE", "@@oIpP", "@@M{ĿčwbxƨîKÎMĮ]ZF½Y]â£ph¶¨râøÀÎǨ¤^ºÄGz~grĚĜlĞÆLĆǆ¢Îo¦cvKbgr°WhmZp L]LºcUÆ­nżĤÌĒbAnrOA´ȊcÀbƦUØrĆUÜøĬƞŶǬĴóò_A̈«ªdÎÉnb²ĦhņBĖįĦåXćì@L¯´ywƕCéÃµė ƿ¸lµZæyj|BíÂKNNnoƈfÈMZwnŐNàúÄsTJULîVjǎ¾ĒØDz²XPn±ŴPè¸ŔLƔÜƺ_TüÃĤBBċÈöA´faM¨{«M`¶d¡ôÖ°mȰBÔjj´PM|c^d¤u¤Û´ä«ƢfPk¶Môl]Lb}su^ke{lCMrDÇ­]NÑFsmoõľHyGă{{çrnÓEƕZGª¹Fj¢ÿ©}ÌCǷë¡ąuhÛ¡^KxC`C\\bÅxì²ĝÝ¿_NīCȽĿåB¥¢·IŖÕy\\¹kxÃ£ČáKµË¤ÁçFQ¡KtŵƋ]CgÏAùSedcÚźuYfyMmhUWpSyGwMPqŀÁ¼zK¶G­Y§Ë@´śÇµƕBm@IogZ¯uTMx}CVKï{éƵP_K«pÛÙqċtkkù]gTğwoɁsMõ³ăAN£MRkmEÊčÛbMjÝGuIZGPģãħE[iµBEuDPÔ~ª¼ęt]ûG§¡QMsğNPŏįzs£Ug{đJĿļā³]ç«Qr~¥CƎÑ^n¶ÆéÎR~Ż¸YI] PumŝrƿIā[xeÇ³L¯v¯s¬ÁY~}ťuŁgƋpÝĄ_ņī¶ÏSR´ÁP~¿Cyċßdwk´SsX|t`Ä ÈðAªìÎT°¦Dda^lĎDĶÚY°`ĪŴǒàŠv\\ebZHŖR¬ŢƱùęOÑM­³FÛaj"]], "encodeOffsets": [[[123806, 39303], [123821, 39266], [123742, 39256], [123702, 39203], [123649, 39066], [123847, 38933], [123580, 38839], [123894, 37288], [123043, 36624], [123344, 38676], [123522, 38857], [123628, 38858], [118267, 36772]]] }, "properties": { "cp": [117.000923, 36.675807], "name": "山东", "childNum": 13 } }, { "id": "410000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@dXD}~Hgq~ÔN~zkĘHVsǲßjŬŢ`Pûàl¢\\ÀEhİgÞē X¼`khÍLùµP³swIÓzeŠĠð´E®ÚPtºIŊÊºL«šŕQGYfa[şußǑĩų_Z¯ĵÙčC]kbc¥CS¯ëÍB©ïÇÃ_{sWTt³xlàcČzÀD}ÂOQ³ÐTĬµƑÐ¿ŸghłŦv~}ÂZ«¤lPÇ£ªÝŴÅR§ØnhctâknÏ­ľŹUÓÝdKuķI§oTũÙďkęĆH¸Ó\\Ä¿PcnS{wBIvÉĽ[GqµuŇôYgûZca©@½Õǽys¯}lgg@­C\\£asIdÍuCQñ[L±ęk·ţb¨©kK»KC²òGKmĨS`UQnk}AGēsqaJ¥ĐGRĎpCuÌy ã iMcplk|tRkðev~^´¦ÜSí¿_iyjI|ȑ|¿_»d}q^{Ƈdă}tqµ`ŷé£©V¡om½ZÙÏÁRD|JOÈpÀRsI{ùÓjuµ{t}uËRivGçJFjµåkWê´MÂHewixGw½Yŷpµú³XU½ġyłåkÚwZX·l¢Á¢KzOÎÎjc¼htoDHr|­J½}JZ_¯iPq{tę½ĕ¦Zpĵø«kQĹ¤]MÛfaQpě±ǽ¾]u­Fu÷nčÄ¯ADp}AjmcEÇaª³o³ÆÍSƇĈÙDIzçñİ^KNiÞñ[aA²zzÌ÷D|[íÄ³gfÕÞd®|`Ć~oĠƑô³ŊD×°¯CsøÂ«ìUMhTº¨¸ǝêWÔDruÂÇZ£ĆPZW~ØØv¬gèÂÒw¦X¤Ā´oŬ¬²Ês~]®tªapŎJ¨Öº_ŔfŐ\\Đ\\Ĝu~m²Ƹ¸fWĦrƔ}Î^gjdfÔ¡J}\\n C¦þWxªJRÔŠu¬ĨĨmFdM{\\d\\YÊ¢ú@@¦ª²SÜsC}fNècbpRmlØ^gd¢aÒ¢CZZxvÆ¶N¿¢T@uC¬^ĊðÄn|lIlXhun[", "@@hzUq"]], "encodeOffsets": [[[116744, 37216], [116480, 33048]]] }, "properties": { "cp": [113.665412, 34.757975], "name": "河南", "childNum": 2 } }, { "id": "420000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@ASd", "@@ls{d", "@@¾«}{ra®pîÃ\\{øCËyyB±b\\òÝjKL ]ĎĽÌJyÚCƈćÎT´Å´pb©ÈdFin~BCo°BĎÃømv®E^vǾ½Ĝ²RobÜeN^ĺ£R¬lĶ÷YoĖ¥Ě¾|sOr°jY`~I¾®I{GqpCgyl{£ÍÍyPLÂ¡¡¸kWxYlÙæŁĢz¾V´W¶ùŸo¾ZHxjwfxGNÁ³Xéæl¶EièIH ujÌQ~v|sv¶Ôi|ú¢FhQsğ¦SiŠBgÐE^ÁÐ{čnOÂÈUÎóĔÊēĲ}Z³½Mŧïeyp·uk³DsÑ¨L¶_ÅuÃ¨w»¡WqÜ]\\Ò§tƗcÕ¸ÕFÏǝĉăxŻČƟOKÉġÿ×wg÷IÅzCg]m«ªGeçÃTC«[t§{loWeC@ps_Bp­rf_``Z|ei¡oċMqow¹DƝÓDYpûsYkıǃ}s¥ç³[§cY§HK«Qy]¢wwö¸ïx¼ņ¾Xv®ÇÀµRĠÐHM±cÏdƒǍũȅȷ±DSyúĝ£ŤĀàtÖÿï[îb\\}pĭÉI±Ñy¿³x¯No|¹HÏÛmjúË~TuęjCöAwě¬Rđl¯ Ñb­ŇTĿ_[IčĄʿnM¦ğ\\É[T·k¹©oĕ@A¾wya¥Y\\¥Âaz¯ãÁ¡k¥ne£ÛwE©Êō¶˓uoj_U¡cF¹­[WvP©whuÕyBF`RqJUw\\i¡{jEPïÿ½fćQÑÀQ{°fLÔ~wXgītêÝ¾ĺHd³fJd]HJ²EoU¥HhwQsƐ»Xmg±çve]DmÍPoCc¾_hhøYrŊU¶eD°Č_N~øĹĚ·`z]Äþp¼äÌQv\\rCé¾TnkžŐÚÜa¼ÝƆĢ¶ÛodĔňÐ¢JqPb ¾|J¾fXƐîĨ_Z¯À}úƲN_ĒÄ^ĈaŐyp»CÇÄKñL³ġM²wrIÒŭxjb[n«øæà ^²­h¯ÚŐªÞ¸Y²ĒVø}Ā^İ´LÚm¥ÀJÞ{JVųÞŃx×sxxƈē ģMřÚðòIfĊŒ\\Ʈ±ŒdÊ§ĘDvČ_Àæ~Dċ´A®µ¨ØLV¦êHÒ¤"]], "encodeOffsets": [[[113712, 34000], [115612, 30507], [113649, 34054]]] }, "properties": { "cp": [114.298572, 30.584355], "name": "湖北", "childNum": 3 } }, { "id": "430000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@nFZw", "@@ãÆá½ÔXrCOËRïÿĩ­TooQyÓ[ŅBE¬ÎÓXaį§Ã¸G °ITxpúxÚĳ¥ÏĢ¾edÄ©ĸGàGhM¤Â_U}Ċ}¢pczfþg¤ÇôAV", "@@ȴÚĖÁĐiOĜ«BxDõĚivSÌ}iùÜnÐºG{p°M°yÂÒzJ²Ì ÂcXëöüiáÿñőĞ¤ùTz²CȆȸǎŪƑÐc°dPÎğË¶[È½u¯½WM¡­ÉB·rínZÒ `¨GA¾\\pēXhÃRC­üWGġuTé§ŎÑ©êLM³}_EÇģc®ęisÁPDmÅ{b[RÅs·kPŽƥóRoOV~]{g\\êYƪ¦kÝbiċƵGZ»Ěõó·³vŝ£ø@pyö_ëIkÑµbcÑ§y×dYØªiþUjŅ³C}ÁN»hĻħƏâƓKA·³CQ±µ§¿AUƑ¹AtćOwD]JUÖgk¯b£ylZFËÑ±H­}EbóľA¡»Ku¦·³åş¥ùBD^{ÌC´­¦ŷJ£^[ª¿ğ|ƅN skóā¹¿ï]ă~÷O§­@Vm¡Qđ¦¢Ĥ{ºjÔª¥nf´~Õo×ÛąGû¥cÑ[Z¶ŨĪ²SÊǔƐƀAÚŌ¦QØ¼rŭ­«}NÏürÊ¬mjr@ĘrTW ­SsdHzƓ^ÇÂyUi¯DÅYlŹu{hT}mĉ¹¥ěDÿë©ıÓ[Oº£¥ótł¹MÕƪ`PDiÛU¾ÅâìUñBÈ£ýhedy¡oċ`pfmjP~kZaZsÐd°wj§@Ĵ®w~^kÀÅKvNmX\\¨aŃqvíó¿F¤¡@ũÑVw}S@j}¾«pĂrªg àÀ²NJ¶¶DôK|^ª°LX¾ŴäPĪ±£EXd^¶ĲÞÜ~u¸ǔMRhsRe`ÄofIÔ\\Ø  ićymnú¨cj ¢»GČìƊÿÐ¨XeĈĀ¾Oð Fi ¢|[jVxrIQ_EzAN¦zLU`cªxOTu RLÄªpUĪȴ^ŎµªÉFxÜf¤ºgĲèy°Áb[¦Zb¦z½xBĖ@ªpºjS´rVźOd©ʪiĎăJP`"]], "encodeOffsets": [[[115640, 30489], [112577, 27316], [114113, 30649]]] }, "properties": { "cp": [112.982279, 28.19409], "name": "湖南", "childNum": 3 } }, { "id": "440000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@QdAsa", "@@lxDRm", "@@sbhNLo", "@@Ă ý", "@@WltOY[", "@@Kr]S", "@@e~AS}", "@@I|Mym", "@@Û³LS²Q", "@@nvºBë¥cÕº", "@@zdÛJm", "@@°³", "@@a yAª¸ËJIxØ@ĀHÉÕZofoo", "@@sŗÃÔėAƁZÄ ~°ČPºb", "@@¶ÝÌvmĞh¹Ĺ", "@@HdSjĒ¢D}waru«ZqadY{K", "@@el\\LqqO", "@@~rMmX", "@@f^E", "@@øPªoj÷ÍÝħXČx°Q¨ıXJp", "@@gÇƳmxatfu", "@@EÆC½", "@@¸B_¶ekWvSivc}p}Ăº¾NĎyj¦Èm th_®Ä}»âUzLË²Aā¡ßH©Ùñ}wkNÕ¹ÇO½¿£ēUlaUìIÇª`uTÅxYĒÖ¼kÖµMjJÚwn\\hĒv]îh|ÈƄøèg¸Ķß ĉĈWb¹ƀdéĘNTtP[öSvrCZaGubo´ŖÒÇĐ~¡zCIözx¢PnÈñ @ĥÒ¦]ƜX³ăĔñiiÄÓVépKG½ÄÓávYoC·sitiaÀyŧÎ¡ÈYDÑům}ý|m[węõĉZÅxUO}÷N¹³ĉo_qtăqwµŁYÙǝŕ¹tïÛUÃ¯mRCºĭ|µÕÊK½Rē ó]GªęAxNqSF|ām¡diď×YïYWªŉOeÚtĐ«zđ¹TāúEáÎÁWwíHcòßÎſ¿Çdğ·ùT×Çūʄ¡XgWÀǇğ·¿ÃOj YÇ÷Sğ³kzőõmĝ[³¡VÙæÅöMÌ³¹pÁaËýý©D©ÜJŹƕģGą¤{ÙūÇO²«BƱéAÒĥ¡«BhlmtÃPµyU¯ucd·w_bŝcīímGOGBȅŹãĻFŷŽŕ@Óoo¿ē±ß}}ÓF÷tĲWÈCőâUâǙIğŉ©IĳE×Á³AĥDĈ±ÌÜÓĨ£L]ĈÙƺZǾĆĖMĸĤfÎĵlŨnÈĐtFFĤêk¶^k°f¶g}®Faf`vXŲxl¦ÔÁ²¬Ð¦pqÊÌ²iXØRDÎ}Ä@ZĠsx®AR~®ETtĄZƈfŠŠHâÒÐAµ\\S¸^wĖkRzalŜ|E¨ÈNĀňZTpBh£\\ĎƀuXĖtKL¶G|»ĺEļĞ~ÜĢÛĊrOÙîvd]n¬VÊĜ°RÖpMƀ¬HbwEÀ©\\¤]ŸI®¥D³|Ë]CúAŠ¦æ´¥¸Lv¼¢ĽBaôF~®²GÌÒEYzk¤°ahlVÕI^CxĈPsBƒºVÀB¶¨R²´D", "@@OR"]], "encodeOffsets": [[[117381, 22988], [116552, 22934], [116790, 22617], [116973, 22545], [116444, 22536], [116931, 22515], [116496, 22490], [116453, 22449], [113301, 21439], [118726, 21604], [118709, 21486], [113210, 20816], [115482, 22082], [113171, 21585], [113199, 21590], [115232, 22102], [115739, 22373], [115134, 22184], [113056, 21175], [119573, 21271], [119957, 24020], [115859, 22356], [116680, 26053], [116561, 22649]]] }, "properties": { "cp": [113.280637, 23.125178], "name": "广东", "childNum": 24 } }, { "id": "450000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@H TI¡U", "@@Ɣ_LÊFZgčP­kini«qÇczÍY®¬Ů»qR×ō©DÕ§ƙǃŵTÉĩ±ıdÑnYYĲvNĆĆØÜ Öp}e³¦m©iÓ|¹ħņ|ª¦QF¢Â¬ʖovg¿em^ucäāmÇÖåB¡Õçĝ}FĻ¼Ĺ{µHKsLSđƃrč¤[AgoSŇYMÿ§Ç{FśbkylQxĕ]T·¶[BÑÏGáşşƇeăYSs­FQ}­BwtYğÃ@~CÍQ ×WjË±rÉ¥oÏ ±«ÓÂ¥kwWűue_b­E~µh¯ecl¯Ïr¯EģJğ}w³Ƈē`ãògK_ÛsUʝćğ¶höO¤Ǜn³c`¡yię[ďĵűMę§]XÎ_íÛ]éÛUćİÕBƣ±dy¹T^dûÅÑŦ·PĻþÙ`K¦¢ÍeĥR¿³£[~äu¼dltW¸oRM¢ď\\z}Æzdvň{ÎXF¶°Â_ÒÂÏL©ÖTmu¼ãlīkiqéfA·Êµ\\őDc¥ÝFyÔćcűH_hLÜêĺĐ¨c}rn`½Ì@¸¶ªVLhŒ\\Ţĺk~Ġið°|gtTĭĸ^xvKVGréAébUuMJVÃO¡qĂXËSģãlýà_juYÛÒBG^éÖ¶§EGÅzěƯ¤EkN[kdåucé¬dnYpAyČ{`]þ±X\\ÞÈk¡ĬjàhÂƄ¢Hè ŔâªLĒ^Öm¶ħĊAǦė¸zÚGn£¾rªŀÜt¬@ÖÚSx~øOŒŶÐÂæȠ\\ÈÜObĖw^oÞLf¬°bI lTØBÌF£Ć¹gñĤaYt¿¤VSñK¸¤nM¼JE±½¸ñoÜCƆæĪ^ĚQÖ¦^f´QüÜÊz¯lzUĺš@ìp¶n]sxtx¶@~ÒĂJb©gk{°~c°`Ô¬rV\\la¼¤ôá`¯¹LCÆbxEræOv[H­[~|aB£ÖsºdAĐzNÂðsÞÆĤªbab`ho¡³F«èVZs\\\\ÔRzpp®SĪº¨ÖºNĳd`a¦¤F³¢@`¢ĨĀìhYvlĆº¦Ċ~nS|gźv^kGÆÀè·"]], "encodeOffsets": [[[111707, 21520], [113706, 26955]]] }, "properties": { "cp": [108.320004, 22.82402], "name": "广西", "childNum": 2 } }, { "id": "460000", "geometry": { "type": "Polygon", "coordinates": ["@@¦Ŝil¢XƦƞòïè§ŞCêɕrŧůÇąĻõ·ĉ³œ̅kÇm@ċȧŧĥĽʉ­ƅſȓÒË¦ŝE}ºƑ[ÍĜȋ gÎfǐÏĤ¨êƺ\\Ɔ¸ĠĎvʄȀÐ¾jNðĀÒRZǆzÐĊ¢DÀɘZ"], "encodeOffsets": [[112750, 20508]] }, "properties": { "cp": [110.33119, 20.031971], "name": "海南", "childNum": 1 } }, { "id": "510000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@LqSn", "@@ĆOìÛÐ@ĞǔNY{¤Á§di´ezÝúØãwIþËQÇ¦ÃqÉSJ»ĂéʔõÔƁİlƞ¹§ĬqtÀƄmÀêErĒtD®ċæcQE®³^ĭ¥©l}äQtoŖÜqÆkµªÔĻĴ¡@Ċ°B²Èw^^RsºTĀ£ŚæQPJvÄz^Đ¹Æ¯fLà´GC²dt­ĀRt¼¤ĦOðğfÔðDŨŁĞƘïPÈ®âbMüÀXZ ¸£@Å»»QÉ­]dsÖ×_Í_ÌêŮPrĔĐÕGĂeZÜîĘqBhtO ¤tE[h|YÔZśÎs´xº±Uñt|OĩĠºNbgþJy^dÂY Į]Řz¦gC³R`Āz¢Aj¸CL¤RÆ»@­Ŏk\\Ç´£YW}z@Z}Ã¶oû¶]´^NÒ}èNªPÍy¹`S°´ATeVamdUĐwʄvĮÕ\\uÆŗ¨Yp¹àZÂmWh{á}WØǍÉüwga§ßAYrÅÂQĀÕ¬LŐý®Xøxª½Ű¦¦[þ`ÜUÖ´òrÙŠ°²ÄkĳnDX{U~ET{ļº¦PZcjF²Ė@pg¨B{u¨ŦyhoÚD®¯¢ WòàFÎ¤¨GDäz¦kŮPġqË¥À]eâÚ´ªKxīPÖ|æ[xÃ¤JÞĥsNÖ½I¬nĨY´®ÐƐmDŝuäđđEbee_v¡}ìęǊē}qÉåT¯µRs¡M@}ůaa­¯wvƉåZw\\Z{åû`[±oiJDÅ¦]ĕãïrG réÏ·~ąSfy×Í·ºſƽĵȁŗūmHQ¡Y¡®ÁÃ×t«­T¤JJJyJÈ`Ohß¦¡uËhIyCjmÿwZGTiSsOB²fNmsPa{M{õE^Hj}gYpaeu¯oáwHjÁ½M¡pMuåmni{fk\\oÎqCwEZ¼KĝAy{m÷LwO×SimRI¯rKõBS«sFe]fµ¢óY_ÆPRcue°Cbo×bd£ŌIHgtrnyPt¦foaXďxlBowz_{ÊéWiêEGhÜ¸ºuFĈIxf®Y½ĀǙ]¤EyF²ċw¸¿@g¢§RGv»áW`ÃĵJwi]t¥wO­½a[×]`Ãi­üL¦LabbTÀåc}ÍhÆh®BHî|îºÉk­¤Sy£ia©taį·Ɖ`ō¥UhOĝLk}©Fos´JmµlŁuønÑJWÎªYÀïAetTŅÓGË«bo{ıwodƟ½OġÜÂµxàNÖ¾P²§HKv¾]|BÆåoZ`¡Ø`ÀmºĠ~ÌÐ§nÇ¿¤]wğ@srğu~Io[é±¹ ¿ſđÓ@qg¹zƱřaí°KtÇ¤V»Ã[ĩǭƑ^ÇÓ@áťsZÏÅĭƋěpwDóÖáŻneQËq·GCœýS]x·ýq³OÕ¶Qzßti{řáÍÇWŝŭñzÇWpç¿JXĩè½cFÂLiVjx}\\NŇĖ¥GeJA¼ÄHfÈu~¸Æ«dE³ÉMA|bÒćhG¬CMõƤąAvüVéŀ_VÌ³ĐwQj´·ZeÈÁ¨X´Æ¡Qu·»ÕZ³ġqDoy`L¬gdp°şp¦ėìÅĮZ°Iähzĵf²å ĚÑKpIN|Ñz]ń·FU×é»R³MÉ»GM«kiér}Ã`¹ăÞmÈnÁîRǀ³ĜoİzŔwǶVÚ£À]ɜ»ĆlƂ²ĠþTº·àUȞÏʦ¶I«dĽĢdĬ¿»Ĕ×h\\c¬ä²GêëĤł¥ÀǿżÃÆMº}BÕĢyFVvwxBèĻĒ©Ĉt@Ğû¸£B¯¨ˋäßkķ½ªôNÔ~t¼Ŵu^s¼{TA¼ø°¢İªDè¾Ň¶ÝJ®Z´ğ~Sn|ªWÚ©òzPOȸbð¢|øĞA"]], "encodeOffsets": [[[108815, 30935], [100197, 35028]]] }, "properties": { "cp": [104.065735, 30.659462], "name": "四川", "childNum": 2 } }, { "id": "520000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@G\\lY£cj", "@@q|mc¯vÏV", "@@hÑ£IsNgßHHªķÃh_¹¡ĝÄ§ń¦uÙùgS¯JH|sÝÅtÁïyMDč»eÕtA¤{b\\}G®u\\åPFqwÅaDK°ºâ_£ùbµmÁÛĹM[q|hlaªāI}Ñµ@swtwm^oµDéĽŠyVky°ÉûÛR³e¥]RÕěħ[ƅåÛDpJiVÂF²I»mN·£LbÒYbWsÀbpkiTZĄă¶Hq`ĥ_J¯ae«KpÝx]aĕÛPÇȟ[ÁåŵÏő÷Pw}TÙ@Õs«ĿÛq©½m¤ÙH·yǥĘĉBµĨÕnđ]K©œáGçş§ÕßgǗĦTèƤƺ{¶ÉHÎd¾ŚÊ·OÐjXWrãLyzÉAL¾ę¢bĶėy_qMĔąro¼hĊw¶øV¤w²Ĉ]ÊKx|`ź¦ÂÈdrcÈbe¸`I¼čTF´¼Óýȃr¹ÍJ©k_șl³´_pĐ`oÒh¶pa^ÓĔ}D»^Xy`d[KvJPhèhCrĂĚÂ^Êƌ wZL­Ġ£ÁbrzOIlMMĪŐžËr×ÎeŦtw|¢mKjSǘňĂStÎŦEtqFT¾Eì¬¬ôxÌO¢ K³ŀºäYPVgŎ¦ŊmŞ¼VZwVlz¤£Tl®ctĽÚó{G­AÇge~Îd¿æaSba¥KKûj®_Ä^\\Ø¾bP®¦x^sxjĶI_Ä Xâ¼Hu¨Qh¡À@Ëô}±GNìĎlT¸`V~R°tbÕĊ`¸úÛtÏFDu[MfqGH·¥yAztMFe|R_GkChZeÚ°tov`xbDnÐ{E}ZèxNEÞREn[Pv@{~rĆAB§EO¿|UZ~ìUf¨J²ĂÝÆsªB`s¶fvö¦Õ~dÔq¨¸º»uù[[§´sb¤¢zþF¢ÆÀhÂW\\ıËIÝo±ĭŠ£þÊs}¡R]ěDg´VG¢j±®èºÃmpU[Áëº°rÜbNu¸}º¼`niºÔXĄ¤¼ÔdaµÁ_ÃftQQgR·Ǔv}Ý×ĵ]µWc¤F²OĩųãW½¯K©]{LóµCIµ±Mß¿h©āq¬o½~@i~TUxð´Đhw­ÀEîôuĶb[§nWuMÆJl½]vuıµb"]], "encodeOffsets": [[[112158, 27383], [112105, 27474], [112095, 27476]]] }, "properties": { "cp": [106.713478, 26.578343], "name": "贵州", "childNum": 3 } }, { "id": "530000", "geometry": { "type": "Polygon", "coordinates": ["@@[ùx½}ÑRHYīĺûsÍniEoã½Ya²ė{c¬ĝgĂsAØÅwďõzFjw}«Dx¿}Uũlê@HÅ­F¨ÇoJ´Ónũuą¡Ã¢pÒÅØ TF²xa²ËXcÊlHîAßËŁkŻƑŷÉ©hW­æßUËs¡¦}teèÆ¶StÇÇ}Fd£jĈZĆÆ¤Tč\\D}O÷£U§~ŃGåŃDĝ¸Tsd¶¶Bª¤u¢ŌĎo~t¾ÍŶÒtD¦ÚiôözØX²ghįh½Û±¯ÿm·zR¦Ɵ`ªŊÃh¢rOÔ´£Ym¼èêf¯ŪĽncÚbw\\zlvWªâ ¦gmĿBĹ£¢ƹřbĥkǫßeeZkÙIKueT»sVesbaĕ  ¶®dNĄÄpªy¼³BE®lGŭCǶwêżĔÂepÍÀQƞpC¼ŲÈ­AÎô¶RäQ^Øu¬°_Èôc´¹ò¨PÎ¢hlĎ¦´ĦÆ´sâÇŲPnÊD^¯°Upv}®BPÌªjǬxSöwlfòªvqĸ|`H­viļndĜ­Ćhňem·FyÞqóSį¯³X_ĞçêtryvL¤§z¦c¦¥jnŞklD¤øz½ĜàĂŧMÅ|áƆàÊcðÂFÜáŢ¥\\\\ºİøÒÐJĴîD¦zK²ǏÎEh~CD­hMn^ÌöÄ©ČZÀaüfɭyœpį´ěFűk]Ôě¢qlÅĆÙa¶~ÄqêljN¬¼HÊNQ´ê¼VØ¸E^ŃÒyM{JLoÒęæe±Ķygã¯JYÆĭĘëo¥Šo¯hcK«z_prC´ĢÖY¼ v¸¢RÅW³Â§fÇ¸Yi³xR´ďUË`êĿUûuĆBƣöNDH«ĈgÑaB{ÊNF´¬c·Åv}eÇÃGB»If¦HňĕM~[iwjUÁKE¾dĪçWIèÀoÈXòyŞŮÈXâÎŚj|àsRyµÖPr´þ ¸^wþTDŔHr¸RÌmfżÕâCôoxĜƌÆĮÐYtâŦÔ@]ÈǮƒ\\Ī¼Ä£UsÈ¯LbîƲŚºyhr@ĒÔƀÀ²º\\êpJ}ĠvqtĠ@^xÀ£È¨mËÏğ}n¹_¿¢×Y_æpÅA^{½Lu¨GO±Õ½ßM¶wÁĢÛPƢ¼pcĲx|apÌ¬HÐŊSfsðBZ¿©XÏÒKk÷Eû¿SrEFsÕūkóVǥŉiTL¡n{uxţÏhôŝ¬ğōNNJkyPaqÂğ¤K®YxÉƋÁ]āęDqçgOgILu\\_gz]W¼~CÔē]bµogpÑ_oď`´³Țkl`IªºÎȄqÔþ»E³ĎSJ»_f·adÇqÇc¥Á_Źw{L^É±ćxU£µ÷xgĉp»ĆqNē`rĘzaĵĚ¡K½ÊBzyäKXqiWPÏÉ¸½řÍcÊG|µƕƣGË÷k°_^ý|_zċBZocmø¯hhcæ\\lMFlư£ĜÆyHF¨µêÕ]HAàÓ^it `þßäkĤÎT~Wlÿ¨ÔPzUCNVv [jâôDôď[}z¿msSh¯{jïğl}šĹ[őgK©U·µË@¾m_~q¡f¹ÅË^»f³ø}Q¡ÖË³gÍ±^Ç\\ëÃA_¿bWÏ[¶ƛé£F{īZgm@|kHǭƁć¦UĔť×ëǟeċ¼ȡȘÏíBÉ£āĘPªĳ¶ŉÿy©nď£G¹¡I±LÉĺÑdĉÜW¥}gÁ{aqÃ¥aıęÏZÁ`"], "encodeOffsets": [[104636, 22969]] }, "properties": { "cp": [102.712251, 25.040609], "name": "云南", "childNum": 1 } }, { "id": "540000", "geometry": { "type": "Polygon", "coordinates": ["@@ÂhľxŖxÒVºÅâAĪÝȆµę¯Ňa±r_w~uSÕňqOj]ɄQ£ZUDûoY»©M[L¼qãË{VÍçWVi]ë©Ä÷àyƛhÚU°adcQ~Mx¥caÛcSyFÖk­uRýq¿ÔµQĽ³aG{¿FµëªéĜÿª@¬·K·àariĕĀ«V»ŶĴūgèLǴŇƶaftèBŚ£^âǐÝ®M¦ÁǞÿ¬LhJ¾óƾÆºcxwf]Y´¦|QLn°adĊ\\¨oǀÍŎ´ĩĀd`tÊQŞŕ|¨C^©Ĉ¦¦ÎJĊ{ëĎjª²rÐl`¼Ą[t|¦Stè¾PÜK¸dƄı]s¤î_v¹ÎVòŦj£Əsc¬_Ğ´|Ł¦Av¦w`ăaÝaa­¢e¤ı²©ªSªÈMĄwÉØŔì@T¤Ę\\õª@þo´­xA sÂtŎKzó²ÇČµ¢r^nĊ­Æ¬×üG¢³ {âĊ]G~bÀgVjzlhǶfOfdªB]pjTOtĊn¤}®¦Č¥d¢¼»ddY¼t¢eȤJ¤}Ǿ¡°§¤AÐlc@ĝsªćļđAçwxUuzEÖġ~AN¹ÄÅȀŻ¦¿ģŁéì±Hãd«g[Ø¼ēÀcīľġ¬cJµÐʥVȝ¸ßS¹ý±ğkƁ¼ą^ɛ¤Ûÿb[}¬ōõÃ]ËNm®g@Bg}ÍF±ǐyL¥íCIĳÏ÷Ñį[¹¦[âšEÛïÁÉdƅß{âNÆāŨß¾ě÷yC£k­´ÓH@Â¹TZ¥¢į·ÌAÐ§®Zcv½Z­¹|ÅWZqgW|ieZÅYVÓqdqbc²R@c¥Rã»GeeƃīQ}J[ÒK¬Ə|oėjġĠÑN¡ð¯EBčnwôɍėª²CλŹġǝʅįĭạ̃ūȹ]ΓͧgšsgȽóϧµǛęgſ¶ҍć`ĘąŌJÞä¤rÅň¥ÖÁUětęuůÞiĊÄÀ\\Æs¦ÓRb|Â^řÌkÄŷ¶½÷f±iMÝ@ĥ°G¬ÃM¥n£Øąğ¯ß§aëbéüÑOčk£{\\eµª×MÉfm«Ƒ{Å×Gŏǩãy³©WÑăû··Qòı}¯ãIéÕÂZ¨īès¶ZÈsæĔTŘvgÌsN@îá¾ó@ÙwU±ÉTå»£TđWxq¹Zobs[×¯cĩvėŧ³BM|¹kªħ¥TzNYnÝßpęrñĠĉRS~½ěVVµõ«M££µBĉ¥áºae~³AuĐh`Ü³ç@BÛïĿa©|z²Ý¼D£àč²ŸIûI āóK¥}rÝ_Á´éMaň¨~ªSĈ½½KÙóĿeƃÆB·¬ën×W|Uº}LJrƳlŒµ`bÔ`QÐÓ@s¬ñIÍ@ûws¡åQÑßÁ`ŋĴ{ĪTÚÅTSÄ³Yo|Ç[Ç¾µMW¢ĭiÕØ¿@MhpÕ]jéò¿OƇĆƇpêĉâlØwěsǩĵ¸cbU¹ř¨WavquSMzeo_^gsÏ·¥Ó@~¯¿RiīB\\qTGªÇĜçPoÿfñòą¦óQīÈáPābß{ZŗĸIæÅhnszÁCËìñÏ·ąĚÝUm®ó­L·ăUÈíoù´Êj°ŁŤ_uµ^°ìÇ@tĶĒ¡ÆM³Ģ«İĨÅ®ğRāðggheÆ¢zÊ©Ô\\°ÝĎz~ź¤PnMĪÖB£kné§żćĆKĒ°¼L¶èâz¨u¦¥LDĘz¬ýÎmĘd¾ßFzhg²Fy¦ĝ¤ċņbÎ@yĄæm°NĮZRÖíJ²öLĸÒ¨Y®ƌÐVàtt_ÚÂyĠz]ŢhzĎ{ÂĢXc|ÐqfO¢¤ögÌHNPKŖUú´xx[xvĐCûĀìÖT¬¸^}Ìsòd´_KgžLĴÀBon|H@Êx¦BpŰŌ¿fµƌA¾zǈRx¶FkĄźRzŀ~¶[´HnªVƞuĒ­È¨ƎcƽÌm¸ÁÈM¦x͊ëÀxǆBú^´W£dkɾĬpw˂ØɦļĬIŚÊnŔa¸~J°îlɌxĤÊÈðhÌ®gT´øàCÀ^ªerrƘd¢İP|Ė ŸWªĦ^¶´ÂLaT±üWƜǀRÂŶUńĖ[QhlLüAÜ\\qRĄ©"], "encodeOffsets": [[90849, 37210]] }, "properties": { "cp": [91.132212, 29.660361], "name": "西藏", "childNum": 1 } }, { "id": "610000", "geometry": { "type": "Polygon", "coordinates": ["@@¸ÂW¢xR­Fq§uF@N¢XLRMº[ğȣſï|¥Jkc`sŉǷ£Y³WN«ùMëï³ÛIg÷±mTșÚÒķø©þ¥yÓğęmWµÎumZyOŅƟĥÓ~sÑL¤µaÅY¦ocyZ{y c]{Ta©`U_Ěē£ωÊƍKùK¶ȱÝƷ§{û»ÅÁȹÍéuĳ|¹cÑdìUYOuFÕÈYvÁCqÓTǢí§·S¹NgV¬ë÷Át°DØ¯C´ŉƒópģ}ąiEËFéGU¥×K§­¶³BČ}C¿åċ`wġB·¤őcƭ²ő[Å^axwQOñJÙïŚĤNĔwƇÄńwĪ­o[_KÓª³ÙnKÇěÿ]ďă_d©·©Ýŏ°Ù®g]±ß×¥¬÷m\\iaǑkěX{¢|ZKlçhLtŇîŵœè[É@ƉĄEtƇÏ³­ħZ«mJ×¾MtÝĦ£IwÄå\\Õ{OwĬ©LÙ³ÙTª¿^¦rÌĢŭO¥lãyC§HÍ£ßEñX¡­°ÙCgpťzb`wIvA|¥hoĕ@E±iYd¥OÿµÇvPW|mCĴŜǂÒW¶¸AĜh^Wx{@¬­F¸¡ķn£P|ªĴ@^ĠĈæbÔc¶lYi^MicĎ°Â[ävï¶gv@ÀĬ·lJ¸sn|¼u~a]ÆÈtŌºJpþ£KKf~¦UbyäIĺãnÔ¿^­ŵMThĠÜ¤ko¼Ŏìąǜh`[tRd²Ĳ_XPrɲlXiL§à¹H°Ȧqº®QCbAŌJ¸ĕÚ³ĺ§ `d¨YjiZvRĺ±öVKkjGȊÄePĞZmļKÀ[`ösìhïÎoĬdtKÞ{¬èÒÒBÔpĲÇĬJŊ¦±J«[©ārHµàåVKe§|P²ÇÓ·vUzgnN¾yI@oHĆÛķhxen¡QQ±ƝJǖRbzy¸ËÐl¼EºpĤ¼x¼½~Ğà@ÚüdK^mÌSjp²ȮµûGĦ}Ħðǚ¶òƄjɂz°{ºØkÈęâ¦jªBg\\ċ°s¬]jú EȌǆ¬stRÆdĠİwÜ¸ôW¾ƮłÒ_{Ìû¼jº¹¢GǪÒ¯ĘZ`ºŊecņą~BÂgzpâēòYƲȐĎ"], "encodeOffsets": [[113634, 40474]] }, "properties": { "cp": [108.948024, 34.263161], "name": "陕西", "childNum": 1 } }, { "id": "620000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@Vu_^", "@@ųEĠtt~nkh`Q¦ÅÄÜdwAb×ĠąJ¤DüègĺqBqj°lI¡Ĩ¶ĖIHdjÎB°aZ¢KJO[|A£Dx}NĂ¬HUnrk kp¼Y kMJn[aGáÚÏ[½rc}aQxOgsPMnUsncZsKúvAtÞġ£®ĀYKdnFw¢JE°Latf`¼h¬we|Æbj}GA·~W`¢MC¤tL©Ĳ°qdfObÞĬ¹ttu`^ZúE`[@Æsîz®¡CƳƜG²R¢RmfwĸgÜą G@pzJM½mhVy¸uÈÔO±¨{LfæU¶ßGĂq\\ª¬²I¥IŉÈīoıÓÑAçÑ|«LÝcspīðÍgtë_õ\\ĉñLYnĝgRǡÁiHLlõUĹ²uQjYi§Z_c¨´ĹĖÙ·ŋIaBD­R¹ȥr¯GºßK¨jWkɱOqWĳ\\a­Q\\sg_ĆǛōëp»£lğÛgSŶN®À]ÓämĹãJaz¥V}Le¤Lýo¹IsŋÅÇ^bz³tmEÁ´a¹cčecÇNĊãÁ\\č¯dNj]jZµkÓdaćå]ğĳ@ ©O{¤ĸm¢E·®«|@Xwg]Aģ±¯XǁÑǳªcwQÚŝñsÕ³ÛV_ý¥\\ů¥©¾÷w©WÕÊĩhÿÖÁRo¸V¬âDb¨hûxÊ×ǌ~Zâg|XÁnßYoº§ZÅŘv[ĭÖʃuďxcVbnUSfB¯³_TzºÎO©çMÑ~M³]µ^püµÄY~y@X~¤Z³[Èōl@®Å¼£QK·Di¡ByÿQ_´D¥hŗy^ĭÁZ]cIzýah¹MĪğPs{ò²Vw¹t³ŜË[Ñ}X\\gsF£sPAgěp×ëfYHāďÖqēŭOÏëdLü\\it^c®RÊº¶¢H°mrY£B¹čIoľu¶uI]vģSQ{UŻÅ}QÂ|Ì°ƅ¤ĩŪU ęĄÌZÒ\\v²PĔ»ƢNHĂyAmƂwVm`]ÈbH`Ì¢²ILvĜH®¤Dlt_¢JJÄämèÔDëþgºƫaʎÌrêYi~ Îİ¤NpÀA¾Ĕ¼bð÷®üszMzÖĖQdȨýv§Tè|ªHÃ¾a¸|Ð ƒwKĢx¦ivr^ÿ ¸l öæfƟĴ·PJv}n\\h¹¶v·À|\\ƁĚN´ĜçèÁz]ġ¤²¨QÒŨTIlªťØ}¼˗ƦvÄùØEÂ«FïËIqōTvāÜŏíÛßÛVj³âwGăÂíNOPìyV³ŉĖýZso§HÑiYw[ß\\X¦¥c]ÔƩÜ·«jÐqvÁ¦m^ċ±R¦΋ƈťĚgÀ»IïĨʗƮ°ƝĻþÍAƉſ±tÍEÕÞāNUÍ¡\\ſčåÒʻĘm ƭÌŹöʥëQ¤µ­ÇcƕªoIýIÉ_mkl³ăƓ¦j¡YzŇi}Msßõīʋ }ÁVm_[n}eı­Uĥ¼ªI{Î§DÓƻėojqYhĹT©oūĶ£]ďxĩǑMĝq`B´ƃ˺Чç~²ņj@¥@đ´ί}ĥtPńÇ¾V¬ufÓÉCtÓ̻¹£G³]ƖƾŎĪŪĘ̖¨ʈĢƂlɘ۪üºňUðǜȢƢż̌ȦǼĤŊɲĖÂ­KqĘŉ¼ĔǲņɾªǀÞĈĂD½ĄĎÌŗĞrôñnN¼â¾ʄľԆ|Ǆ֦ज़ȗǉ̘̭ɺƅêgV̍ʆĠ·ÌĊv|ýĖÕWĊǎÞ´õ¼cÒÒBĢ͢UĜð͒s¨ňƃLĉÕÝ@ɛƯ÷¿Ľ­ĹeȏĳëCȚDŲyê×Ŗyò¯ļcÂßYtÁƤyAã˾J@ǝrý@¤rz¸oP¹ɐÚyáHĀ[JwcVeȴÏ»ÈĖ}ƒŰŐèȭǢόĀƪÈŶë;Ñ̆ȤМľĮEŔĹŊũ~ËUă{ĻƹɁύȩþĽvĽƓÉ@ēĽɲßǐƫʾǗĒpäWÐxnsÀ^ƆwW©¦cÅ¡Ji§vúF¶¨c~c¼īeXǚ\\đ¾JwÀďksãAfÕ¦L}waoZD½Ml«]eÒÅaÉ²áo½FõÛ]ĻÒ¡wYR£¢rvÓ®y®LFLzĈôe]gx}|KK}xklL]c¦£fRtív¦PŨ£", "@@M T¥"]], "encodeOffsets": [[[108619, 36299], [108594, 36341], [108600, 36306]]] }, "properties": { "cp": [103.823557, 36.058039], "name": "甘肃", "childNum": 3 } }, { "id": "630000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@InJo", "@@CÆ½OŃĦsΰ~Ē³¦@@Ņi±è}ШƄ˹A³r_ĞǒNĪĐw¤^ŬĵªpĺSZgrpiƼĘÔ¨C|ÍJ©Ħ»®VĲ~f\\m `UnÂ~ʌĬàöNt~ňjy¢ZiƔ¥Ąk´nl`JÊJþ©pdƖ®È£¶ìRʦźõƮËnʼėæÑƀĎ[¢VÎĂMÖÝÎF²sƊƀÎBļýƞ¯ʘƭðħ¼Jh¿ŦęΌƇ¥²Q]Č¥nuÂÏri¸¬ƪÛ^Ó¦d¥[Wàx\\ZjÒ¨GtpþYŊĕ´zUOëPîMĄÁxH´áiÜUàîÜŐĂÛSuŎrJðÌ¬EFÁú×uÃÎkrĒ{V}İ«O_ÌËĬ©ÓŧSRÑ±§Ģ£^ÂyèçěM³Ƃę{[¸¿uºµ[gt£¸OƤĿéYõ·kĀq]juw¥DĩƍõÇPéÄ½G©ã¤GuȧþRcÕĕNyyût­øï»a½ē¿BMoį£Íj}éZËqbʍƬh¹ìÿÓAçãnIÃ¡I`ks£CG­ěUy×Cy@¶ʡÊBnāzGơMē¼±O÷õJËĚăVĪũƆ£¯{ËL½ÌzżVR|ĠTbuvJvµhĻĖHAëáa­OÇðñęNwœľ·LmI±íĠĩPÉ×®ÿscB³±JKßĊ«`ađ»·QAmOVţéÿ¤¹SQt]]Çx±¯A@ĉĳ¢Óļ©l¶ÅÛrŕspãRk~¦ª]Į­´FRåd­ČsCqđéFn¿ÅƃmÉx{W©ºƝºįkÕƂƑ¸wWūÐ©ÈF£\\tÈ¥ÄRÈýÌJ lGr^×äùyÞ³fjc¨£ÂZ|ǓMĝÏ@ëÜőRĝ÷¡{aïȷPu°ËXÙ{©TmĠ}Y³­ÞIňµç½©C¡į÷¯B»|St»]vųs»}MÓ ÿʪƟǭA¡fs»PY¼c¡»¦cċ­¥£~msĉPSi^o©AecPeǵkgyUi¿h}aHĉ^|á´¡HØûÅ«ĉ®]m¡qċ¶±ÈyôōLÁstB®wn±ă¥HSòė£Së@×œÊăxÇN©©T±ª£Ĳ¡fb®Þbb_Ą¥xu¥B{łĝ³«`dƐt¤ťiñÍUuºí`£^tƃĲc·ÛLO½sç¥Ts{ă\\_»kÏ±q©čiìĉ|ÍI¥ć¥]ª§D{ŝŖÉR_sÿc³ĪōƿÎ§p[ĉc¯bKmR¥{³Ze^wx¹dƽÅ½ôIg §Mĕ ƹĴ¿ǣÜÍ]Ý]snåA{eƭ`ǻŊĿ\\ĳŬűYÂÿ¬jĖqßb¸L«¸©@ěĀ©ê¶ìÀEH|´bRľÓ¶rÀQþvl®ÕETzÜdb hw¤{LRdcb¯ÙVgƜßzÃôì®^jUèXÎ|UäÌ»rK\\ªN¼pZCüVY¤ɃRi^rPŇTÖ}|br°qňbĚ°ªiƶGQ¾²x¦PmlŜ[Ĥ¡ΞsĦÔÏâ\\ªÚŒU\\f¢N²§x|¤§xĔsZPòʛ²SÐqF`ªVÞŜĶƨVZÌL`¢dŐIqr\\oäõFÎ·¤»Ŷ×h¹]ClÙ\\¦ďÌį¬řtTӺƙgQÇÓHţĒ´ÃbEÄlbʔC|CŮkƮ[ʼ¬ň´KŮÈΰÌĪ¶ƶlðļATUvdTGº̼ÔsÊDÔveMg"]], "encodeOffsets": [[[105308, 37219], [95370, 40081]]] }, "properties": { "cp": [101.778916, 36.623178], "name": "青海", "childNum": 2 } }, { "id": "640000", "geometry": { "type": "Polygon", "coordinates": ["@@KëÀęĞ«Oęȿȕı]ŉ¡åįÕÔ«ǴõƪĚQÐZhv K°öqÀÑS[ÃÖHƖčËnL]ûcÙß@ĝ¾}w»»oģF¹»kÌÏ·{zP§B­¢íyÅt@@á]Yv_ssģ¼ißĻL¾ġsKD£¡N_X¸}B~HaiÅf{«x»ge_bsKF¯¡IxmELcÿZ¤­ĢÝsuBLùtYdmVtNmtOPhRw~bd¾qÐ\\âÙH\\bImlNZ»loqlVmGā§~QCw¤{A\\PKNY¯bFkC¥sks_Ã\\ă«¢ħkJi¯rrAhĹûç£CUĕĊ_ÔBixÅÙĄnªÑaM~ħpOu¥sîeQ¥¤^dkKwlL~{L~hw^ófćKyE­K­zuÔ¡qQ¤xZÑ¢^ļöÜ¾Ep±âbÊÑÆ^fk¬NC¾YpxbK~¥eÖäBlt¿Đx½I[ĒǙWf»Ĭ}d§dµùEuj¨IÆ¢¥dXªƅx¿]mtÏwßRĶX¢͎vÆzƂZò®ǢÌʆCrâºMÞzÆMÒÊÓŊZÄ¾r°Î®Ȉmª²ĈUªĚîøºĮ¦ÌĘk^FłĬhĚiĀĖ¾iİbjË"], "encodeOffsets": [[109366, 40242]] }, "properties": { "cp": [106.278179, 38.46637], "name": "宁夏", "childNum": 1 } }, { "id": "650000", "geometry": { "type": "Polygon", "coordinates": ["@@QØĔ²X¨~ǘBºjʐßØvKƔX¨vĊOÃ·¢i@~cĝe_«E}QxgɪëÏÃ@sÅyXoŖ{ô«ŸuXêÎf`C¹ÂÿÐGĮÕĞXŪōŸMźÈƺQèĽôe|¿ƸJR¤ĘEjcUóº¯Ĩ_ŘÁMª÷Ð¥OéÈ¿ÖğǤǷÂFÒzÉx[]­Ĥĝœ¦EP}ûƥé¿İƷTėƫœŕƅƱB»Đ±ēO¦E}`cȺrĦáŖuÒª«ĲπdƺÏØZƴwʄ¤ĖGĐǂZĶèH¶}ÚZצʥĪï|ÇĦMŔ»İĝǈì¥Βba­¯¥ǕǚkĆŵĦɑĺƯxūД̵nơʃĽá½M»òmqóŘĝčË¾ăCćāƿÝɽ©ǱŅ»ēėŊLrÁ®ɱĕģŉǻ̋ȥơŻǛȡVï¹Ň۩ûkɗġƁ§ʇė̕ĩũƽō^ƕUv£ƁQïƵkŏ½ΉÃŭÇ³LŇʻ«ƭ\\lŭD{ʓDkaFÃÄa³ŤđÔGRÈƚhSӹŚsİ«ĐË[¥ÚDkº^Øg¼ŵ¸£EÍöůŉT¡c_ËKYƧUśĵÝU_©rETÏʜ±OñtYwē¨{£¨uM³x½şL©Ùá[ÓÐĥ Νtģ¢\\śnkOw¥±T»ƷFɯàĩÞáB¹ÆÑUwŕĽw]kE½Èå~Æ÷QyěCFmĭZīŵVÁƿQƛûXS²b½KÏ½ĉS©ŷXĕ{ĕK·¥Ɨcqq©f¿]ßDõU³h­gËÇïģÉɋwk¯í}I·œbmÉřīJɥĻˁ×xoɹīlc¤³Xù]ǅA¿w͉ì¥wÇN·ÂËnƾƍdÇ§đ®ƝvUm©³G\\}µĿQyŹlăµEwǇQ½yƋBe¶ŋÀůo¥AÉw@{Gpm¿AĳŽKLh³`ñcËtW±»ÕSëüÿďDu\\wwwù³VLŕOMËGh£õP¡erÏd{ġWÁč|yšg^ğyÁzÙs`s|ÉåªÇ}m¢Ń¨`x¥ù^}Ì¥H«YªƅAÐ¹n~ź¯f¤áÀzgÇDIÔ´AňĀÒ¶ûEYospõD[{ù°]uJqU|Soċxţ[õÔĥkŋÞŭZËºóYËüċrw ÞkrťË¿XGÉbřaDü·Ē÷AÃª[ÄäIÂ®BÕĐÞ_¢āĠpÛÄȉĖġDKwbmÄNôfƫVÉviǳHQµâFù­Âœ³¦{YGd¢ĚÜO {Ö¦ÞÍÀP^bƾl[vt×ĈÍEË¨¡Đ~´î¸ùÎhuè`¸HÕŔVºwĠââWò@{ÙNÝ´ə²ȕn{¿¥{l÷eé^eďXj©î\\ªÑòÜìc\\üqÕ[Č¡xoÂċªbØ­ø|¶ȴZdÆÂońéG\\¼C°ÌÆn´nxÊOĨŪƴĸ¢¸òTxÊǪMīĞÖŲÃɎOvʦƢ~FRěò¿ġ~åŊúN¸qĘ[Ĕ¶ÂćnÒPĒÜvúĀÊbÖ{Äî¸~Ŕünp¤ÂH¾ĄYÒ©ÊfºmÔĘcDoĬMŬS¤s²ʘÚžȂVŦ èW°ªB|ĲXŔþÈJĦÆæFĚêYĂªĂ]øªŖNÞüAfɨJ¯ÎrDDĤ`mz\\§~D¬{vJÂ«lµĂb¤pŌŰNĄ¨ĊXW|ų ¿¾ɄĦƐMTòP÷fØĶK¢ȝ˔Sô¹òEð­`Ɩ½ǒÂň×äı§ĤƝ§C~¡hlåǺŦŞkâ~}FøàĲaĞfƠ¥Ŕd®U¸źXv¢aƆúŪtŠųƠjdƺƺÅìnrh\\ĺ¯äɝĦ]èpĄ¦´LƞĬ´ƤǬ˼Ēɸ¤rºǼ²¨zÌPðŀbþ¹ļD¢¹\\ĜÑŚ¶ZƄ³âjĦoâȴLÊȮĐ­ĚăÀêZǚŐ¤qȂ\\L¢ŌİfÆs|zºeªÙæ§΢{Ā´ƐÚ¬¨Ĵà²łhʺKÞºÖTiƢ¾ªì°`öøu®Ê¾ãÖ"], "encodeOffsets": [[88824, 50096]] }, "properties": { "cp": [87.617733, 43.792818], "name": "新疆", "childNum": 1 } }, { "id": "110000", "geometry": { "type": "Polygon", "coordinates": ["@@RºaYÕQaúÍÔiþĩȨWĢü|Ėu[qb[swP@ÅğP¿{\\¯Y²·Ñ¨j¯X\\¯MSvU¯YIŕY{[fk­VÁûtŷmiÍt_H»Ĩ±d`¹­{bwYr³S]§§o¹qGtm_SŧoaFLgQN_dV@Zom_ć\\ßW´ÕiœRcfio§ËgToÛJíĔóu|wP¤XnO¢ÉŦ¯pNÄā¤zâŖÈRpŢZÚ{GrFt¦Òx§ø¹RóäV¤XdżâºWbwŚ¨Ud®bêņ¾jnŎGŃŶnzÚScîĚZen¬"], "encodeOffsets": [[119421, 42013]] }, "properties": { "cp": [116.405285, 39.904989], "name": "北京", "childNum": 1 } }, { "id": "120000", "geometry": { "type": "Polygon", "coordinates": ["@@ŬgX§Ü«E¶FÌ¬O_ïlÁgz±AXeµÄĵ{¶]gitgIj·¥ì_iU¨ÐƎk}ĕ{gBqGf{¿aU^fIư³õ{YıëNĿk©ïËZukāAīlĕĥs¡bġ«@dekąI[nlPqCnp{ō³°`{PNdƗqSÄĻNNâyj]äÒD ĬH°Æ]~¡HO¾X}ÐxgpgWrDGpù^LrzWxZ^¨´T\\|~@IzbĤjeĊªz£®ĔvěLmV¾Ô_ÈNW~zbĬvG²ZmDM~~"], "encodeOffsets": [[120237, 41215]] }, "properties": { "cp": [117.190182, 39.125596], "name": "天津", "childNum": 1 } }, { "id": "310000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@ɧư¬EpƸÁx]", "@@©²", "@@MA", "@@QpªKWT§¨", "@@bŝÕÕEȣÚƥêImɇǦèÜĠÚÄÓŴ·ʌÇ", "@@Sô¤r]ìƬįǜûȬɋŭ×^sYɍDŋŽąñCG²«ªč@h_p¯A{oloY¬j@Ĳ`gQÚpptǀ^MĲvtbe´Rh@oj¨", "@@ÆLH{a}Eo¦"]], "encodeOffsets": [[[124702, 32062], [124547, 32200], [124808, 31991], [124726, 32110], [124903, 32376], [124065, 32166], [124870, 31965]]] }, "properties": { "cp": [121.472644, 31.231706], "name": "上海", "childNum": 7 } }, { "id": "500000", "geometry": { "type": "Polygon", "coordinates": ["@@TÂÛ`Ùƅően½SêqDu[RåÍ¹÷eXÍy¸_ĺę}÷`M¯ċfCVµqŉ÷Zgg^d½pDOÎCn^uf²ènh¼WtƏxRGg¦pVFI±G^Ic´ecGĹÞ½sëÆNäÌ¤KÓe¯|R¸§LÜkPoïƭNï¶}Gywdiù©nkĈzj@Óc£»Wă¹Óf§c[µo·Ó|MvÛaq½«è\\ÂoVnÓØÍ²«bq¿ehCĜ^Q~ Évýş¤²ĮpEĶyhsŊwH½¿gÅ¡ýE¡ya£³t\\¨\\vú¹¼©·Ñr_oÒý¥et³]Et©uÖ¥±ă©KVeë]}wVPÀFA¨ąB}qTjgRemfFmQFÝMyùnÑAmÑCawu_p¯sfÛ_gI_pNysB¦zG¸rHeN\\CvEsÐñÚkcDÖĉsaQ¯}_UzÁē}^R Äd^ÍĸZ¾·¶`wećJE¹vÛ·HgéFXjÉê`|ypxkAwWĐpb¥eOsmzwqChóUQl¥F^lafanòsrEvfQdÁUVfÎvÜ^eftET¬ôA\\¢sJnQTjPØxøK|nBzĞ»LYFDxÓvr[ehľvN¢o¾NiÂxGpâ¬zbfZo~hGi]öF||NbtOMn eA±tPTLjpYQ|SHYĀxinzDJÌg¢và¥Pg_ÇzIIII£®S¬ØsÎ¼¥¨^LnGĲļĲƤjÎƀƾ¹¸ØÎezĆT¸}êÐqHðqĖä¥^CÆIj²p\\_ æüY|[YxƊæu°xb®Űb@~¢NQt°¶Sæ Ê~rǉĔëĚ¢~uf`faĔJåĊnÔ]jƎćÊ@£¾a®£Ű{ŶĕFègLk{Y|¡ĜWƔtƬJÑxq±ĢN´òKLÈÃ¼D|s`ŋć]Ã`đMùƱ¿~Y°ħ`ƏíW½eI½{aOIrÏ¡ĕŇapµÜƃġ²"], "encodeOffsets": [[111728, 31311]] }, "properties": { "cp": [106.504962, 29.533155], "name": "重庆", "childNum": 1 } }, { "id": "810000", "geometry": { "type": "MultiPolygon", "coordinates": [["@@AlFi", "@@mp", "@@EpHo", "@@rMUwAS¬]", "@@ea¢pl¸Eõ¹hj[]ÔCÎ@lj¡uBX´AI¹[yDU]W`çwZkmcMpÅv}IoJlcafŃK°ä¬XJmÐ đhI®æÔtSHnEÒrÄc"]], "encodeOffsets": [[[117111, 23002], [117072, 22876], [117045, 22887], [116882, 22747], [116975, 23082]]] }, "properties": { "cp": [114.173355, 22.320048], "name": "香港", "childNum": 5 } }, { "id": "820000", "geometry": { "type": "Polygon", "coordinates": ["@@áw{Îr"], "encodeOffsets": [[116285, 22746]] }, "properties": { "cp": [113.54909, 22.198951], "name": "澳门", "childNum": 1 } }], "UTF8Encoding": true });
});

/***/ }),

/***/ "../../xadmin-dashboard/src/widgets/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-dashboard/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _HtmlPart = __webpack_require__("../../xadmin-dashboard/src/widgets/HtmlPart.js");

var _HtmlPart2 = _interopRequireDefault(_HtmlPart);

var _EChartContainer = __webpack_require__("../../xadmin-dashboard/src/widgets/EChartContainer.js");

var _EChartContainer2 = _interopRequireDefault(_EChartContainer);

var _MapContainer = __webpack_require__("../../xadmin-dashboard/src/widgets/MapContainer.js");

var _MapContainer2 = _interopRequireDefault(_MapContainer);

var _containers = __webpack_require__("../../xadmin-dashboard/src/containers/index.js");

var _containers2 = _interopRequireDefault(_containers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _extends3.default)({
  html: _HtmlPart2.default,
  'xadmin-dashboard/container/EChartContainer': _EChartContainer2.default,
  'xadmin-dashboard/container/MapContainer': _MapContainer2.default
}, _containers2.default);

/***/ }),

/***/ "../../xadmin-dashboard/src/wrap.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _xadminCore.StoreWrap)({

  contextTypes: {
    dashboardPath: _react2.default.PropTypes.object
  },

  getState: function getState(context) {
    var store = context.store,
        dashboardPath = context.dashboardPath;

    var state = store.getState();

    return { dashboard: dashboardPath ? dashboardPath(state) : state.dashboard };
  }
});

/***/ }),

/***/ "../../xadmin-form/src/components/Textarea.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-form/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var input = _ref.input,
      label = _ref.label,
      meta = _ref.meta,
      field = _ref.field,
      FieldGroup = _ref.group;

  return _react2.default.createElement(
    FieldGroup,
    { label: label, meta: meta, input: input, field: field },
    _react2.default.createElement(_reactBootstrap.FormControl, (0, _extends3.default)({ componentClass: 'textarea' }, input, field.attrs))
  );
};

/***/ }),

/***/ "./dashboard/dashboard.json":
/***/ (function(module, exports) {

module.exports = {"params":{},"cells":{"xadmin-dashboard_container_grid_esd3zh932":{"type":"xadmin-dashboard/container/grid","parent":"root","layout":[{"i":"html_s4l98l4qh","x":7,"y":0,"w":6,"h":3,"moved":false,"static":false}],"childrenCells":["html_s4l98l4qh"]},"root":{"childrenCells":["xadmin-dashboard_container_grid_esd3zh932"]},"html_s4l98l4qh":{"type":"html","parent":"xadmin-dashboard_container_grid_esd3zh932","html":"123"}},"endpoints":{}}

/***/ }),

/***/ "./dashboard/editor.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _antd = __webpack_require__("../node_modules/antd/es/index.js");

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _xadminDashboard = __webpack_require__("../../xadmin-dashboard/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LoadBtn = (0, _xadminDashboard.DashboardWrap)('load.button')(function (_ref) {
  var loadData = _ref.loadData;
  return _react2.default.createElement(
    _antd.Button,
    { onClick: loadData, icon: 'sync' },
    '\u52A0\u8F7D\u5E03\u5C40'
  );
});
var DumpBtn = (0, _xadminDashboard.DashboardWrap)('dump.button')(function (_ref2) {
  var href = _ref2.href;
  return _react2.default.createElement(
    'a',
    { download: 'dashboard.json', href: href, target: '_blank' },
    '\u70B9\u51FB\u4E0B\u8F7D\u5E03\u5C40\u6587\u4EF6'
  );
});
var PreviewBtn = function PreviewBtn() {
  return _react2.default.createElement(
    _antd.Button,
    { onClick: function onClick() {
        return _xadminCore.app.go('/');
      }, icon: 'eye' },
    '\u9884\u89C8'
  );
};

var DumpBtnWrap = function DumpBtnWrap() {
  return _react2.default.createElement(
    _antd.Popover,
    { trigger: 'click', rootClose: true, placement: 'bottom', content: _react2.default.createElement(DumpBtn, null) },
    _react2.default.createElement(
      _antd.Button,
      { icon: 'download' },
      '\u5BFC\u51FA\u5E03\u5C40'
    )
  );
};

var Design = _react2.default.createClass({
  displayName: 'Design',
  render: function render() {
    return _react2.default.createElement(
      'div',
      { style: { height: '100%' } },
      (0, _xadminCore.Block)('main', this),
      _react2.default.createElement(_xadminDashboard.Editor, this.props)
    );
  }
});

exports.default = {
  blocks: {
    'dashboard.menu': function dashboardMenu(_ref3) {
      var nodes = _ref3.nodes;
      return [_react2.default.createElement(LoadBtn, null), _react2.default.createElement(DumpBtnWrap, null), _react2.default.createElement(PreviewBtn, null)];
    },
    'top.left': function topLeft(_ref4) {
      var nodes = _ref4.nodes;
      return _react2.default.createElement(_xadminDashboard.Menu, null);
    }
  },
  mappers: {
    'dump.button': {
      data: function data(_ref5) {
        var dashboard = _ref5.dashboard;

        return { data: dashboard };
      },
      compute: function compute(_, _ref6) {
        var data = _ref6.data;

        var str = JSON.stringify({ params: data.params, cells: data.cells, endpoints: data.endpoints }, null, 2);
        var b64 = window.btoa(unescape(encodeURIComponent(str)));
        return { href: 'data:application/json;base64,' + b64 };
      }
    }
  },
  routers: {
    '/': {
      path: 'design',
      component: Design
    }
  }
};

/***/ }),

/***/ "./dashboard/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _xadminCore2 = _interopRequireDefault(_xadminCore);

var _xadminDashboard = __webpack_require__("../../xadmin-dashboard/src/index.js");

var _xadminDashboard2 = _interopRequireDefault(_xadminDashboard);

var _project = __webpack_require__("./dashboard/project.js");

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (true) {
  _xadminCore2.default.use(__webpack_require__("./dashboard/editor.js"));
}

var live = {
  config: {
    router: 'hash'
  },
  routers: {
    '@': {
      path: '/',
      component: function component(_ref) {
        var children = _ref.children;
        return children;
      },
      indexRoute: {
        onEnter: function onEnter(_, replace) {
          return replace({ pathname: '/show' });
        }
      }
    },
    '/': {
      path: 'show',
      component: function component(props) {
        return _react2.default.createElement(_xadminDashboard.Dashboard, (0, _extends3.default)({}, props, { editMode: false }));
      }
    }
  }
};

exports.default = _xadminCore2.default.use(_xadminDashboard2.default).use(live).use(_project2.default);

/***/ }),

/***/ "./dashboard/project.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _dashboard = __webpack_require__("./dashboard/dashboard.json");

var _dashboard2 = _interopRequireDefault(_dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  on_create_store: function on_create_store(app) {
    return function (store) {
      store.dispatch({ type: '@@x-dashboard/LOAD_DASHBOARD', payload: (0, _extends3.default)({ data: {} }, _dashboard2.default) });
    };
  }
};

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dashboard = __webpack_require__("./dashboard/index.js");

var _dashboard2 = _interopRequireDefault(_dashboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dashboard2.default.start({ container: '#app' });

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./index.js");


/***/ })

},[0]);
//# sourceMappingURL=app-3f40874c45b447200df9.js.map