webpackHotUpdate(0,{

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

__webpack_require__("../node_modules/bootstrap/dist/css/bootstrap.min.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
              },
              time: {
                type: 'string',
                format: 'date',
                title: '数据日期'
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

/***/ })

})
//# sourceMappingURL=0.3218af01b9e46c4dcf73.hot-update.js.map