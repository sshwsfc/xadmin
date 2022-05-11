import React from 'react'
import app from 'xadmin'
import { Form, Card, Button, Alert } from 'antd'
import { useNavigate } from "react-router-dom"

const SigininLayout = ({ error, children, invalid, handleSubmit, submitting }) => {
  const { _t } = app.context
  const { auth } = app.get('config')
  const nav = useNavigate()
  return (
    <div>
      <Form className="sigin-form" onSubmit={handleSubmit}>
        <Card style={{ maxWidth: 450, margin: '5rem auto', marginBottom: '-0.5rem' }} title={_t('Please Login')}>
          {children}
          {error && <Alert message={error} type="error" />}
          <Form.Item wrapperCol={{
            xs: { span: 24 },
            sm: { span: 18, offset: 5 }
          }}>
            { auth.can_reset_password && (<div>{_t('Forgot password')}? <a href="#" onClick={()=>nav('/forget_password')}>{_t('reset password')}</a></div>) }
            <Button type="primary" loading={submitting} onClick={handleSubmit} htmlType="submit" className="login-form-button">
              {_t('Login')}
            </Button>
            { auth.can_signup && (<div>{_t('Not registed')}? <a href="#" onClick={()=>nav('/signup')}>{_t('please signup')}</a></div>) }
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}

export default SigininLayout
