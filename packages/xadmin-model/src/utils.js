const getFieldProp = (model, field) => {
  return field.split('.').reduce((obj, f) => {
    return obj && obj.properties && obj.properties[f]
  }, model)
}

export {
  getFieldProp
}
