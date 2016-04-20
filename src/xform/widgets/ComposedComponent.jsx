import React from 'react'
import utils from 'react-schema-form/lib/utils'

export default ComposedComponent => class extends React.Component {

  constructor(props) {
    super(props)
    this.onChangeValidate = this.onChangeValidate.bind(this)
    let value = this.defaultValue()
    let validationResult = utils.validate(this.props.form, value)
    this.state = {
      value: value,
      valid: !!(validationResult.valid || !value),
      error: !validationResult.valid && value ? validationResult.error.message : null
    }
  }

  componentDidMount() {
    if (typeof this.state.value !== 'undefined') {
      this.props.onChange(this.props.form.key, this.state.value)
    }
  }

  /**
   * Called when <input> value changes.
   * @param e The input element, or something.
   */
  onChangeValidate(e) {
    //console.log('onChangeValidate e', e);
    let value = null;
    if (this.props.form.schema.type === 'integer' || this.props.form.schema.type === 'number') {
      if (e.target.value.indexOf('.') == -1) {
        value = parseInt(e.target.value)
      } else {
        value = parseFloat(e.target.value)
      }
    } else if(this.props.form.schema.type === 'boolean') {
      value = e.target.checked
    } else if(this.props.form.schema.type === 'date' || this.props.form.schema.type === 'array') {
      value = e
    } else { // string
      value = e.target.value
    }
    //console.log('onChangeValidate this.props.form, value', this.props.form, value);
    let validationResult = utils.validate(this.props.form, value)
    this.setState({
      value: value,
      valid: validationResult.valid,
      error: validationResult.valid ? null : validationResult.error.message
    })
    //console.log('conhangeValidate this.props.form.key, value', this.props.form.key, value);
    this.props.onChange(this.props.form.key, value)
  }

  defaultValue() {
    // check if there is a value in the model, if there is, display it. Otherwise, check if
    // there is a default value, display it.
    //console.log('Text.defaultValue key', this.props.form.key);
    //console.log('Text.defaultValue model', this.props.model);
    let value = utils.selectOrSet(this.props.form.key, this.props.model)
    //console.log('Text defaultValue value = ', value);

    // check if there is a default value
    if(!value && this.props.form['default']) {
      value = this.props.form['default']
    }

    if(!value && this.props.form.schema && this.props.form.schema['default']) {
      value = this.props.form.schema['default']
    }

    // Support for Select
    // The first value in the option will be the default.
    if(!value && this.props.form.titleMap && this.props.form.titleMap[0].value) {
      value = this.props.form.titleMap[0].value
    }
    //console.log('value', value);
    return value
  }

  render() {
    return <ComposedComponent {...this.props} {...this.state} onChangeValidate={this.onChangeValidate}/>
  }
}
