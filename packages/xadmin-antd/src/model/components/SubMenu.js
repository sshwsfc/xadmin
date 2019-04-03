import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Dropdown, Menu, Popover, Checkbox, Row, Col, Input } from 'antd'
import { app } from 'xadmin'
import { ModelWrap, ModelBlock } from 'xadmin-model'

@ModelWrap('model.list.btn.count')
class CountButton extends React.Component {

  render() {
    const { _t } = app.context
    const { count } = this.props
    return <Button>{_t('{{count}} records', { count })}</Button>
  }

}

@ModelWrap('model.list.btn.pagesize')
class PageSizeButton extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { visible: false }
    this.input = React.createRef()
  }

  setPageSize(size) {
    this.props.setPageSize(size)
    this.setState({ visible: false })
  }

  onInputSize = (e) => {
    if (e.key == 'Enter') {
      const size = parseInt(this.input.current.input.value)
      this.setPageSize(size)
      this.input.current.setState({ value: '' })
    }
    e.persist()
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag })
  }

  handleMenuClick = (e) => {

  }

  render() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return (
      <Dropdown key="page-size-dropdown" onVisibleChange={this.handleVisibleChange} visible={this.state.visible} overlay={(
        <Menu onClick={this.handleMenuClick}>
          {sizes.map(size => <Menu.Item key={`size-${size}`} onClick={()=>this.setPageSize(size)} eventKey={`size-${size}`}>{_t('Set {{size}} per page', { size })}</Menu.Item>)}
          <Menu.Item key="size-custom">
            <Input placeholder={_t('Customize page size')} ref={this.input} precision={0} onKeyPress={this.onInputSize} style={{ width: 100 }}/>
          </Menu.Item>
        </Menu>
      )}>
        <Button>
          {_t('{{size}} per page', { size })}
        </Button>
      </Dropdown>
    )
  }
}

@ModelWrap('model.list.btn.cols')
class ColsDropdown extends React.Component {

  static propTypes = {
    selected: PropTypes.array.isRequired,
    fields: PropTypes.object.isRequired,
    changeFieldDisplay: PropTypes.func.isRequired
  }

  state = { open: false }

  render() {
    const { _t } = app.context
    const { selected, fields } = this.props
    let items = []
    const showFields = Object.keys(fields).filter(name => fields[name].showInGrid !== false)
    const menuShow = showFields.length <= 10

    for (let name of showFields) {
      let field = fields[name]
        , fieldName = name
        , title = field.title || name
        , fieldSelected = _.indexOf(selected, name) !== -1
        , onClick = (e) => {
          this.props.changeFieldDisplay([ fieldName, e.target.checked ])
        }
      if(menuShow) {
        items.push(<Checkbox key={name} onChange={onClick} checked={fieldSelected}>{title}</Checkbox>)
      } else {
        items.push((
          <Col span={3} key={name} style={{ margin: '5px 0' }}>
            <Button type={fieldSelected?'primary':'default'} block onClick={onClick}>{title}</Button>
          </Col>))
      }
    }

    return (
      <Popover placement="bottomRight" content={(
        menuShow ? items :
          <Row gutter={12}>{items}</Row>
      )} trigger="click">
        <Button>{_t('Columns')}</Button>
      </Popover>
    )
  }

}

@ModelWrap('model.list.submenu')
class SubMenu extends React.Component {

  render() {
    return (
      <div>
        <CountButton />{' '}
        <PageSizeButton />{' '}
        <ModelBlock name="model.list.submenu.btngroup" />
        <ColsDropdown />
        {this.props.children}
      </div>
    )
  }

}

export default SubMenu
