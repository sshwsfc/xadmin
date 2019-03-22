import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Dropdown, Menu, Popover, Checkbox, Row, Col } from 'antd'
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
    this.state = { show: false, size: props.size }
  }

  setPageSize(e) {
    this.props.setPageSize(this.state.size)
    this.setState({ show: false })
    if(document.all) { window.event.returnValue = false }else{ e.persist() }
  }

  showCustomize() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return null
  }

  render() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return [ (
      <Dropdown key="page-size-dropdown" overlay={(
        <Menu>
          {sizes.map(size => <Menu.Item key={`size-${size}`} onClick={()=>setPageSize(size)} eventKey={`size-${size}`}>{_t('Set {{size}} per page', { size })}</Menu.Item>)}
          <Menu.Item key="size-custom" onClick={()=>this.setState({ show: true })}>{_t('Customize page size')}</Menu.Item>
        </Menu>
      )}>
        <Button>
          {_t('{{size}} per page', { size })}
        </Button>
      </Dropdown>
    ), 
    this.state.show ? this.showCustomize() : null
    ]
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
