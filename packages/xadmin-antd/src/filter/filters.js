import React from 'react'
import { app, config } from 'xadmin'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Row, Col, Form, Space, Button, Card, Modal, Typography, Grid } from 'antd'

const { useBreakpoint } = Grid;

const FilterForm = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      {children}
      {options && options.submitOnChange ? null : (
        <Form.Item style={{ textAlign: 'center' }}>
          <Space>
            <Button disabled={invalid} loading={submitting} type="primary" onClick={handleSubmit} icon={<SearchOutlined />}>{_t('Search')}</Button>
            <Button disabled={submitting} onClick={resetFilter}>{_t('Reset')}</Button>
          </Space>
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
          <Space>
            <Button disabled={invalid} loading={submitting} type="primary" onClick={handleSubmit} icon={<SearchOutlined />}>{_t('Search')}</Button>
            <Button disabled={submitting} onClick={resetFilter}>{_t('Reset')}</Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  )
}

const FilterOpenLink = ({ count, onClick, show }) => {
  const { _t } = app.context
  const screens = useBreakpoint();
  
  return (screens.xxl == false && count > 3) || count > 4 ? 
  <Typography.Link onClick={onClick}>
    {show ? _t('Collapse'): _t('Expand') }
  </Typography.Link> : null
}

const Submenu = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  const defaultShowAllFilter = config('filter') && config('filter').submenuShowAllFilter == true
  const [ showAllFilter, setShowAllFilter ] = React.useState(defaultShowAllFilter)

  return (
    <Form className="ant-advanced-search-form" onSubmit={handleSubmit}>
      <Card style={{ marginBottom: '.5rem', overflow: 'hidden' }}>
        <Row gutter={8} style={{ flexWrap: (children.length <= 3 || showAllFilter) ? 'wrap' : 'nowrap' }}>{children}</Row>
        {options && options.submitOnChange ? null : (
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Space>
                <Button disabled={invalid} loading={submitting} type="primary" onClick={handleSubmit} icon={<SearchOutlined />}>{_t('Search')}</Button>
                <Button disabled={submitting} onClick={resetFilter}>{_t('Reset')}</Button>
                <FilterOpenLink count={children.length} onClick={() => setShowAllFilter(!showAllFilter)} show={showAllFilter} />
              </Space>
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
      cancelText: _t('Reset'),
      okButtonProps: { disabled: invalid, loading: submitting, icon: <SearchOutlined /> },
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
        <Button key="filter-btn" onClick={()=>this.setState({ show: true })}>
          <FilterOutlined /> {_t('Filter')}
        </Button>
      ), (
        <Modal
          key="filter-modal"
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
