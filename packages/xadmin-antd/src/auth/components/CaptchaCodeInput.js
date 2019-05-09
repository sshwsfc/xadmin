import React from 'react'
import { Input, Col, Row, Tooltip } from 'antd'
import { app, api } from 'xadmin'

export default class CaptchaCodeInput extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { url: this.getCodeUrl() }
  }

  getCodeUrl() {
    const { field } = this.props
    return api({}).host + (field.captcha_url || '/get_captcha_code') + '?random=' + Math.random().toString()
  }

  render() {
    const { input, field } = this.props
    const { _t } = app.context

    return (
      <Row gutter={8}>
        <Col span={14}>
          <Input {...input} {...field.attrs} />
        </Col>
        <Col span={10}>
          <Tooltip title={_t('Click to refresh captcha code')}>
            <img style={{ cursor: 'pointer', width: '100%' }} onClick={()=>this.setState({ url: this.getCodeUrl() })} src={ this.state.url } />
          </Tooltip>
        </Col>
      </Row>
    )
  }
}
