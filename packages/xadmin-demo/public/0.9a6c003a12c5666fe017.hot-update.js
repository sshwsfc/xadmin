webpackHotUpdate(0,{

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

var _moment = __webpack_require__("../node_modules/moment/moment.js");

var _moment2 = _interopRequireDefault(_moment);

var _i18next = __webpack_require__("../node_modules/i18next/dist/es/index.js");

var _i18next2 = _interopRequireDefault(_i18next);

var _i18nextXhrBackend = __webpack_require__("../node_modules/i18next-xhr-backend/index.js");

var _i18nextXhrBackend2 = _interopRequireDefault(_i18nextXhrBackend);

var _i18nextLocalstorageCache = __webpack_require__("../node_modules/i18next-localstorage-cache/index.js");

var _i18nextLocalstorageCache2 = _interopRequireDefault(_i18nextLocalstorageCache);

var _i18nextBrowserLanguagedetector = __webpack_require__("../node_modules/i18next-browser-languagedetector/index.js");

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


_xadminCore.app.use(_xadminI18n2.default).use({
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

/***/ })

})
//# sourceMappingURL=0.9a6c003a12c5666fe017.hot-update.js.map