import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import { Icon } from '../../components'
import { Table, OverlayTrigger, Popover, Button, Input, Dropdown, MenuItem } from 'react-bootstrap'
import { deleteItem, selecteItem, changeOrder } from '../../model/actions'
import { block } from '../../plugin'
import { ModelMixin } from '../base'

const Header = React.createClass({
  mixins: [ModelMixin],

  propTypes: {
    field: React.PropTypes.string.isRequired
  },

  getStateMap (storeState) {
    const field = this.props.field
      , orders = storeState.filter.order
    return {
      order: orders !== undefined ? (orders[field] || '') : ''
    }
  },

  handleOrder (order) {
    this.dispatch(changeOrder(this.props.field, order))
  },

  render () {
    const { field } = this.props
      , order = this.state.order
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
            <MenuItem onSelect={e=>{ this.handleOrder('ASC') }} active={order==='ASC'}>正序</MenuItem>
            <MenuItem onSelect={e=>{ this.handleOrder('DESC') }} active={order==='DESC'}>倒序</MenuItem>
            {order == ''?'':(<MenuItem onSelect={e=>{ this.handleOrder('') }}>清除排序</MenuItem>)}
            <MenuItem divider />
            <MenuItem>其他</MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </th>
      )
  }
})

const Row = React.createClass({
  mixins: [ModelMixin],

  propTypes: {
    item: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired
  },

  getStateMap (storeState) {
    let selected = false
    for (let item of storeState.selected) {
      if (item.id === this.props.item.id) {
        selected = true
        break
      }
    }
    return { selected }
  },

  handleChange (e) {
    const item = this.props.item
      , selected = this.refs.selector.checked
    this.dispatch(selecteItem(item, selected))
  },

  deleteItem () {
    const item = this.props.item
    this.dispatch(deleteItem(item))
  },

  render() {
    const { item, fields } = this.props
    return (
      <tr>
        <td className={this.state.selected?'bg-warning':''}>
          <input type="checkbox" ref="selector" checked={this.state.selected} onChange={this.handleChange} />
        </td>
        {fields.map(field=>{
          return <td className={this.state.selected?'bg-warning':''} key={`item-${item.id}-${field}`}>{item[field]}</td>
        })}
        <td className={this.state.selected?'bg-warning':''}>
          <Link to={`/model/car/${item.id}/edit`}>change</Link>&nbsp;
          <OverlayTrigger trigger="click" rootClose placement="top" overlay={
            <Popover title="Comfirm Delete" id="delete-item-popover">
            <p><strong>您确定要删除？</strong></p>
            <p className="text-center">
              <Button bsStyle="danger" onClick={this.deleteItem}>确定</Button>
            </p>
            </Popover>
          }>
            <a>delete</a>
          </OverlayTrigger>
        </td>
      </tr>
      )
  }
})

const ModelGrid = React.createClass({
  mixins: [ModelMixin],

  getStateMap (storeState) {
    return {
      items: storeState.items,
      fields: storeState.filter.fields
    }
  },

  render() {
    const fields = this.state.fields

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
          {this.state.items.map((item)=>{
            return <Row key={item.id} fields={fields} item={item} />
          })}
        </tbody>
      </Table>
    )
  }
})

module.exports = ModelGrid
