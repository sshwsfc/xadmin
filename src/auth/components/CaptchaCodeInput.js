import React from 'react'
import { FormControl, InputGroup, Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap'
import api from '../../api'
import { app } from '../../index'

export default React.createClass({

  getCodeUrl() {
    const { field } = this.props
    return api({}).host + (field.captcha_url || '/get_captcha_code') + '?random=' + Math.random().toString()
  },

  getInitialState() {
    return { url: this.getCodeUrl() }
  },

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    const { _t } = app.context

    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        <Row>
          <Col xs={7}>
            <FormControl {...input} {...field.attrs} />
          </Col>
          <Col xs={5}>
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">{_t('Click to refresh captcha code')}</Tooltip>}>
              <img style={{ cursor: 'pointer' }} onClick={()=>this.setState({ url: this.getCodeUrl() })} src={ this.state.url } />
            </OverlayTrigger>
          </Col>
        </Row>
      </FieldGroup>
    )
  }
})
