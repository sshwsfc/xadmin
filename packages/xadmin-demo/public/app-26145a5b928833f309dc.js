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

/***/ "../../xadmin-form/src/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__("../node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm2 = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _builder = __webpack_require__("../../xadmin-form/src/builder.js");

var _ajv = __webpack_require__("../../xadmin-form/node_modules/ajv/lib/ajv.js");

var _ajv2 = _interopRequireDefault(_ajv);

var _lodash = __webpack_require__("../node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _locales = __webpack_require__("../../xadmin-form/src/locales/index.js");

var _locales2 = _interopRequireDefault(_locales);

var _schema = __webpack_require__("../../xadmin-form/src/schema.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajv = new _ajv2.default({ allErrors: true, v5: true, verbose: true });

var BaseForm = function BaseForm(props) {
  var fields = props.fields,
      render = props.render,
      option = props.option,
      component = props.component,
      handleSubmit = props.handleSubmit,
      formProps = (0, _objectWithoutProperties3.default)(props, ['fields', 'render', 'option', 'component', 'handleSubmit']);

  var build_fields = (0, _builder.objectBuilder)(fields, render, (0, _extends3.default)({}, option, formProps));
  if (component) {
    var FormComponent = component;
    return _react2.default.createElement(
      FormComponent,
      props,
      build_fields
    );
  } else {
    return _react2.default.createElement(
      'form',
      { className: 'form-horizontal', onSubmit: handleSubmit },
      build_fields
    );
  }
};

var validateByFields = function validateByFields(errors, values, fields) {
  fields.forEach(function (field) {
    if (_lodash2.default.isFunction(field.validate)) {
      var name = field.name;
      var err = field.validate(_lodash2.default.get(values, field.name) || null, values);
      if (_lodash2.default.isArray(err)) {
        errors[name] = [].concat((0, _toConsumableArray3.default)(errors[name] || []), (0, _toConsumableArray3.default)(err));
      } else if (err) {
        errors[name] = [].concat((0, _toConsumableArray3.default)(errors[name] || []), [err]);
      }
    }
  });
  return errors;
};

var Form = function Form(props) {
  var formKey = props.formKey,
      _validate = props.validate,
      fields = props.fields;

  var WrapForm = (0, _reduxForm2.reduxForm)({
    form: formKey,
    validate: function validate(values) {
      var errors = _validate ? _validate(values) : {};
      return validateByFields(errors, values, fields);
    }
  })(BaseForm);
  return _react2.default.createElement(WrapForm, props);
};

var SchemaForm = function SchemaForm(props) {
  var formKey = props.formKey,
      schema = props.schema;

  var ajValidate = ajv.compile(schema);
  var fields = (0, _schema.convert)(schema).fields;

  var WrapForm = (0, _reduxForm2.reduxForm)({
    form: formKey,
    validate: function validate(values) {
      var valid = ajValidate(_lodash2.default.omitBy(values, function (v) {
        return v == null || v === undefined || v === '';
      }));
      if (!valid) {
        var i18n = _xadminCore.app.context.i18n;

        if (_locales2.default[i18n.language]) {
          _locales2.default[i18n.language](ajValidate.errors);
        }
      }
      var errors = valid ? {} : ajValidate.errors.reduce(function (prev, err) {
        if (err.dataPath.length > 1) {
          prev[err.dataPath.substr(1)] = err.message;
        } else if (err.dataPath == '' && err.keyword == 'required') {
          prev[err.params.missingProperty] = err.message;
        }
        return prev;
      }, {});
      errors = validateByFields(errors, values, fields);
      return errors;
    }
  })(BaseForm);
  return _react2.default.createElement(WrapForm, (0, _extends3.default)({ fields: fields }, props));
};

var FormWrap = (0, _xadminCore.StoreWrap)({
  contextTypes: {
    _reduxForm: _react2.default.PropTypes.object.isRequired
  },
  getState: function getState(context) {
    var store = context.store,
        _reduxForm = context._reduxForm;

    return { form: _reduxForm, formState: _reduxForm.getFormState(store.getState()) };
  }
});

exports.default = {
  BaseForm: BaseForm,
  Form: Form,
  SchemaForm: SchemaForm,
  FormWrap: FormWrap,
  fieldBuilder: _builder.fieldBuilder,
  objectBuilder: _builder.objectBuilder,
  schemaConvert: _schema.convert
};

/***/ }),

/***/ "../../xadmin-form/src/builder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _base = __webpack_require__("../../xadmin-form/src/components/base.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultUIRender = function defaultUIRender(fields, option) {
  return fields.map(function (field) {
    return fieldBuilder(field, option);
  });
};

var objectBuilder = function objectBuilder(fields, render, option) {
  var fields_defined = _xadminCore.app.load_dict('form_fields');
  var fields_wraped = fields.filter(function (field) {
    return field.type === undefined || fields_defined[field.type] !== undefined;
  }).map(function (field) {
    return (0, _extends3.default)({}, fields_defined[field.type || 'text'], field, { option: option });
  });

  return (render || defaultUIRender)(fields_wraped, option);
};

var fieldBuilder = function fieldBuilder(field, option) {
  for (var _len = arguments.length, props = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    props[_key - 2] = arguments[_key];
  }

  return _react2.default.createElement(_reduxForm.Field, (0, _extends3.default)({ key: field.key, name: field.name, label: field.label,
    normalize: field.normalize, parse: field.parse, format: field.format,
    component: field.component, field: field,
    group: field.group || (option && option.group ? option.group : _base.FieldGroup),
    option: option
  }, props));
};

