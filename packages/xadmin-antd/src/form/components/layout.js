import React from 'react'
import { Form, Button, Card, Row, Modal } from 'antd'
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
          <Button type="primary" onClick={handleSubmit} loading={submitting} disabled={invalid}>{_t('Save')}</Button>{' '}
          <Button onClick={() => history.back()}>{_t('Cancel')}</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

const ModalLayout = ({ children, invalid, handleSubmit, submitting, title, show, onClose, saveText }) => {
  const { _t } = app.context

  return (
    <Modal visible={show} onClose={onClose}
      title={title}
      okText={saveText || _t('Save')}
      onOk={handleSubmit}
      okButtonProps={{ disabled: invalid, loading: submitting }}
      cancelText={_t('Cancel')}
      onCancel={onClose}
    >
      <Form onSubmit={handleSubmit}>{children}</Form>
    </Modal>
  )
}

export { FormLayout, ModalLayout }
