webpackHotUpdate(0,{

/***/ "../../xadmin-form/src/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schemaConvert = exports.objectBuilder = exports.fieldBuilder = exports.FormWrap = exports.SchemaForm = exports.Form = exports.BaseForm = undefined;

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

exports.BaseForm = BaseForm;
exports.Form = Form;
exports.SchemaForm = SchemaForm;
exports.FormWrap = FormWrap;
exports.fieldBuilder = _builder.fieldBuilder;
exports.objectBuilder = _builder.objectBuilder;
exports.schemaConvert = _schema.convert;

/***/ })

})
//# sourceMappingURL=0.792b6ca51889e0ddd0ab.hot-update.js.map