var prefixFieldKey = function prefixFieldKey(field, prefix) {
  var f = (0, _extends3.default)({}, field, { key: prefix + field.key, name: prefix + field.name });
  if (field.fields && field.fields.length > 0) {
    f.fields = field.fields.map(function (cf) {
      return prefixFieldKey(cf, prefix);
    });
  }
  return f;
};

exports.default = {
  defaultUIRender: defaultUIRender,
  objectBuilder: objectBuilder,
  fieldBuilder: fieldBuilder,
  prefixFieldKey: prefixFieldKey
};

/***/ }),

/***/ "../../xadmin-form/src/components/Array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _base = __webpack_require__("../../xadmin-form/src/components/base.js");

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

var _builder = __webpack_require__("../../xadmin-form/src/builder.js");

var _reactFontawesome = __webpack_require__("../../xadmin-form/node_modules/react-fontawesome/lib/index.js");

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

var _xadminCore2 = _interopRequireDefault(_xadminCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultItemsRender = function defaultItemsRender(_ref) {
  var fields = _ref.fields,
      _ref$meta = _ref.meta,
      touched = _ref$meta.touched,
      error = _ref$meta.error,
      field = _ref.field,
      fieldsBuilder = _ref.fieldsBuilder;
  var items = field.items,
      label = field.label;

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'h5',
      null,
      label,
      ' ',
      _react2.default.createElement(
        _reactBootstrap.Button,
        { bsSize: 'xsmall', onClick: function onClick() {
            return fields.push();
          } },
        _react2.default.createElement(_reactFontawesome2.default, { name: 'plus' })
      )
    ),
    _react2.default.createElement(
      _reactBootstrap.PanelGroup,
      { accordion: true },
      fields.map(function (name, index) {
        var removeBtn = _react2.default.createElement(
          _reactBootstrap.Button,
          { bsSize: 'xsmall', onClick: function onClick() {
              return fields.remove(index);
            }, style: { float: 'right' } },
          _react2.default.createElement(_reactFontawesome2.default, { name: 'minus' })
        );
        var itemLable = _react2.default.createElement(
          'h6',
          null,
          label + ' ' + (index + 1),
          removeBtn
        );
        var fieldsComponent = fieldsBuilder(name, index, removeBtn);
        return fieldsComponent.length > 1 ? _react2.default.createElement(
          _reactBootstrap.Panel,
          { header: itemLable, eventKey: index, key: 'items' + index },
          fieldsComponent
        ) : _react2.default.createElement(
          'div',
          null,
          fieldsComponent
        );
      })
    ),
    touched && error ? error : null
  );
};

exports.default = function (_ref2) {
  var input = _ref2.input,
      label = _ref2.label,
      _ref2$meta = _ref2.meta,
      touched = _ref2$meta.touched,
      error = _ref2$meta.error,
      field = _ref2.field,
      option = _ref2.option;

  var renderItems = field.itemsRender || defaultItemsRender;
  if (typeof renderItems === 'string') {
    renderItems = _xadminCore2.default.load_dict('array_render')[renderItems];
  }
  var items = field.items;

  var fieldsBuilder = function fieldsBuilder(name, index, removeBtn, itemLable) {
    var label = itemLable || _react2.default.createElement(
      'div',
      null,
      removeBtn ? removeBtn : '',
      label + ' ' + (index + 1)
    );
    var itemFields = items.fields ? items.fields.map(function (f) {
      return (0, _builder.prefixFieldKey)(f, name + '.');
    }) : [(0, _extends3.default)({}, items, { key: name, name: name, label: label })];

    return (0, _builder.objectBuilder)(itemFields, items.render, option);
  };
  return _react2.default.createElement(_reduxForm.FieldArray, { name: field.name, label: label, component: renderItems, field: field, fieldsBuilder: fieldsBuilder });
};

/***/ }),

