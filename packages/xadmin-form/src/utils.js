
function findFieldByName(name, fields) {
  function searchFields(name, fields) {
    for (let field of fields) {
      if (field.name === name) {
        return field;
      }
    }
    return null;
  }

  function parsePath(path) {
    let parts = path.split('.');
    let result = [];
    for (let part of parts) {
      if (part.includes('[')) {
        let [key, index] = part.split('[');
        index = parseInt(index.replace(']', ''));
        result.push({ key, index, prefixs: [ ...result ] });
      } else {
        result.push({ key: part, index: null, prefixs: [ ...result ] });
      }
    }
    return result;
  }

  let pathParts = parsePath(name);
  let currentFields = fields;
  let field;
  for (let { key, index, prefixs } of pathParts) {
    const trueKey = [ key ]
    for (let index = prefixs.length - 1; index >= 0; index--) {
      const p = prefixs[index];
      if(p && p.index == null && p.key) {
        trueKey = [ p.key, ...trueKey ]
      } else {
        break;
      }
    }
    field = searchFields(trueKey.join('.'), currentFields);
    if (field) {
      if (index !== null && field.items && field.items.fields) {
        currentFields = field.items.fields;
        field = currentFields[index];
      } else if (index !== null && field.fields) {
        currentFields = field.fields;
        field = currentFields[index];
      } else {
        currentFields = field.fields || [];
      }
    } else {
      return null;
    }
  }

  return field;
}

export {
  findFieldByName
}