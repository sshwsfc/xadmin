import React from 'react'
import { Link } from 'react-router'
import _ from 'lodash'
import { Icon } from '../../components'
import { FormGroup, ControlLabel, FormControl, Col, HelpBlock, Table, OverlayTrigger, Popover, Button, ButtonGroup, Input, Dropdown, MenuItem, Well, Panel, Media } from 'react-bootstrap'
import { Block, app } from '../../index'
import { SchemaForm } from '../../form/base'
import { ModelWrap } from '../base'

class BaseRow extends React.Component {

  actions() {
    const { canEdit, canDelete } = this.props
    const { _t } = app.context
    let actions = (this.props.actions || []).map(Action => <Action {...this.props} />)
    if(canEdit) {
      actions.push(<Button bsSize="xsmall" onClick={this.props.editItem}>{_t('Edit')}</Button>)
    }
    if(canDelete) {
      actions.push((
        <OverlayTrigger trigger="click" rootClose placement="top" overlay={
          <Popover title={_t('Comfirm')} id="delete-item-popover">
          <p><strong>{_t('Comfirm Delete')}？</strong></p>
          <p className="text-center">
            <Button bsStyle="danger" onClick={this.props.deleteItem}>{_t('Delete')}</Button>
          </p>
          </Popover>
        }>
          <Button bsSize="xsmall">{_t('Delete')}</Button>
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
    const { _t } = app.context
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <MenuItem onSelect={e=>{ this.props.changeOrder('ASC') }} active={order==='ASC'}><Icon name="sort-amount-asc" /> {_t('Sort ASC')}</MenuItem>,
        <MenuItem onSelect={e=>{ this.props.changeOrder('DESC') }} active={order==='DESC'}><Icon name="sort-amount-desc" /> {_t('Sort DESC')}</MenuItem>
      ]
      if(order != '') {
        orderItems.push(<MenuItem onSelect={e=>{ this.props.changeOrder('') }}><Icon name="close" /> {_t('Clear order')}</MenuItem>)
      }
    }
    return orderItems
  },

  render() {
    const { title, order, showText, style } = this.props
      , icon = {
        'ASC' : <Icon name="sort-asc" />,
        'DESC' : <Icon name="sort-desc" />
      }[order] || ''
    const items = [ ...this.renderOrder(), ...(Block('model.list.header.menu', this) || []) ]
    return (items.filter(item=>!_.isNil(item)).length>0) ? (
      <Dropdown id="nav-dropdown" style={style}>
        <a style={{ cursor: 'pointer' }} bsRole="toggle">
          {title} {icon}
        </a>
        <Dropdown.Menu>
          {items}
        </Dropdown.Menu>
      </Dropdown>
      ) : ( showText === false ? null : <span>{title} {icon}</span>)
  }
}))

const ItemEditFieldGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.error
  const help = field.description || field.help

  if (error) {
    groupProps['validationState'] = 'error'
  }
  if (attrs.bsSize) {
    groupProps['bsSize'] = attrs.bsSize
  }
  if (attrs.bsStyle) {
    groupProps['bsStyle'] = attrs.bsStyle
  }

  const controlComponent = children ? children : (<FormControl {...input} {...attrs} />)
  return (
    <FormGroup controlId={input.name} {...groupProps}>
      <Col sm={12} style={{ marginBottom: -5 }}>
        {controlComponent}
        <FormControl.Feedback />
        {help && <HelpBlock style={{ marginBottom: 0 }}>{help}</HelpBlock>}
        {error && <HelpBlock style={{ marginBottom: 0 }}>{error}</HelpBlock>}
      </Col>
    </FormGroup>
    )
}

const ItemEditFormLayout = (props) => {
  const { children, pristine, invalid, handleSubmit, submitting, onClose } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <form className="form-horizontal inline-form" onSubmit={handleSubmit}>
      {children}
      <Button block type="submit" disabled={pristine || invalid || submitting} bsStyle="primary" bsSize="xs" onClick={handleSubmit}>{_t('Change')}</Button>
    </form>
  )
}