/***/ "../../xadmin-form/src/components/Checkbox.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

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
    { label: '', meta: meta, input: input, field: field },
    _react2.default.createElement(
      _reactBootstrap.Checkbox,
      (0, _extends3.default)({ checked: !!input.value }, input, field.attrs),
      label
    )
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/DateTime.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__("../node_modules/babel-runtime/helpers/objectWithoutProperties.js");

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _moment = __webpack_require__("../../xadmin-i18n/node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _reactFontawesome = __webpack_require__("../../xadmin-form/node_modules/react-fontawesome/lib/index.js");

var _reactFontawesome2 = _interopRequireDefault(_reactFontawesome);

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

var _reactDatetime = __webpack_require__("../../xadmin-form/node_modules/react-datetime/DateTime.js");

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__("../../xadmin-form/node_modules/react-datetime/css/react-datetime.css");

exports.default = function (_ref) {
  var input = _ref.input,
      label = _ref.label,
      meta = _ref.meta,
      field = _ref.field,
      FieldGroup = _ref.group;
  var onChange = input.onChange,
      onBlur = input.onBlur,
      onFocus = input.onFocus,
      value = input.value,
      inputProps = (0, _objectWithoutProperties3.default)(input, ['onChange', 'onBlur', 'onFocus', 'value']);

  return _react2.default.createElement(
    FieldGroup,
    { label: label, meta: meta, input: input, field: field },
    _react2.default.createElement(
      _reactBootstrap.InputGroup,
      { style: { maxWidth: 280 } },
      _react2.default.createElement(_reactDatetime2.default, (0, _extends3.default)({ inputProps: inputProps, onChange: onChange, onBlur: onBlur, onFocus: onFocus }, field.attrs, { value: (0, _moment2.default)(value) })),
      _react2.default.createElement(
        _reactBootstrap.InputGroup.Addon,
        null,
        _react2.default.createElement(_reactFontawesome2.default, { name: 'calendar' })
      )
    )
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/Fieldset.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

var _builder = __webpack_require__("../../xadmin-form/src/builder.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var input = _ref.input,
      label = _ref.label,
      _ref$meta = _ref.meta,
      touched = _ref$meta.touched,
      error = _ref$meta.error,
      field = _ref.field,
      group = _ref.group,
      option = _ref.option;

  return _react2.default.createElement(
    _reactBootstrap.Panel,
    { collapsible: true, defaultExpanded: true, header: _react2.default.createElement(
        'h3',
        null,
        label
      ) },
    (0, _builder.objectBuilder)(field.fields, field.render, (0, _extends3.default)({}, option, { group: group }))
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/RadioBtn.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

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
    _react2.default.createElement(
      _reactBootstrap.ButtonToolbar,
      null,
      field.titleMap.map(function (option) {
        return _react2.default.createElement(
          _reactBootstrap.Button,
          (0, _extends3.default)({ key: option.value,
            bsStyle: option.value == input.value ? 'primary' : 'default', active: option.value == input.value
          }, input, {
            onClick: function onClick() {
              input.onChange(option.value);
            } }),
          option.name
        );
      })
    )
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/Radios.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

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

  var inline = field.attrs !== undefined && !!field.attrs.inline;
  return _react2.default.createElement(
    FieldGroup,
    { label: label, meta: meta, input: input, field: field },
    field.titleMap.map(function (option) {
      return _react2.default.createElement(
        _reactBootstrap.Radio,
        (0, _extends3.default)({ key: option.value, checked: option.value == input.value, inline: inline }, input, { value: option.value }),
        ' ',
        option.name
      );
    })
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/Select.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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
    _react2.default.createElement(
      _reactBootstrap.FormControl,
      (0, _extends3.default)({ componentClass: 'select'
      }, input),
      [{ name: '----', value: '' }].concat((0, _toConsumableArray3.default)(field.titleMap)).map(function (option) {
        return _react2.default.createElement(
          'option',
          { key: option.name, value: option.value },
          option.name
        );
      })
    )
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/Text.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

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
    _react2.default.createElement(_reactBootstrap.FormControl, (0, _extends3.default)({}, input, field.attrs))
  );
};

/***/ }),

/***/ "../../xadmin-form/src/components/Textarea.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

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

/***/ "../../xadmin-form/src/components/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__("../../xadmin-form/node_modules/react-bootstrap/es/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldGroup = function FieldGroup(_ref) {
  var label = _ref.label,
      meta = _ref.meta,
      input = _ref.input,
      field = _ref.field,
      children = _ref.children;

  var groupProps = {};
  var attrs = field.attrs || {};
  var error = meta.touched && meta.error;
  var help = field.description || field.help;
  var size = field.option && field.option.groupSize || attrs.groupSize || {
    label: {
      sm: 4, md: 3, lg: 2
    },
    control: {
      sm: 8, md: 9, lg: 10
    }
  };

  if (error) {
    groupProps['validationState'] = 'error';
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize;
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle;
  }

  var controlComponent = children ? children : _react2.default.createElement(_reactBootstrap.FormControl, (0, _extends3.default)({}, input, attrs));
  return _react2.default.createElement(
    _reactBootstrap.FormGroup,
    (0, _extends3.default)({ controlId: input.name }, groupProps),
    _react2.default.createElement(
      _reactBootstrap.Col,
      (0, _extends3.default)({ key: 0, componentClass: _reactBootstrap.ControlLabel }, size.label),
      label,
      field && field.required ? _react2.default.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      ) : ''
    ),
    _react2.default.createElement(
      _reactBootstrap.Col,
      (0, _extends3.default)({ key: 1 }, size.control),
      controlComponent,
      _react2.default.createElement(_reactBootstrap.FormControl.Feedback, null),
      help && _react2.default.createElement(
        _reactBootstrap.HelpBlock,
        null,
        help
      ),
      error && _react2.default.createElement(
        _reactBootstrap.HelpBlock,
        null,
        error
      )
    )
  );
};

var InlineGroup = function InlineGroup(_ref2) {
  var label = _ref2.label,
      meta = _ref2.meta,
      input = _ref2.input,
      field = _ref2.field,
      children = _ref2.children;

  var groupProps = {};
  var attrs = field.attrs || {};
  var error = meta.touched && meta.error;
  var help = field.description || field.help;

  if (error) {
    groupProps['validationState'] = 'error';
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize;
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle;
  }

  var controlComponent = children ? children : _react2.default.createElement(_reactBootstrap.FormControl, (0, _extends3.default)({}, input, attrs, { placeholder: label }));
  return _react2.default.createElement(
    _reactBootstrap.FormGroup,
    (0, _extends3.default)({ controlId: input.name }, groupProps),
    _react2.default.createElement(
      _reactBootstrap.Col,
      { sm: 12 },
      controlComponent,
      help && _react2.default.createElement(
        _reactBootstrap.HelpBlock,
        null,
        help
      ),
      error && _react2.default.createElement(
        _reactBootstrap.HelpBlock,
        null,
        error
      )
    )
  );
};

var SimpleGroup = function SimpleGroup(_ref3) {
  var label = _ref3.label,
      meta = _ref3.meta,
      input = _ref3.input,
      field = _ref3.field,
      children = _ref3.children;

  var groupProps = {};
  var attrs = field.attrs || {};
  var error = meta.touched && meta.error;
  var help = field.description || field.help;

  if (error) {
    groupProps['validationState'] = 'error';
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize;
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle;
  }

  var controlComponent = children ? children : _react2.default.createElement(_reactBootstrap.FormControl, (0, _extends3.default)({}, input, attrs, { placeholder: label }));
  return _react2.default.createElement(
    _reactBootstrap.FormGroup,
    (0, _extends3.default)({ controlId: input.name }, groupProps),
    _react2.default.createElement(
      _reactBootstrap.ControlLabel,
      null,
      label,
      field && field.required ? _react2.default.createElement(
        'span',
        { className: 'text-danger' },
        '*'
      ) : ''
    ),
    controlComponent,
    help && _react2.default.createElement(
      _reactBootstrap.HelpBlock,
      null,
      help
    ),
    error && _react2.default.createElement(
      _reactBootstrap.HelpBlock,
      null,
      error
    )
  );
};

exports.default = {
  FieldGroup: FieldGroup,
  InlineGroup: InlineGroup,
  SimpleGroup: SimpleGroup
};

/***/ }),

