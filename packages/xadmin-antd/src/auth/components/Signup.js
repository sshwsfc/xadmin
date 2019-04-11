import React from 'react'
import app from 'xadmin'
import { Form, Card, Button, Alert } from 'antd'
import { _t } from 'xadmin-i18n'

export default ({ error, children, invalid, handleSubmit, submitting }) => {
  return (
    <div>
      <Form className="sigin-form" onSubmit={handleSubmit}>
        <Card style={{ maxWidth: 450, margin: '5rem auto', marginBottom: '-0.5rem' }} title={_t('Please Signup')}>
          {children}
          {error && <Alert message={error} type="error" />}
          <Form.Item wrapperCol={{
            xs: { span: 24 },
            sm: { span: 18, offset: 5 }
          }}>
            <Button type="primary" disabled={invalid} loading={submitting} onClick={handleSubmit} htmlType="submit" className="signup-form-button">
              {_t('Signup')}
            </Button>
            <div>{_t('Have account')}? <a href="#" onClick={()=>app.go('/login')}>{_t('please login')}</a></div>
          </Form.Item>
        </Card>
      </Form>
    </div>
  )
}