const ItemEditForm = ModelWrap('model.item')(({ item, field, schema, model, onClose, saveItem }) => {
  const formField = _.find(model.form || [], obj => obj && obj.key == field ) || { key: field }
  const required = (model.required || []).indexOf(field) >= 0 ? { required: [ field ] } : {}
  return (
    <SchemaForm formKey="ChangeDataForm" 
      initialValues={item}
      schema={{
        type: 'object',
        properties: {
          [field]: schema
        },
        form: [ formField ],
        ...required
      }}
      option={{ group : ItemEditFieldGroup }}
      onSubmit={(values) => {
        saveItem(values)
        onClose()
      }}
      onClose={onClose}
      component={ItemEditFormLayout}/>
    )
})

const Item = ModelWrap('model.list.item')(React.createClass({

  propTypes: {
    item: React.PropTypes.object,
    field: React.PropTypes.string.isRequired,
    schema: React.PropTypes.object.isRequired
  },

  getInitialState() { return { over: false } },

  render() {
    const { item, field, schema, componentClass, wrap, nest, model: { editable_fields } } = this.props
    const { _t } = app.context
    const RawWrapComponent = wrap || (({ children }) => <span>{children}</span>)
    const WrapComponent = (nest == true || editable_fields == undefined || editable_fields.indexOf(field) < 0) ? RawWrapComponent : ({ children, ...props }) => {
      return (
        <OverlayTrigger trigger="click" rootClose placement="top" overlay={
          <Popover id="table-item-edit-popover">
            <ItemEditForm item={item} field={field} schema={schema} onClose={()=>{}} />
          </Popover>
        }>
          <RawWrapComponent {...props}>{children}</RawWrapComponent>
        </OverlayTrigger>
      )
    }
    if(item == undefined || item == null) {
      return <WrapComponent><span className="text-muted">{_t('Null')}</span></WrapComponent>
    }
    let value = _.get(item, field)
    if(componentClass) {
      const ItemComponent = componentClass
      return <ItemComponent item={item} value={value} field={field} schema={schema} wrap={WrapComponent} />
    } else {
      return <WrapComponent>{value == undefined || value == null?<span className="text-muted">{_t('Null')}</span>:value}</WrapComponent>
    }
  }
}))

const AllCheck = ModelWrap('model.checkall')(React.createClass({

  handleSelect(e) {
    const selected = this.refs.selector.checked
    this.props.changeAllSelect(selected)
  },

  render() {
    const { selecteall } = this.props
    return <input type="checkbox" ref="selector" checked={selecteall} onChange={this.handleSelect} />
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
    const { _t } = app.context
    if(loading) {
      return <Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>
    } else {
      if(items.length > 0) {
        return (
          <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th><AllCheck /></th>
                {fields.map(field=>{
                  return <th><Header key={`model-list-header-${field}`} field={field}  /></th>
                })}
                <th style={{ textAlign: 'center' }}>{_t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item)=>{
                return <GridRow key={item.id} fields={fields} id={item.id} />
              })}
            </tbody>
          </Table>
          </div>
        )
      } else {
        return (<Well>{_t('No Data')}</Well>)
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
    const { _t } = app.context

    if(loading) {
      return <Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>
    } else {
      if(items.length > 0) {
        return (
          <div>
            <div style={{ marginBottom: 10 }}>
            {fields.map(field=>{
              return (<Header key={`model-list-header-${field}`} field={field} showText={false} style={{
                marginRight: 10, fontSize: '0.8em'
              }} />)
            })}
            </div>
            <div>
              {items.map(item => <ListRow key={item.id} fields={fields} id={item.id} />)}
            </div>
          </div>)
      } else {
        return (<Well>{_t('No Data')}</Well>)
      }
    }
  }
})

export default {
  Grid: ModelWrap('model.items')(ModelGrid),
  List: ModelWrap('model.items')(ModelList),
  Header, GridRow, ListRow, Item, BaseRow
}