/***/ "../../xadmin-form/src/components/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Text = __webpack_require__("../../xadmin-form/src/components/Text.js");

var _Text2 = _interopRequireDefault(_Text);

var _Select = __webpack_require__("../../xadmin-form/src/components/Select.js");

var _Select2 = _interopRequireDefault(_Select);

var _Checkbox = __webpack_require__("../../xadmin-form/src/components/Checkbox.js");

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Radios = __webpack_require__("../../xadmin-form/src/components/Radios.js");

var _Radios2 = _interopRequireDefault(_Radios);

var _RadioBtn = __webpack_require__("../../xadmin-form/src/components/RadioBtn.js");

var _RadioBtn2 = _interopRequireDefault(_RadioBtn);

var _Textarea = __webpack_require__("../../xadmin-form/src/components/Textarea.js");

var _Textarea2 = _interopRequireDefault(_Textarea);

var _DateTime = __webpack_require__("../../xadmin-form/src/components/DateTime.js");

var _DateTime2 = _interopRequireDefault(_DateTime);

var _Fieldset = __webpack_require__("../../xadmin-form/src/components/Fieldset.js");

var _Fieldset2 = _interopRequireDefault(_Fieldset);

var _Array = __webpack_require__("../../xadmin-form/src/components/Array.js");

var _Array2 = _interopRequireDefault(_Array);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Text: _Text2.default,
  Select: _Select2.default,
  Checkbox: _Checkbox2.default,
  Radios: _Radios2.default,
  RadioBtn: _RadioBtn2.default,
  Textarea: _Textarea2.default,
  DateTime: _DateTime2.default,
  Fieldset: _Fieldset2.default,
  ArrayWidget: _Array2.default
};
//import Selectize from './Selectize'

/***/ }),

/***/ "../../xadmin-form/src/fields.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _components = __webpack_require__("../../xadmin-form/src/components/index.js");

var _components2 = _interopRequireDefault(_components);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  text: {
    component: _components2.default.Text
  },
  number: {
    component: _components2.default.Text,
    normalize: function normalize(value, previousValue) {
      var ret = parseFloat(value);
      return Number.isNaN(ret) ? value : ret;
    },
    attrs: {
      type: 'number',
      style: { maxWidth: 200 }
    }
  },
  integer: {
    component: _components2.default.Text,
    normalize: function normalize(value, previousValue) {
      var ret = parseInt(value);
      return Number.isNaN(ret) ? value : ret;
    },
    attrs: {
      type: 'number',
      style: { maxWidth: 200 }
    }
  },
  select: {
    component: _components2.default.Select
  },
  numselect: {
    component: _components2.default.Select,
    normalize: function normalize(value, previousValue) {
      var ret = parseFloat(value);
      return Number.isNaN(ret) ? value : ret;
    }
  },
  date: {
    component: _components2.default.DateTime,
    normalize: function normalize(value, previousValue) {
      return value && value.format ? value.format('YYYY-MM-DD') : value || previousValue;
    },
    attrs: {
      dateFormat: true,
      timeFormat: false,
      valueFormat: 'L'
    }
  },
  time: {
    component: _components2.default.DateTime,
    normalize: function normalize(value, previousValue) {
      return value && value.format ? value.format('HH:mm:ss') : value || previousValue;
    },
    attrs: {
      dateFormat: false,
      timeFormat: true,
      viewMode: 'time',
      valueFormat: 'LT'
    }
  },
  datetime: {
    component: _components2.default.DateTime,
    normalize: function normalize(value, previousValue) {
      return value && value.format ? value.format('YYYY-MM-DD HH:mm:ss') : value || previousValue;
    },
    attrs: {
      dateFormat: true,
      timeFormat: true,
      valueFormat: 'L LT'
    }
  },
  bool: {
    component: _components2.default.Checkbox,
    normalize: function normalize(value, previousValue) {
      return Boolean(value);
    }
  },
  checkbox: {
    component: _components2.default.Checkbox
  },
  fieldset: {
    component: _components2.default.Fieldset
  },
  array: {
    component: _components2.default.ArrayWidget
  }
};

/***/ }),

/***/ "../../xadmin-form/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _ajv = __webpack_require__("../../xadmin-form/node_modules/ajv/lib/ajv.js");

var _ajv2 = _interopRequireDefault(_ajv);

