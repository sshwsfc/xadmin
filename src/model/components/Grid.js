import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import { Icon } from '../../components'
import { Table, OverlayTrigger, Popover, Button, Input, Dropdown, MenuItem } from 'react-bootstrap'
import { Block } from '../../index'
import { ModelWrap } from '../base'

const Header = ModelWrap('model.list.header')(React.createClass({

  propTypes: {
    field: React.PropTypes.string.isRequired,
    order: React.PropTypes.string.isRequired,
    changeOrder: React.PropTypes.func.isRequired
  },

  render() {
    const { field, order } = this.props
      , icon = {
        'ASC' : <Icon name="sort-asc" />,
        'DESC' : <Icon name="sort-desc" />
      }[order] || ''
    return (
      <th>
        <Dropdown id="nav-dropdown">
          <a href="#" bsRole="toggle" onClick={e => {e.preventDefault()}}>
            {_.capitalize(field)} {icon}
          </a>
          <Dropdown.Menu>
            <MenuItem onSelect={e=>{ this.props.changeOrder('ASC') }} active={order==='ASC'}>正序</MenuItem>
            <MenuItem onSelect={e=>{ this.props.changeOrder('DESC') }} active={order==='DESC'}>倒序</MenuItem>
            {order == ''?'':(<MenuItem onSelect={e=>{ this.props.changeOrder('') }}>清除排序</MenuItem>)}
            { Block('model.list.header.menu', this) }
          </Dropdown.Menu>
        </Dropdown>
      </th>
      )
  }
}))

const Row = ModelWrap('model.list.row')(React.createClass({

  propTypes: {
    item: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    selected: React.PropTypes.bool.isRequired,
    changeSelect: React.PropTypes.func.isRequired,
    editItem: React.PropTypes.func.isRequired,
    deleteItem: React.PropTypes.func.isRequired
  },

  handleChange(e) {
    const selected = this.refs.selector.checked
    this.props.changeSelect(selected)
  },

  render() {
    const { item, fields, selected } = this.props
    return (
      <tr>
        <td className={selected?'bg-warning':''}>
          <input type="checkbox" ref="selector" checked={selected} onChange={this.handleChange} />
        </td>
        {fields.map(field=>{
          return <td className={selected?'bg-warning':''} key={`item-${item.id}-${field}`}>{item[field]}</td>
        })}
        <td className={selected?'bg-warning':''}>
          <a onClick={this.props.editItem}>change</a>&nbsp;
          <OverlayTrigger trigger="click" rootClose placement="top" overlay={
            <Popover title="Comfirm Delete" id="delete-item-popover">
            <p><strong>您确定要删除？</strong></p>
            <p className="text-center">
              <Button bsStyle="danger" onClick={this.props.deleteItem}>确定</Button>
            </p>
            </Popover>
          }>
            <a>delete</a>
          </OverlayTrigger>
        </td>
      </tr>
      )
  }
}))

const ModelGrid = React.createClass({

  propTypes: {
    fields: React.PropTypes.array.isRequired,
    items: React.PropTypes.array.isRequired
  },

  render() {
    const { fields, items } = this.props

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            {fields.map(field=>{
              return <Header key={`model-list-header-${field}`} field={field}  />
            })}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item)=>{
            return <Row key={item.id} fields={fields} item={item} />
          })}
        </tbody>
      </Table>
    )
  }
})

module.exports = ModelWrap('model.list.grid')(ModelGrid)
