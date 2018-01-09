webpackHotUpdate(0,{

/***/ "../../xadmin-form/src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubmissionError = exports.schemaConvert = exports.objectBuilder = exports.fieldBuilder = exports.FormWrap = exports.SchemaForm = exports.Form = exports.BaseForm = undefined;

var _react = __webpack_require__("../node_modules/react/react.js");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = __webpack_require__("../../xadmin-form/node_modules/redux-form/es/index.js");

var _ajv = __webpack_require__("../../xadmin-form/node_modules/ajv/lib/ajv.js");

var _ajv2 = _interopRequireDefault(_ajv);

var _fields = __webpack_require__("../../xadmin-form/src/fields.js");

var _fields2 = _interopRequireDefault(_fields);

var _schema = __webpack_require__("../../xadmin-form/src/schema.js");

var _schema2 = _interopRequireDefault(_schema);

var _base = __webpack_require__("../../xadmin-form/src/base.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_schema2.default.converters);


var ajv = new _ajv2.default({ allErrors: true });

exports.default = {
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
};
exports.BaseForm = _base.BaseForm;
exports.Form = _base.Form;
exports.SchemaForm = _base.SchemaForm;
exports.FormWrap = _base.FormWrap;
exports.fieldBuilder = _base.fieldBuilder;
exports.objectBuilder = _base.objectBuilder;
exports.schemaConvert = _base.schemaConvert;
exports.SubmissionError = _reduxForm.SubmissionError;

/***/ })

})
//# sourceMappingURL=0.1f755c03088e37cce8e7.hot-update.js.map