var _fields = __webpack_require__("../../xadmin-form/src/fields.js");

var _fields2 = _interopRequireDefault(_fields);

var _schema = __webpack_require__("../../xadmin-form/src/schema.js");

var _base = __webpack_require__("../../xadmin-form/src/base.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ajv = new _ajv2.default({ allErrors: true });

exports.default = {
  BaseForm: _base.BaseForm,
  Form: _base.Form,
  SchemaForm: _base.SchemaForm,
  FormWrap: _base.FormWrap,
  fieldBuilder: _base.fieldBuilder,
  objectBuilder: _base.objectBuilder,
  schemaConvert: _base.schemaConvert,
  SubmissionError: _reduxForm.SubmissionError,
  app: {
    start: function start(app) {
      return function () {
        app.load_list('ajv_key').forEach(function (args) {
          ajv.addKeyword(args[0], args[1]);
        });
        app.load_list('ajv_format').forEach(function (args) {
          ajv.addFormat(args[0], args[1]);
        });
      };
    },
    reducers: function reducers(app) {
      var plugins = app.load_dict('form_reducer');
      return { form: _reduxForm.reducer.plugin(plugins) };
    },
    form_fields: _fields2.default,
    schema_converter: _schema.converters
  }
};

/***/ }),

/***/ "../../xadmin-form/src/locales/en.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajvI18n = __webpack_require__("../../xadmin-form/node_modules/ajv-i18n/localize/index.js");

exports.default = function (errors) {
  (0, _ajvI18n.en)(errors);

  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out = void 0;
    var schema = e.schema;
    switch (e.keyword) {
      case 'required':
        {
          var pname = e.params.missingProperty;
          out = (e.schema[pname] && e.schema[pname].title || pname) + ' should required';
          break;
        }
      default:
        continue;
    }
    e.message = out;
  }
};

/***/ }),

/***/ "../../xadmin-form/src/locales/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _ajvI18n = __webpack_require__("../../xadmin-form/node_modules/ajv-i18n/localize/index.js");

var _ajvI18n2 = _interopRequireDefault(_ajvI18n);

var _zh_Hans = __webpack_require__("../../xadmin-form/src/locales/zh_Hans.js");

var _zh_Hans2 = _interopRequireDefault(_zh_Hans);

var _en = __webpack_require__("../../xadmin-form/src/locales/en.js");

var _en2 = _interopRequireDefault(_en);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _extends3.default)({}, _ajvI18n2.default, {
  en: _en2.default,
  zh_Hans: _zh_Hans2.default
});

/***/ }),

/***/ "../../xadmin-form/src/locales/zh_Hans.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (errors) {
  if (!(errors && errors.length)) return;
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var out = void 0;
    var schema = e.schema;
    switch (e.keyword) {
      case '$ref':
        {
          out = '无法找到引用' + e.params.ref;
          break;
        }
      case 'additionalItems':
        {
          out = '';
          var n = e.params.limit;
          out += '不允许超过' + n + '个元素';
          break;
        }
      case 'additionalProperties':
        {
          out = '不允许有额外的属性';
          break;
        }
      case 'anyOf':
        {
          out = '数据应为 anyOf 所指定的其中一个';
          break;
        }
      case 'constant':
        {
          out = schema.constantName ? '与 ' + schema.constantName + ' 不相等' : '应当等于常量';
          break;
        }
      case 'custom':
        {
          out = '应当通过 "' + e.keyword + ' 关键词校验"';
          break;
        }
      case 'dependencies':
        {
          out = '';
          var _n = e.params.depsCount;
          out += '应当拥有属性' + e.params.property + '的依赖属性' + e.params.deps;
          break;
        }
      case 'enum':
        {
          out = '应当是预设定的枚举值之一';
          break;
        }
      case 'format':
        {
          out = '应当匹配格式' + e.params.format;
          break;
        }
      case 'formatExclusiveMaximum':
        {
          out = 'formatExclusiveMaximum 应当是布尔值';
          break;
        }
      case 'formatExclusiveMinimum':
        {
          out = 'formatExclusiveMinimum 应当是布尔值';
          break;
        }
      case 'formatMaximum':
        {
          out = '';
          var cond = e.params.comparison + ' ' + e.params.limit;
          out += '应当是 ' + cond;
          break;
        }
      case 'formatMinimum':
        {
          out = '';
          var _cond = e.params.comparison + ' ' + e.params.limit;
          out += '应当是 ' + _cond;
          break;
        }
      case 'maxItems':
        {
          out = '';
          var _n2 = e.params.limit;
          out += '不应多于 ' + _n2 + ' 个项';
          break;
        }
      case 'maxLength':
        {
          out = '';
          var _n3 = e.params.limit;
          out += '不应多于 ' + _n3 + ' 个字符';
          break;
        }
      case 'maxProperties':
        {
          out = '';
          var _n4 = e.params.limit;
          out += '不应有多于 ' + _n4 + ' 个属性';
          break;
        }
      case 'maximum':
        {
          out = '';
          var _cond2 = e.params.comparison + ' ' + e.params.limit;
          out += '应当为 ' + _cond2;
          break;
        }
      case 'minItems':
        {
          out = '';
          var _n5 = e.params.limit;
          out += '不应少于 ' + _n5 + ' 个项';
          break;
        }
      case 'minLength':
        {
          out = '';
          var _n6 = e.params.limit;
          out += '不应少于 ' + _n6 + ' 个字符';
          break;
        }
      case 'minProperties':
        {
          out = '';
          var _n7 = e.params.limit;
          out += '不应有少于 ' + _n7 + ' 个属性';
          break;
        }
      case 'minimum':
        {
          out = '';
          var _cond3 = e.params.comparison + ' ' + e.params.limit;
          out += '应当为 ' + _cond3;
          break;
        }
      case 'multipleOf':
        {
          out = '应当是 ' + e.params.multipleOf + ' 的整数倍';
          break;
        }
      case 'not':
        {
          out = '不应当匹配 "not" schema';
          break;
        }
      case 'oneOf':
        {
          out = '只能匹配一个 oneOf 中的 schema';
          break;
        }
      case 'pattern':
        {
          out = '应当匹配模式 "' + e.params.pattern + '"';
          break;
        }
      case 'patternGroups':
        {
          out = '';
          var _n8 = e.params.limit;
          out += '应当有 ' + _n8 + ' 个 ' + e.params.reason + ' 属性满足模式 ' + e.params.pattern;
          break;
        }
      case 'patternRequired':
        {
          out = '应当有属性匹配模式 ' + e.params.missingPattern;
          break;
        }
      case 'required':
        {
          var pname = e.params.missingProperty;
          out = (e.schema[pname] && e.schema[pname].title || pname) + '不能为空';
          break;
        }
      case 'switch':
        {
          out = '由于 ' + e.params.caseIndex + ' 失败，未通过 "switch" 校验, ';
          break;
        }
      case 'type':
        {
          out = '应当是 ' + e.params.type + ' 类型';
          break;
        }
      case 'uniqueItems':
        {
          out = '不应当含有重复项 (第 ' + e.params.j + ' 项与第 ' + e.params.i + ' 项是重复的)';
          break;
        }
      default:
        continue;
    }
    e.message = out;
  }
};

