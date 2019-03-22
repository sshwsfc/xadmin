import React from 'react'
import { Form, Button, Card, Row, Tabs } from 'antd'
import app from 'xadmin'

const FormLayout = props => {
  const { children, invalid, handleSubmit, onDelete, schema, submitting } = props
  const { _t } = app.context
  const groupProps = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 5 }
    }
  }

  return (
    <Card>
      <Form onSubmit={handleSubmit}>
        {children}
        <Form.Item {...groupProps}>
          <Button type="primary" onClick={handleSubmit} disabled={invalid}>{_t('Save')}</Button>{' '}
          <Button onClick={() => history.back()}>{_t('Cancel')}</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export { FormLayout }
