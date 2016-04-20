import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import _ from 'lodash'
import Icon from '../Icon'
import { Table, OverlayTrigger, Popover, Button, Input, Dropdown, MenuItem } from 'react-bootstrap'
import { deleteItem, selecteItem, changeOrder } from '../../model/actions'
import { block } from '../../plugin'

const Header = React.createClass({

  propTypes: {
    model: React.PropTypes.object.isRequired,
    field: React.PropTypes.string.isRequired,
    changeOrder: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      order: ''
    }
  },

  handleOrder(order) {
    const { model, field } = this.props
    this.setState({order})
    this.props.changeOrder(field, order)
  },

  render() {
    const { model, field } = this.props
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

  propTypes: {
    item: React.PropTypes.object.isRequired,
    model: React.PropTypes.object.isRequired,
    fields: React.PropTypes.array.isRequired,
    selected: React.PropTypes.bool.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    selectItem: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      selected: this.props.selected || false
    }
  },

  handleChange(e) {
    const item = this.props.item
      , selected = this.refs.selector.checked
    this.setState({selected: selected})
    this.props.selectItem(item, selected)
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
              <Button bsStyle="danger" onClick={e=>{ this.props.deleteItem(item)} }>确定</Button>
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

  propTypes: {
    items: React.PropTypes.array.isRequired,
    deleteItem: React.PropTypes.func.isRequired,
    selectItem: React.PropTypes.func.isRequired,
    changeOrder: React.PropTypes.func.isRequired
  },

  contextTypes: {
    store: React.PropTypes.object.isRequired,
    model: React.PropTypes.object.isRequired
  },

  render() {
    const store = this.context.store
      , selectedItems = store.getState().models$car$selected.map(item=>{return item.id})
      , model = this.context.model
      , fields = model.list_display || []

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            {fields.map(field=>{
              return <Header key={`model-list-header-${field}`} model={model} field={field} changeOrder={this.props.changeOrder}  />
            })}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.props.items.map((item)=>{
            return <Row key={item.id} selected={_.indexOf(selectedItems, item.id)!==-1} model={model} fields={fields} item={item} deleteItem={this.props.deleteItem} selectItem={this.props.selectItem} />
          })}
        </tbody>
      </Table>
    )
  }
})

const stateMap = (state) => {
  return {
    items: state.models$car$items
  }
}

const dispatchMap = (dispatch) => {
  return { 
    deleteItem: (item) => {
       dispatch(deleteItem(item))
    },
    selectItem: (item, selected) => {
      dispatch(selecteItem(item, selected))
    },
    changeOrder: (field, order) => {
      dispatch(changeOrder(field, order))
    }
  }
}

module.exports = connect(stateMap, dispatchMap)(ModelGrid)