/***/ }),

/***/ "../../xadmin-form/src/schema.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.converters = exports.convert = undefined;

var _toConsumableArray2 = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = __webpack_require__("../node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _xadminCore = __webpack_require__("../../xadmin-core/src/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripNullType = function stripNullType(type) {
  if (Array.isArray(type) && type.length == 2) {
    if (type[0] === 'null') return type[1];
    if (type[1] === 'null') return type[0];
  }
  return type;
};

var enumToTitleMap = function enumToTitleMap(enm, title) {
  var titleMap = [];
  enm.forEach(function (name, index) {
    titleMap.push({ name: title != undefined ? (_lodash2.default.isArray(title) ? title[index] : title[name]) || name : name, value: name });
  });
  return titleMap;
};

var canonicalTitleMap = function canonicalTitleMap(titleMap, originalEnum) {
  if (!_lodash2.default.isArray(titleMap)) {
    var canonical = [];
    if (originalEnum) {
      originalEnum.forEach(function (value) {
        canonical.push({ name: titleMap[value], value: value });
      });
    } else {
      for (var k in titleMap) {
        if (titleMap.hasOwnProperty(k)) {
          canonical.push({ name: k, value: titleMap[k] });
        }
      }
    }
    return canonical;
  }
  return titleMap;
};

var convert = function convert(schema, options) {
  var opts = options || {};
  if (opts.path === undefined) {
    opts.path = [];
  }
  if (opts.lookup === undefined) {
    opts.lookup = {};
  }
  return _xadminCore.app.load_list(opts.convert_key || 'schema_converter').reduce(function (prve, converter) {
    return converter(prve, schema, opts);
  }, opts.global && opts.global.formDefaults ? _lodash2.default.cloneDeep(opts.global.formDefaults) : {});
};

var converters = [
// all form field
function (f, schema, options) {
  var path = options.path,
      readonly = options.readonly,
      required = options.required,
      lookup = options.lookup;


  var fieldKey = path.length > 0 ? path[path.length - 1] : undefined;
  f.key = path.join('.');

  f.name = f.key;
  f.label = schema.title || _lodash2.default.startCase(fieldKey);

  if (fieldKey !== undefined) {
    if (readonly && readonly.indexOf(fieldKey) !== -1) {
      f.readonly = true;
    }
    if (required && required.indexOf(fieldKey) !== -1) {
      f.required = true;
    }
  }

  if (schema.description) {
    f.description = schema.description;
  }
  if (schema.maxLength) {
    f.maxlength = schema.maxLength;
  }
  if (schema.minLength) {
    f.minlength = schema.minLength;
  }
  if (schema.minimum) {
    f.minimum = schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
  }
  if (schema.maximum) {
    f.maximum = schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
  }

  if (schema.validationMessage) {
    f.validationMessage = schema.validationMessage;
  }
  if (schema.enumNames) {
    f.titleMap = canonicalTitleMap(schema.enumNames, schema['enum']);
  }

  f.schema = schema;
  lookup[f.key] = f;

  return f;
},
// object
function (f, schema, options) {
  if (stripNullType(schema.type) === 'object') {
    f.type = 'fieldset';

    var props = schema.properties;
    var opts = (0, _extends3.default)({}, options);

    opts.required = schema.required || [];
    opts.readonly = schema.readonly || [];
    opts.ignore = schema.ignore || [];

    var _reduce = (schema.form || ['*']).reduce(function (ret, field) {
      if (typeof field === 'string') {
        if (field != '*' || ret.keys.indexOf('*') == -1) {
          ret.keys.push(field);
        }
        if (field != '*') {
          ret.form[field] = { key: field };
        }
      } else if (field.key !== undefined) {
        ret.keys.push(field.key);
        ret.form[field.key] = field;
      }
      return ret;
    }, { keys: [], form: {} }),
        keys = _reduce.keys,
        form = _reduce.form;

    var idx = keys.indexOf('*');

    if (idx !== -1) {
      keys = keys.slice(0, idx).concat(Object.keys(props).filter(function (pk) {
        return keys.indexOf(pk) == -1;
      })).concat(keys.slice(idx + 1));
    }

    var fields = keys.filter(function (key) {
      return opts.ignore.indexOf(key) === -1;
    }).map(function (key) {
      opts.path = [].concat((0, _toConsumableArray3.default)(options.path), [key]);
      return props[key] !== undefined ? _lodash2.default.merge(convert(props[key], opts), form[key] || {}) : form[key];
    });

    f.render = schema.form_render;
    f.fields = fields;
  }
  return f;
},
// array
function (f, schema, options) {
  if (stripNullType(schema.type) === 'array') {
    f.type = 'array';

    if (typeof schema.items !== 'undefined') {
      f.items = convert(schema.items, (0, _extends3.default)({}, options, { path: [] }));
    }
    if (schema.itemsRender) f.itemsRender = schema.itemsRender;
  }
  return f;
},
// all normal type form field
function (f, schema, options) {
  if (f.type !== undefined) {
    return f;
  }
  var schema_type = stripNullType(schema.type);
  if (schema_type === 'string') {
    if (!schema['enum']) {
      f.type = 'text';
    } else {
      f.type = 'select';
      if (!f.titleMap) {
        f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {});
      }
    }
    switch (schema.format) {
      case 'date':
        f.type = 'date';
        break;
      case 'time':
        f.type = 'time';
        break;
      case 'datetime':
        f.type = 'datetime';
        break;
    }
  } else if (schema_type === 'number') {
    if (!schema['enum']) {
      f.type = 'number';
    } else {
      f.type = 'numselect';
      if (!f.titleMap) {
        f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {});
      }
    }
  } else if (schema_type === 'integer') {
    if (!schema['enum']) {
      f.type = 'integer';
    } else {
      f.type = 'numselect';
      if (!f.titleMap) {
        f.titleMap = enumToTitleMap(schema['enum'], schema['enum_title'] || {});
      }
    }
  } else if (schema_type === 'boolean') {
    f.type = 'checkbox';
  }
  return f;
}];

