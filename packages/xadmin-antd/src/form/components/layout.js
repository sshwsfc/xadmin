import React from 'react'
import { Form, Button, Card, Space, Modal } from 'antd'
import app from 'xadmin'
import _ from 'lodash'

const FormLayout = props => {
  const { children, invalid, handleSubmit, submitting, onCancel } = props
  const { _t } = app.context
  const groupProps = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 5 }
    }
  }
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {children}
        <Form.Item {...groupProps}>
          <Space>
            <Button type="primary" htmlType="submit" loading={submitting} disabled={invalid}>{_t('Save')}</Button>
            <Button onClick={() => onCancel ? onCancel() : history.back()}>{_t('Cancel')}</Button>
          </Space>
        </Form.Item>
      </form>
    </Card>
  )
}

const ModalLayout = ({ children, invalid, handleSubmit, submitting, title, show, onClose, saveText }) => {
  const { _t } = app.context

  return (
    <Modal visible={show} onClose={onClose} style={{ maxWidth: 700 }} width="95%"
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
