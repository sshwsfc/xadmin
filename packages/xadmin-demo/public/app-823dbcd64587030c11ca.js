webpackJsonp([0],{

/***/ "../../xadmin-core/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StoreWrap = exports.Wrap = exports.BlockTag = exports.Block = exports.config = exports.app = undefined;

var _possibleConstructorReturn2 = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _objectWithoutProperties2 = __webpack_require__("../node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _toConsumableArray2 = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("../node_modules/react-dom/index.js");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = __webpack_require__("../node_modules/react-redux/es/index.js");

var _redux = __webpack_require__("../node_modules/redux/es/index.js");

var _reduxSaga = __webpack_require__("../node_modules/redux-saga/es/index.js");

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _reactRouter = __webpack_require__("../node_modules/react-router/lib/index.js");

var _effects = __webpack_require__("../node_modules/redux-saga/es/effects.js");

var _isPlainObject = __webpack_require__("../node_modules/lodash/isPlainObject.js");

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _waterfall = __webpack_require__("../node_modules/async/waterfall.js");

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
  getState: function getState(context) {
    var router = context.router;

    return { router: router };
  }
});

var StoreWrap = Wrap({
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

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _classCallCheck2 = __webpack_require__("../node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__("../node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__("../node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__("../node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _dec, _class;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Hello = (_dec = (0, _xadminCore.StoreWrap)('hello'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Hello, _React$Component);

  function Hello() {
    (0, _classCallCheck3.default)(this, Hello);
    return (0, _possibleConstructorReturn3.default)(this, (Hello.__proto__ || Object.getPrototypeOf(Hello)).apply(this, arguments));
  }

  (0, _createClass3.default)(Hello, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          count = _props.count,
          add = _props.add;

      return _react2.default.createElement(
        'div',
        null,
        count,
        ' ',
        _react2.default.createElement(
          'a',
          { onClick: add },
          '+'
        )
      );
    }
  }]);
  return Hello;
}(_react2.default.Component)) || _class);


_xadminCore.app.use({
  mappers: {
    hello: {
      data: function data(_ref, props) {
        var state = _ref.state;

        return { count: state.count };
      },
      method: {
        add: function add(_ref2) {
          var dispatch = _ref2.dispatch;
          return function () {
            dispatch({ type: 'ADD' });
          };
        }
      }
    }
  },
  reducers: {
    count: function count() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var action = arguments[1];

      if (action.type == 'ADD') {
        return state + 1;
      }
      return state;
    }
  },
  routers: {
    '@': {
      path: '/',
      component: Hello
    }
  }
}).start({ container: '#app' });

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./index.js");


/***/ })

},[0]);
//# sourceMappingURL=app-823dbcd64587030c11ca.js.map