exports.convert = convert;
exports.converters = converters;

/***/ }),

/***/ "../../xadmin-i18n/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = __webpack_require__("../node_modules/babel-runtime/helpers/toConsumableArray.js");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = __webpack_require__("../node_modules/lodash/lodash.js");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__("../../xadmin-i18n/node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _i18next = __webpack_require__("../../xadmin-i18n/node_modules/i18next/dist/es/index.js");

var _i18next2 = _interopRequireDefault(_i18next);

var _i18nextXhrBackend = __webpack_require__("../../xadmin-i18n/node_modules/i18next-xhr-backend/index.js");

var _i18nextXhrBackend2 = _interopRequireDefault(_i18nextXhrBackend);

var _i18nextLocalstorageCache = __webpack_require__("../../xadmin-i18n/node_modules/i18next-localstorage-cache/index.js");

var _i18nextLocalstorageCache2 = _interopRequireDefault(_i18nextLocalstorageCache);

var _i18nextBrowserLanguagedetector = __webpack_require__("../../xadmin-i18n/node_modules/i18next-browser-languagedetector/index.js");

var _i18nextBrowserLanguagedetector2 = _interopRequireDefault(_i18nextBrowserLanguagedetector);

var _translation = __webpack_require__("../../xadmin-i18n/src/zh_Hans/translation.json");

var _translation2 = _interopRequireDefault(_translation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var locales = {
  zh_Hans: {
    translation: _translation2.default
  }
};

exports.default = {
  name: 'xadmin.i18n',
  context: function context(app) {
    return function (context, cb) {
      var resources = app.load_dict_list('locales');

      var _app$load_dict = app.load_dict('config'),
          locale = _app$load_dict.locale;

      for (var ln in resources) {
        resources[ln] = _lodash2.default.merge.apply(_lodash2.default, [{}].concat((0, _toConsumableArray3.default)(resources[ln])));
      }
      _i18next2.default.use(_i18nextXhrBackend2.default) // or any other backend implementation
      .use(_i18nextLocalstorageCache2.default) // or any other cache implementation
      .use(_i18nextBrowserLanguagedetector2.default) // or any other implementation
      .init((0, _extends3.default)({
        debug: false,
        lng: 'en',
        fallbackLng: false,
        keySeparator: false,
        nsSeparator: false,
        resources: resources
      }, locale || {}), function (err, t) {
        _moment2.default.locale(locale && locale.moment || 'en');
        cb(null, (0, _extends3.default)({}, context, { _t: t, i18n: _i18next2.default }));
      });
    };
  },
  locales: locales
};

/***/ }),

