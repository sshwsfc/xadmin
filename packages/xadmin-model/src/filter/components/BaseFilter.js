import React from 'react'
import _ from 'lodash'

export default class BaseFilter extends React.Component {

  getValue() {
    const { value } = this.state
  }

  onChange = (e) => {
    const { onChange } = this.props.input
    this.setState({ value: [] }, ()=>{
      onChange(this.getValue())
    })
  }

  clear = () => {
    const { onChange } = this.props.input
    this.setState({ value: [] }, ()=>{
      onChange(this.getValue())
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  }

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    const { newValue } = this.state
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        
      </FieldGroup>
    )
  }

}
