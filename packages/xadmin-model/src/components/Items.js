import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import { app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { Page, Loading } from 'xadmin-layout'

import { Form, Jumbotron, Container, Row, Col, Table, Nav, OverlayTrigger, Popover, Button, ButtonGroup, Dropdown, Card, Media } from 'react-bootstrap'
import { ModelWrap, ModelBlock } from '../base'
import './Items.css'

class BaseRow extends React.Component {

  actions() {
    const { canEdit, canDelete } = this.props
    const { _t } = app.context
    let actions = (this.props.actions || []).map(Action => <Action {...this.props} />)
    if(canEdit) {
      actions.push(<Button key="action-edit" size="sm" className="model-list-action" style={{ height: '1.5rem', lineHeight: 1 }} onClick={this.props.editItem}>{_t('Edit')}</Button>)
    }
    if(canDelete) {
      actions.push((
        <OverlayTrigger key="action-delete" trigger="click" rootClose placement="top" overlay={
          <Popover id="delete-item-popover">
            <p><strong>{_t('Comfirm Delete')}？</strong></p>
            <p className="text-center">
              <Button variant="danger" onClick={this.props.deleteItem}>{_t('Delete')}</Button>
            </p>
          </Popover>
        }>
          <Button size="sm" className="model-list-action" style={{ height: '1.5rem', lineHeight: 1 }} variant="danger">{_t('Delete')}</Button>
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

class HeaderLink extends React.Component {
  render() {
    const { onClick, children } = this.props
    return <a style={{ cursor: 'pointer' }} onClick={onClick}>{children}</a>
  }
}

@ModelWrap('model.list.header')
class Header extends React.Component {

  renderOrder() {
    const { field, order, canOrder } = this.props
    const { _t } = app.context
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <Dropdown.Item onSelect={e=>{ this.props.changeOrder('ASC') }} active={order==='ASC'}><Icon name="sort-amount-asc" /> {_t('Sort ASC')}</Dropdown.Item>,
        <Dropdown.Item onSelect={e=>{ this.props.changeOrder('DESC') }} active={order==='DESC'}><Icon name="sort-amount-desc" /> {_t('Sort DESC')}</Dropdown.Item>
      ]
      if(order != '') {
        orderItems.push(<Dropdown.Item onSelect={e=>{ this.props.changeOrder('') }}><Icon name="close" /> {_t('Clear order')}</Dropdown.Item>)
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

    return (
      <ModelBlock name="model.list.header.menu" el={this}>
        { bs => {
          const items = [ ...this.renderOrder(), ...(bs||[]) ]

          return items.length ? (
            <Dropdown key="nav-dropdown" style={style}>
              <Dropdown.Toggle as={HeaderLink}>
                {title} {icon}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {React.Children.toArray(items)}
              </Dropdown.Menu>
            </Dropdown>
          ) : ( showText === false ? null : <span>{title} {icon}</span>)

        } }
      </ModelBlock>
    )
  }
}

const ItemEditFieldGroup = ({ label, meta, input, field, children }) => {
  const groupProps = {}
  const attrs = field.attrs || {}
  const error = meta.error
  const help = field.description || field.help

  if (attrs.size) {
    groupProps['size'] = attrs.size
  }
  if (attrs.variant) {
    groupProps['variant'] = attrs.variant
  }

  const controlComponent = children ? children : (<Form.Control {...input} {...attrs} />)
  return (
    <Form.Group as={Row} className="mb-2" controlId={input.name} {...groupProps}>
      <Col sm={12}>
        {controlComponent}
        {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
        {help && <Form.Text className="text-muted">{help}</Form.Text>}
      </Col>
    </Form.Group>
  )
}

const ItemEditFormLayout = (props) => {
  const { children, pristine, invalid, handleSubmit, submitting, onClose } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      {children}
      <Button block type="submit" disabled={pristine || invalid || submitting} variant="primary" size="sm" onClick={handleSubmit}>{_t('Change')}</Button>
    </Form>
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
      wrapProps={{ destroyOnUnmount: false }}
      option={{ group : ItemEditFieldGroup }}
      onSubmit={(values) => {
        saveItem({ ...values, __partial__: true })
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
    const { item, field, schema, componentClass, wrap, nest, model, inList=true } = this.props
    const { _t } = app.context
    const editable_fields = model.editable_fields
    const RawWrapComponent = wrap || (({ children }) => <span style={{ cursor: 'pointer' }}>{children}</span>)
    const WrapComponent = (nest == true || editable_fields == undefined || editable_fields.indexOf(field) < 0) ? RawWrapComponent : ({ children, ...props }) => {
      return (
        <OverlayTrigger trigger="click" rootClose placement="top" overlay={
          <Popover id="table-item-edit-popover">
            <ItemEditForm item={item} field={field} schema={schema} onClose={()=>{}} />
          </Popover>
        }>
          <RawWrapComponent {...props} style={{ cursor: 'pointer' }}>{children}</RawWrapComponent>
        </OverlayTrigger>
      )
    }
    if(item == undefined || item == null) {
      return <WrapComponent><span className="text-muted">{_t('Null')}</span></WrapComponent>
    }
    let value = _.get(item, field)
    if(componentClass) {
      const ItemComponent = componentClass
      return <ItemComponent item={item} value={value} field={field} schema={schema} inList={inList} model={model} wrap={WrapComponent} />
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
      return <Loading />
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
        return (<Jumbotron><h5 className="text-center text-muted"><Icon name="file-o" /> {_t('No Data')}</h5></Jumbotron>)
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
    const { item, fields, selected, layout={ sm: 12, md: 6 } } = this.props
    return (
      <Col className="mb-2" {...layout}>
        <Card border={selected?'warning':'default'}>
          <Card.Body>
            <input key="select-checkbox" className="float-right" type="checkbox" ref="selector" checked={selected} onChange={this.handleChange.bind(this)} />
            <Card.Title><Item item={item} field={fields[0]} selected={selected} /></Card.Title>
            <Card.Text>
              {React.Children.toArray(fields.slice(1).map(field=>{
                return (
                  <Item item={item} field={field} selected={selected} wrap={
                    ({ children, ...props })=><span key={`item-${item.id}-${field}`} {...props}>{children}</span>
                  } />
                )
              }))}
            </Card.Text>
          </Card.Body>
          <Card.Footer><ButtonGroup>{this.actions()}</ButtonGroup></Card.Footer>
        </Card>
      </Col>
    )
  }
}
const ListRow = ModelWrap('model.list.row')(ListRowComponent)

@ModelWrap('model.items')
class List extends React.Component {

  render() {
    const { fields, items, loading, layout } = this.props
    const { _t } = app.context

    if(loading) {
      return <Loading />
    } else {
      if(items.length > 0) {
        return (
          <>
            <Nav className="mb-3">
              {React.Children.toArray(fields.map(field=>{
                return (<Nav.Item><Header key={`model-list-header-${field}`} field={field} showText={false} style={{
                  marginRight: 10, fontSize: '0.8em'
                }} /></Nav.Item>)
              }))}
            </Nav>
            <Row>
              {React.Children.toArray(items.map(item => <ListRow key={item.id} fields={fields} id={item.id} layout={layout} />))}
            </Row>
          </>)
      } else {
        return (<Jumbotron><h5 className="text-center text-muted"><Icon name="file-o" /> {_t('No Data')}</h5></Jumbotron>)
      }
    }
  }
}

export {
  Grid, List, Header, GridRow, ListRow, Item, BaseRow
}