/***/ "../../xadmin-i18n/src/zh_Hans/translation.json":
/***/ (function(module, exports) {

module.exports = {"Actions":"操作","Add {{object}}":"添加{{object}}","Batch Change Items":"批量修改","Batch Delete Items":"批量删除","Batch Save {{object}} success":"批量保存 {{object}} 成功","Captcha Code":"验证码","Change":"修改","Change Password":"修改密码","Change password":"修改密码","Change password success":"修改密码成功","Clear":"清除","Clear order":"取消排序","Click to refresh captcha code":"点击更新验证码","Close":"关闭","Columns":"显示列","Comfirm":"确认","Comfirm Delete":"确认删除","Confirm to delete selected items":"请确认删除选择的条目","Create {{name}}":"创建{{name}}","Create {{object}} success":"添加{{object}}成功","Create {{title}}":"添加{{title}}","Customize page size":"自定义每页数目","Date Joined":"注册日期","Delete":"删除","Delete {{object}} success":"删除{{object}}成功","Description":"描述","Edit":"修改","Edit {{name}}":"编辑{{name}}","Edit {{title}}":"修改{{title}}","Email":"Email","Email Verified":"Email已验证","Enter page size":"输入每页数目","Filter":"过滤","Filter Form":"数据过滤表单","Forgot password":"忘记密码","Have account":"已注册账号","Incorrect old password":"原密码输入错误","Incorrect username or password":"用户名或密码错误","Is SuperUser":"超级用户","Login":"登录","Logout":"退出","Name":"姓名","New Password":"新密码","No Data":"暂无数据","No data selected":"未选择任何数据","No paging":"无分页","No results found":"未找到数据","Not registed":"还没有注册","Null":"空","Old Password":"原密码","Page Size":"每页数目","Password":"密码","Permission":"权限","Please Login":"请您登录","Please Signup":"请您注册","Please be sure to complete all field":"请您填写完整所有表单项","Please input the value to batch change items":"批量修改数据","Register Email":"注册的Email","Register success":"注册用户成功","Repeat Password":"重复密码","Reset Password":"重置密码","Reset password success":"重置密码成功","Role":"角色","Save":"保存","Save {{object}} success":"保存{{object}}成功","Search":"搜索","Search {{label}}":"搜索{{label}}","Select {{label}}":"选择{{label}}","Send Email to Reset Password":"发送重置密码邮件","Send reset password email success":"发送重置密码邮件成功，请查收邮件","Send verify code to your email, please check":"已发送重置密码邮件到您的邮箱，请查收邮件","Set page size":"设置每页数目","Set {{size}} per page":"每页{{size}}条","Sign In":"登录","Sign Up":"注册","Signup":"注册","Sort ASC":"正序","Sort DESC":"倒序","Success":"成功","Successfully logged out":"成功退出","User":"用户","User Name":"用户名","Username":"用户名","Verify email success, please login":"邮箱验证成功，请您登录","loading":"加载中","please login":"请您登录","please signup":"立即注册","reset password":"重置密码","type a few characters to kick off remote search":"请输入内容进行搜索","{{count}} record selected":"已选择 {{count}} 条数据","{{count}} records":"{{count}} 条数据","{{name}} Detail":"{{name}}详情","{{name}} List":"{{name}}列表","{{size}} per page":"每页{{size}}条"}

/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends2 = __webpack_require__("../node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

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

var _xadminI18n = __webpack_require__("../../xadmin-i18n/src/index.js");

var _xadminI18n2 = _interopRequireDefault(_xadminI18n);

var _xadminForm = __webpack_require__("../../xadmin-form/src/index.js");

var _xadminForm2 = _interopRequireDefault(_xadminForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_xadminForm2.default, _xadminForm.SchemaForm);
var Hello = (_dec = (0, _xadminCore.StoreWrap)('hello'), _dec(_class = function (_React$Component) {
  (0, _inherits3.default)(Hello, _React$Component);

  function Hello() {
    (0, _classCallCheck3.default)(this, Hello);
    return (0, _possibleConstructorReturn3.default)(this, (Hello.__proto__ || Object.getPrototypeOf(Hello)).apply(this, arguments));
  }

  (0, _createClass3.default)(Hello, [{
    key: 'onSubmit',
    value: function onSubmit(values) {
      var _props = this.props,
          count = _props.count,
          add = _props.add;

      console.log(values);
      add(values);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          count = _props2.count,
          add = _props2.add;
      var _t = _xadminCore.app.context._t;


      var FormLayout = function FormLayout(props) {
        var children = props.children,
            invalid = props.invalid,
            handleSubmit = props.handleSubmit,
            submitSucceeded = props.submitSucceeded,
            submitting = props.submitting,
            isCreate = props.isCreate;

        return _react2.default.createElement(
          'form',
          { className: 'form-horizontal' },
          children,
          _react2.default.createElement(
            'a',
            { onClick: handleSubmit },
            _t('Add Count')
          )
        );
      };

      return _react2.default.createElement(
        'div',
        null,
        count,
        _react2.default.createElement(_xadminForm.SchemaForm, { formKey: 'DemoForm',
          schema: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                title: '增加数字'
              },
              type: {
                type: 'string',
                title: '数据类型',
                enum: ['资产数据', '设备数据']
              }
            }
          },
          onSubmit: this.onSubmit.bind(this),
          component: FormLayout })
      );
    }
  }]);
  return Hello;
}(_react2.default.Component)) || _class);


_xadminCore.app.use(_xadminI18n2.default).use(_xadminForm2.default).use({
  config: {
    locale: {
      lng: 'zh_Hans'
    }
  },
  locales: {
    zh_Hans: {
      translation: {
        'Add Count': '添加数字'
      }
    }
  },
  mappers: {
    hello: {
      data: function data(_ref, props) {
        var state = _ref.state;

        return { count: state.count };
      },
      method: {
        add: function add(_ref2) {
          var dispatch = _ref2.dispatch;
          return function (values) {
            dispatch((0, _extends3.default)({ type: 'ADD' }, values));
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
        return state + action.count;
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
//# sourceMappingURL=app-26145a5b928833f309dc.js.map