import React from 'react'
import ComposedComponent from './ComposedComponent'
import {Input} from 'react-bootstrap'

class Text extends React.Component {

  render() {
    var props = {}
    if (this.props.error) {
      props['bsStyle'] = 'error'
      props['help'] = this.props.error
    }
    return (
      <Input  {...props}
        type={this.props.form.type}
        placeholder={this.props.form.placeholder}
        label={this.props.form.title}
        hasFeedback
        ref={this.props.form.type}
        value={this.props.value}
        disabled={this.props.form.readonly}
        style={this.props.form.style || {width: '100%'}}
        bsSize={this.props.form.size || 'medium'}
        labelClassName="col-xs-2" wrapperClassName="col-xs-10"
        onChange={this.props.onChangeValidate} >
        {(this.props.form.schema.enum||[]).map(value => { return (<option value={value}>{value}</option>) })}
      </Input>
    )
  }

}

export default ComposedComponent(Text)
