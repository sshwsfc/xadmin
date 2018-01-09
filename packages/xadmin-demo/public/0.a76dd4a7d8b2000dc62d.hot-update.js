webpackHotUpdate(0,{

/***/ "../../xadmin-form/src/components/Array.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__("../../xadmin-form/node_modules/babel-runtime/helpers/extends.js");

var _extends3 = _interopRequireDefault(_extends2);

var _react = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

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

/***/ })

})
//# sourceMappingURL=0.a76dd4a7d8b2000dc62d.hot-update.js.map