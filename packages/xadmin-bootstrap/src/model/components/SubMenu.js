import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, ButtonToolbar, Col, Dropdown, DropdownButton, Form, ListGroup, Modal, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { app } from 'xadmin'
import { ModelWrap, ModelBlock } from 'xadmin-model'

@ModelWrap('model.list.btn.count')
class CountButton extends React.Component {

  render() {
    const { _t } = app.context
    const { count } = this.props
    return <Button size="sm" variant="outline-secondary">{_t('{{count}} records', { count })}</Button>
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
    return (
      <Modal key="size-modal" size="sm" show={this.state.show} onHide={()=>this.setState({ show: false })}>
        <Modal.Header closeButton>
          <Modal.Title>{_t('Customize page size')}</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.setPageSize.bind(this)}>
          <Modal.Body>
            <Form.Group controlId="formPageSize">
              <Form.Label>{_t('Page Size')}</Form.Label>
              <Form.Control
                type="number"
                value={this.state.size}
                placeholder={_t('Enter page size')}
                onChange={(e)=>this.setState({ size: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button key="close" variant="outline-secondary" onClick={()=>this.setState({ show: false })}>{_t('Close')}</Button>
            <Button key="submit" type="submit" variant="primary" disabled={this.state.size==size} onClick={this.setPageSize.bind(this)}>{_t('Set page size')}</Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }

  render() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return [ (
      <DropdownButton key="page-size-dropdown" size="sm" variant="outline-secondary" className="ml-2" title={_t('{{size}} per page', { size })} id="dropdown-size-btn">
        {sizes.map(size => <Dropdown.Item key={`size-${size}`} onSelect={()=>setPageSize(size)} eventKey={`size-${size}`}>{_t('Set {{size}} per page', { size })}</Dropdown.Item>)}
        <Dropdown.Divider key="size-divider" />
        <Dropdown.Item key="size-custom" eventKey="cus-size" onSelect={()=>this.setState({ show: true })}>{_t('Customize page size')}</Dropdown.Item>
      </DropdownButton>
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
        , icon = fieldSelected ? <Icon name="check-square-o" /> : <Icon name="square-o" />
        , onClick = (e) => {
          this.props.changeFieldDisplay([ fieldName, !fieldSelected ])
        }
      if(menuShow) {
        items.push(<ListGroup.Item key={name} onClick={onClick}>{icon} {title}</ListGroup.Item>)
      } else {
        items.push((
          <Col sm={3} key={name} style={{ margin: '5px 0' }}>
            <Button bsStyle={fieldSelected?'success':'default'} block onClick={onClick}>{icon} {title}</Button>
          </Col>))
      }
    }

    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
        <Popover className="px-0 py-0" style={{ maxWidth: 800, maxHeight: 600, overflowY: 'auto' }} id="model-cols-select-popover">
          { menuShow ? 
            <ListGroup className="mx-0 my-0" variant="flush">{items}</ListGroup> :
            <Row>{items}</Row> }
        </Popover>
      }>
        <Button size="sm" className="ml-2" variant="outline-secondary">{_t('Columns')}</Button>
      </OverlayTrigger>
    )
  }

}

@ModelWrap('model.list.submenu')
class SubMenu extends React.Component {

  render() {
    return (
      <ButtonToolbar>
        <CountButton />
        <PageSizeButton />
        <ModelBlock name="model.list.submenu.btngroup" el={this} />
        <ColsDropdown />
        {this.props.children}
      </ButtonToolbar>
    )
  }

}

export default SubMenu
