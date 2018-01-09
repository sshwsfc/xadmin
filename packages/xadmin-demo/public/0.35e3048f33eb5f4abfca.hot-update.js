webpackHotUpdate(0,{

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

/***/ })

})
//# sourceMappingURL=0.35e3048f33eb5f4abfca.hot-update.js.map