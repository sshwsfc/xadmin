import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import { Icon } from '../../components'
import { Table, OverlayTrigger, Popover, Button, ButtonGroup, Input, Dropdown, MenuItem, Well, Panel, Media } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelWrap } from '../base'

class BaseRow extends React.Component {

  actions() {
    const { canEdit, canDelete } = this.props
    let actions = (this.props.actions || []).map(Action => <Action {...this.props} />)
    if(canEdit) {
      actions.push(<Button bsSize="xsmall" onClick={this.props.editItem}>edit</Button>)
    }
    if(canDelete) {
      actions.push((
        <OverlayTrigger trigger="click" rootClose placement="top" overlay={
          <Popover title="Comfirm Delete" id="delete-item-popover">
          <p><strong>Comfirm Delete？</strong></p>
          <p className="text-center">
            <Button bsStyle="danger" onClick={this.props.deleteItem}>Delete</Button>
          </p>
          </Popover>
        }>
          <Button bsSize="xsmall">delete</Button>
        </OverlayTrigger>
      ))
    }
    return actions
  }

  render() {
    const { componentClass, actions, ...extProps } = this.props
    if(componentClass !== undefined) {
      const newActions = this.actions()
      const RowComponent = componentClass
      return <RowComponent actions={newActions} {...extProps} />
    } else {
      return this.renderRow()
    }
  }

}

BaseRow.propTypes = {
  item: React.PropTypes.object.isRequired,
  fields: React.PropTypes.array.isRequired,
  selected: React.PropTypes.bool.isRequired,
  changeSelect: React.PropTypes.func.isRequired,
  canEdit: React.PropTypes.bool.isRequired,
  canDelete: React.PropTypes.bool.isRequired,
  editItem: React.PropTypes.func.isRequired,
  deleteItem: React.PropTypes.func.isRequired,
  actions: React.PropTypes.array
}

const Header = ModelWrap('model.list.header')(React.createClass({

  propTypes: {
    field: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    order: React.PropTypes.string.isRequired,
    canOrder: React.PropTypes.bool.isRequired,
    changeOrder: React.PropTypes.func.isRequired
  },

  renderOrder() {
    const { field, order, canOrder } = this.props
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <MenuItem onSelect={e=>{ this.props.changeOrder('ASC') }} active={order==='ASC'}><Icon name="sort-amount-asc" /> Sort ASC</MenuItem>,
        <MenuItem onSelect={e=>{ this.props.changeOrder('DESC') }} active={order==='DESC'}><Icon name="sort-amount-desc" /> Sort DESC</MenuItem>
      ]
      if(order != '') {
        orderItems.push(<MenuItem onSelect={e=>{ this.props.changeOrder('') }}>Clear order</MenuItem>)
      }
    }
    return orderItems
  },

  render() {
    const { title, order } = this.props
      , icon = {
        'ASC' : <Icon name="sort-asc" />,
        'DESC' : <Icon name="sort-desc" />
      }[order] || ''
    return (
      <Dropdown id="nav-dropdown">
        <a href="#" bsRole="toggle" onClick={e => {e.preventDefault()}}>
          {title} {icon}
        </a>
        <Dropdown.Menu>
          {this.renderOrder()}
          {Block('model.list.header.menu', this)}
        </Dropdown.Menu>
      </Dropdown>
      )
  }
}))

const Item = ModelWrap('model.list.item')(React.createClass({

  propTypes: {
    item: React.PropTypes.object.isRequired,
    field: React.PropTypes.string.isRequired,
    schema: React.PropTypes.object.isRequired
  },

  render() {
    const { item, field, schema, componentClass, wrap } = this.props
    const WrapComponent = wrap || (({ children }) => <span>{children}</span>)
    if(item == undefined || item == null) {
      return <WrapComponent>Null</WrapComponent>
    }
    let value = item[field]
    if(componentClass) {
      const ItemComponent = componentClass
      return <ItemComponent item={item} value={value} field={field} schema={schema} wrap={WrapComponent} />
    } else {
      return <WrapComponent>{value?value:'Null'}</WrapComponent>
    }
  }
}))

class GridRowComponent extends BaseRow {

  handleSelect(e) {
    const selected = this.refs.selector.checked
    this.props.changeSelect(selected)
  }

  renderRow() {
    const { item, fields, selected } = this.props
    return (
      <tr>
        <td className={selected?'bg-warning':''}>
          <input type="checkbox" ref="selector" checked={selected} onChange={this.handleSelect.bind(this)} />
        </td>
        {fields.map(field=>{
          return (
            <Item item={item} field={field} selected={selected} wrap={
              ({ children, ...props })=><td className={selected?'bg-warning':''} {...props}>{children}</td>
            } />
          )
        })}
        <td className={selected?'bg-warning':''} style={{ textAlign: 'center' }}>
          <ButtonGroup>
          {this.actions()}
          </ButtonGroup>
        </td>
      </tr>
    )
  }
}
const GridRow = ModelWrap('model.list.row')(GridRowComponent)

const ModelGrid = React.createClass({

  propTypes: {
    fields: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired
  },

  render() {
    const { fields, items, loading } = this.props
    if(loading) {
      return <Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>
    } else {
      if(items.length > 0) {
        return (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                {fields.map(field=>{
                  return <th><Header key={`model-list-header-${field}`} field={field}  /></th>
                })}
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item)=>{
                return <GridRow key={item.id} fields={fields} item={item} />
              })}
            </tbody>
          </Table>
        )
      } else {
        return (<Well>No Data</Well>)
      }
    }
  }
})

class ListRowComponent extends BaseRow {

  handleChange(e) {
    const selected = this.refs.selector.checked
    this.props.changeSelect(selected)
  }

  renderRow() {
    const { item, fields, selected } = this.props
    const actions = this.actions()
    return (
      <Panel footer={<ButtonGroup>{actions}</ButtonGroup>} bsStyle={selected?'danger':'default'}>
        <input type="checkbox" ref="selector" checked={selected} onChange={this.handleChange.bind(this)} />
        <Media>
          <Media.Body>
            <Media.Heading><Item item={item} field={fields[0]} selected={selected} /></Media.Heading>
            {fields.slice(1).map(field=>{
              return (
                <Item item={item} field={field} selected={selected} wrap={
                  ({ children, ...props })=><p key={`item-${item.id}-${field}`} {...props}>{children}</p>
                } />
              )
            })}
          </Media.Body>
        </Media>
      </Panel>
      )
  }
}
const ListRow = ModelWrap('model.list.row')(ListRowComponent)

const ModelList = React.createClass({

  propTypes: {
    fields: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired
  },

  render() {
    const { fields, items, loading } = this.props

    if(loading) {
      return <Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>
    } else {
      if(items.length > 0) {
        return (
          <div>
            <ButtonGroup bsStyle="xs" style={{ marginBottom: 10 }}>
            {fields.map(field=>{
              return <Button><Header key={`model-list-header-${field}`} field={field}  /></Button>
            })}
            </ButtonGroup>
            {items.map(item => <ListRow key={item.id} fields={fields} item={item} />)}
          </div>)
      } else {
        return (<Well>No Data</Well>)
      }
    }
  }
})

export default {
  Grid: ModelWrap('model.items')(ModelGrid),
  List: ModelWrap('model.items')(ModelList),
  Header, GridRow, Item
}
