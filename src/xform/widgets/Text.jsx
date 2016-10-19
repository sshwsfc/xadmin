import React from 'react'
import ComposedComponent from './ComposedComponent'
import {FormGroup, ControlLabel, FormControl, Col, HelpBlock} from 'react-bootstrap'

class Text extends React.Component {

  render() {
    var props = {}
    if (this.props.error) {
      props['validationState'] = 'error'
    }
    return (
    <FormGroup controlId={`formContorl${this.props.key}`} {...props}>
      <Col componentClass={ControlLabel} sm={2}>
        {this.props.form.title}
      </Col>
      <Col sm={10}>
        <FormControl
          placeholder={this.props.form.placeholder}
          ref={this.props.form.type}
          value={this.props.value}
          disabled={this.props.form.readonly}
          style={this.props.form.style || {width: '100%'}}
          bsSize={this.props.form.size || 'medium'}
          onChange={this.props.onChangeValidate} />
          <FormControl.Feedback />
          {this.props.error && <HelpBlock>{this.props.error}</HelpBlock>}
      </Col>
    </FormGroup>
    )
  }

}

export default ComposedComponent(Text)
