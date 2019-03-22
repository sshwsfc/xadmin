import React from 'react'
import app from 'xadmin'
import { Form, Row, Col, Input, Button, Icon, Card, Modal } from 'antd'

const FilterForm = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      {children}
      {options && options.submitOnChange ? null : (
        <Form.Item style={{ textAlign: 'center' }}>
          <Button disabled={invalid || submitting} type="primary" onClick={handleSubmit}>{_t('Search')}</Button>
          {' '}
          <Button disabled={submitting} onClick={resetFilter}>{_t('Clear')}</Button>
        </Form.Item>
      )}
    </Form>
  )
}

const NavForm = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      {children}
      {options && options.submitOnChange ? null : (
        <Form.Item>
          <Button disabled={invalid || submitting} type="primary" onClick={handleSubmit}>{_t('Search')}</Button>
          {' '}
          <Button disabled={submitting} onClick={resetFilter}>{_t('Clear')}</Button>
        </Form.Item>
      )}
    </Form>
  )
}

const Submenu = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form className="ant-advanced-search-form" onSubmit={handleSubmit}>
      <Card style={{ marginBottom: '.5rem' }}>
        <Row gutter={24}>{children}</Row>
        {options && options.submitOnChange ? null : (
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button disabled={invalid || submitting} type="primary" onClick={handleSubmit}>{_t('Search')}</Button>
              {' '}
              <Button disabled={submitting} onClick={resetFilter}>{_t('Clear')}</Button>
            </Col>
          </Row>
        )}
      </Card>
    </Form>
  )
}


class FilterModal extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }
  
  render() {
    const { _t } = app.context
    const { children, invalid, handleSubmit, submitting, options, resetFilter } = this.props
    const icon = submitting ? 'spinner fa-spin' : 'floppy-o'

    const buttons = options && options.submitOnChange ? {} : {
      okText: _t('Search'),
      cancelText: _t('Clear'),
      okButtonProps: { disabled: invalid || submitting },
      onOk: ()=>{
        handleSubmit()
        this.onClose()
      },
      onCancel: ()=>{
        resetFilter()
        this.onClose()
      }
    }

    return [
      (
        <Button key="filter.model" onClick={()=>this.setState({ show: true })}>
          <Icon type="filter" /> {_t('Filter')}
        </Button>
      ), (
        <Modal
          title={_t('Filter Form')}
          visible={this.state.show}
          {...buttons}
        >
          <Form onSubmit={handleSubmit}>{children}</Form>
        </Modal>
      )
    ]
  }

}

export {
  FilterForm, NavForm, Submenu, FilterModal
}
