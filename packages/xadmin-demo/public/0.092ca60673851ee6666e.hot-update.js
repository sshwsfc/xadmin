webpackHotUpdate(0,{

/***/ "../../xadmin-form/src/components/base.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleGroup = exports.InlineGroup = exports.FieldGroup = undefined;

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

exports.FieldGroup = FieldGroup;
exports.InlineGroup = InlineGroup;
exports.SimpleGroup = SimpleGroup;

/***/ })

})
//# sourceMappingURL=0.092ca60673851ee6666e.hot-update.js.map