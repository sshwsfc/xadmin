import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import { Block, app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'

import { FormGroup, ControlLabel, FormControl, Col, HelpBlock, Table, OverlayTrigger, Popover, Button, ButtonGroup, Input, Dropdown, MenuItem, Well, Panel, Media } from 'react-bootstrap'
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
  item: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  selected: PropTypes.bool.isRequired,
  changeSelect: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  canDelete: PropTypes.bool.isRequired,
  editItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  actions: PropTypes.array
}
const HeaderLink = ({ onClick, children }) => <a style={{ cursor: 'pointer' }} onClick={onClick}>{children}</a>

@ModelWrap('model.list.header')
class Header extends React.Component {

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
  }

  render() {
    const { title, order, showText, style } = this.props
      , icon = {
        'ASC' : <Icon name="sort-asc" />,
        'DESC' : <Icon name="sort-desc" />
      }[order] || ''
    const items = [ ...this.renderOrder(), ...(Block('model.list.header.menu', this) || []) ]
    return (items.filter(item=>!_.isNil(item)).length>0) ? (
      <Dropdown id="nav-dropdown" style={style}>
        <HeaderLink bsRole="toggle">{title} {icon}</HeaderLink>
        <Dropdown.Menu>
          {React.Children.toArray(items)}
        </Dropdown.Menu>
      </Dropdown>
    ) : ( showText === false ? null : <span>{title} {icon}</span>)
  }
}

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

@ModelWrap('model.list.item')
class Item extends React.Component {

  state = { over: false }

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
}
Item.WrappedComponent.propTypes = {
  item: PropTypes.object,
  field: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired
}

@ModelWrap('model.checkall')
class AllCheck extends React.Component {

  handleSelect(e) {
    const selected = this.refs.selector.checked
    this.props.changeAllSelect(selected)
  }

  render() {
    const { selecteall } = this.props
    return <input type="checkbox" ref="selector" checked={selecteall} onChange={this.handleSelect.bind(this)} />
  }

}

class GridRowComponent extends BaseRow {

  handleSelect(e) {
    const selected = this.refs.selector.checked
    this.props.changeSelect(selected)
  }

  renderRow() {
    const { item, fields, selected } = this.props
    return (
      <tr>
        <td key=".checkbox" className={selected?'bg-warning':''}>
          <input type="checkbox" ref="selector" checked={selected} onChange={this.handleSelect.bind(this)} />
        </td>
        {React.Children.toArray(fields.map(field=>{
          return (
            <Item key={`.${field}`} item={item} field={field} selected={selected} wrap={
              ({ children, ...props })=><td className={selected?'bg-warning':''} {...props}>{children}</td>
            } />
          )
        }))}
        <td key=".action" className={selected?'bg-warning':''} style={{ textAlign: 'center' }}>
          <ButtonGroup>
            {React.Children.toArray(this.actions())}
          </ButtonGroup>
        </td>
      </tr>
    )
  }
}

const GridRow = ModelWrap('model.list.row')(GridRowComponent)

@ModelWrap('model.items')
class Grid extends React.Component {

  render() {
    const { fields, items, loading } = this.props
    const { _t } = app.context
    if(loading) {
      return <Panel><Panel.Body><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel.Body></Panel>
    } else {
      if(items.length > 0) {
        return (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th><AllCheck /></th>
                  {React.Children.toArray(fields.map(field=>{
                    return <th><Header key={`model-list-header-${field}`} field={field}  /></th>
                  }))}
                  <th style={{ textAlign: 'center' }}>{_t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {React.Children.toArray(items.map((item)=>{
                  return <GridRow key={item.id} fields={fields} id={item.id} />
                }))}
              </tbody>
            </Table>
          </div>
        )
      } else {
        return (<Well>{_t('No Data')}</Well>)
      }
    }
  }
}
Grid.WrappedComponent.propTypes = {
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired
}

class ListRowComponent extends BaseRow {

  handleChange(e) {
    const selected = this.refs.selector.checked
    this.props.changeSelect(selected)
  }

  renderRow() {
    const { item, fields, selected } = this.props
    const actions = this.actions()
    return (
      <Panel bsStyle={selected?'danger':'default'}>
        <Panel.Body>
          <input type="checkbox" ref="selector" checked={selected} onChange={this.handleChange.bind(this)} />
          <Media>
            <Media.Body>
              <Media.Heading><Item item={item} field={fields[0]} selected={selected} /></Media.Heading>
              {React.Children.toArray(fields.slice(1).map(field=>{
                return (
                  <Item item={item} field={field} selected={selected} wrap={
                    ({ children, ...props })=><p key={`item-${item.id}-${field}`} {...props}>{children}</p>
                  } />
                )
              }))}
            </Media.Body>
          </Media>
        </Panel.Body>
        <Panel.Footer><ButtonGroup>{actions}</ButtonGroup></Panel.Footer>
      </Panel>
    )
  }
}
const ListRow = ModelWrap('model.list.row')(ListRowComponent)

@ModelWrap('model.items')
class List extends React.Component {

  render() {
    const { fields, items, loading } = this.props
    const { _t } = app.context

    if(loading) {
      return <Panel><Panel.Body><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel.Body></Panel>
    } else {
      if(items.length > 0) {
        return (
          <div>
            <div style={{ marginBottom: 10 }}>
              {React.Children.toArray(fields.map(field=>{
                return (<Header key={`model-list-header-${field}`} field={field} showText={false} style={{
                  marginRight: 10, fontSize: '0.8em'
                }} />)
              }))}
            </div>
            <div>
              {React.Children.toArray(items.map(item => <ListRow key={item.id} fields={fields} id={item.id} />))}
            </div>
          </div>)
      } else {
        return (<Well>{_t('No Data')}</Well>)
      }
    }
  }
}

List.WrappedComponent.propTypes = {
  fields: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired
}

export {
  Grid, List, Header, GridRow, ListRow, Item, BaseRow
}
