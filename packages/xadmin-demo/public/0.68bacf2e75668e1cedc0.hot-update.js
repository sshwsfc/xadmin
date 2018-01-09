webpackHotUpdate(0,{

/***/ "../../xadmin-form/src/builder.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prefixFieldKey = exports.fieldBuilder = exports.objectBuilder = exports.defaultUIRender = undefined;

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

exports.defaultUIRender = defaultUIRender;
exports.objectBuilder = objectBuilder;
exports.fieldBuilder = fieldBuilder;
exports.prefixFieldKey = prefixFieldKey;

/***/ })

})
//# sourceMappingURL=0.68bacf2e75668e1cedc0.hot-update.js.map