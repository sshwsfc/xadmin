import React from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import { Block, app } from 'xadmin-core'
import { ButtonToolbar, Modal, FormGroup, ControlLabel, FormControl, DropdownButton, OverlayTrigger, Popover, Clearfix, ButtonGroup, Button, Dropdown, MenuItem, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { ModelWrap } from '../base'

const CountButton = ModelWrap('model.list.btn.count')(React.createClass({
  propTypes: {
    count: React.PropTypes.number.isRequired
  },

  render() {
    const { _t } = app.context
    const { count } = this.props
    return <Button bsSize="small">{_t('{{count}} records', { count })}</Button>
  }
}))

const PageSizeButton = ModelWrap('model.list.btn.pagesize')(React.createClass({

  getInitialState() {
    return { show: false, size: this.props.size }
  },

  propTypes: {
    size: React.PropTypes.number.isRequired,
    sizes: React.PropTypes.array.isRequired
  },

  setPageSize(e) {
    this.props.setPageSize(this.state.size)
    this.setState({ show: false })
    if(document.all) { window.event.returnValue = false }else{ e.preventDefault() }
  },

  showCustomize() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return (
      <Modal bsSize="small" show={this.state.show} onHide={()=>this.setState({ show: false })}>
        <Modal.Header closeButton>
          <Modal.Title>{_t('Customize page size')}</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.setPageSize}>
        <Modal.Body>
          <FormGroup
            controlId="formPageSize"
          >
            <ControlLabel>{_t('Page Size')}</ControlLabel>
            <FormControl
              type="number"
              value={this.state.size}
              placeholder={_t('Enter page size')}
              onChange={(e)=>this.setState({ size: e.target.value })}
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={()=>this.setState({ show: false })}>{_t('Close')}</Button>
          <Button type="submit" bsStyle="primary" disabled={this.state.size==size} onClick={this.setPageSize}>{_t('Set page size')}</Button>
        </Modal.Footer>
        </form>
      </Modal>
      )
  },

  render() {
    const { _t } = app.context
    const { size, sizes, setPageSize } = this.props
    return (
      <DropdownButton bsSize="small" title={_t('{{size}} per page', { size })} id="dropdown-size-btn">
        {sizes.map(size => <MenuItem onSelect={()=>setPageSize(size)} eventKey={`size-${size}`}>{_t('Set {{size}} per page', { size })}</MenuItem>)}
        <MenuItem divider />
        {this.state.show ? this.showCustomize() : null}
        <MenuItem eventKey="cus-size" onSelect={()=>this.setState({ show: true })}>{_t('Customize page size')}</MenuItem>
      </DropdownButton>
      )
  }
}))

const ColsDropdown = ModelWrap('model.list.btn.cols')(React.createClass({

  propTypes: {
    selected: React.PropTypes.array.isRequired,
    fields: React.PropTypes.object.isRequired,
    changeFieldDisplay: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return { open: false }
  },

  render() {
    const { _t } = app.context
    const { selected, fields } = this.props
    let items = []
    for (let name in fields) {
      let field = fields[name]
        , fieldName = name
        , title = field.title || name
        , fieldSelected = _.indexOf(selected, name) !== -1
        , icon = fieldSelected ? <Icon name="check-square-o" /> : <Icon name="square-o" />
      items.push(<ListGroupItem key={name} onClick={(e) => {
        this.props.changeFieldDisplay([ fieldName, !fieldSelected ])
      }}>{icon} {title}</ListGroupItem>)
    }

    const DropdownBtn = Dropdown.ControlledComponent
    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={
        <Popover id="model-cols-select-popover">
          <ListGroup fill style={{ marginBottom: 0 }}>
            {items}
          </ListGroup>
        </Popover>
      }>
        <Button bsSize="small">{_t('Columns')}</Button>
      </OverlayTrigger>
      )
  }
}))

const SubMenu = React.createClass({

  render() {
    return (
      <ButtonToolbar className="pull-right">
        <CountButton />
        <PageSizeButton />
        { Block('model.list.submenu.btngroup', this) }
        <ButtonGroup bsSize="small">
          { Block('model.list.submenu.btn', this) }
        </ButtonGroup>
        <ColsDropdown />
      </ButtonToolbar>
    )
  }
})

export default SubMenu
