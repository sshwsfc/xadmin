webpackHotUpdate(0,{

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
//# sourceMappingURL=0.ae836e49f9bb69c4d0b2.hot-update.js.map