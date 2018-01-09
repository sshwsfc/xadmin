webpackHotUpdate(0,{

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

/***/ })

})
//# sourceMappingURL=0.2107513e3935d5096ad3.hot-update.js.map