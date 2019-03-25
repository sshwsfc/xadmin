import React from 'react'
import { FieldArray } from 'xadmin-form'
import { Card, Button, CardGroup } from 'react-bootstrap'
import { objectBuilder, prefixFieldKey } from 'xadmin-form/lib/builder'
import Icon from 'react-fontawesome'
import app from 'xadmin'

const defaultItemsRender = ({ fields, meta: { touched, error }, field, fieldsBuilder }) => {
  const { items, label } = field
  return (
    <div>
      <h5>
        <Button onClick={() => fields.push()}><Icon name="plus"/> {label}</Button>
      </h5>
      {fields.map((name, index) => {
        const removeBtn = (<Button variant="danger" size="sm" onClick={(e) => { fields.remove(index); e.persist() }} style={{ float: 'right', lineHeight: '1' }}><Icon name="trash"/></Button>)
        const itemLable = (<span>{label + ' ' + (index + 1)}{removeBtn}</span>)
        const fieldsComponent = fieldsBuilder(name, index, removeBtn)
        return fieldsComponent.length > 1 ? (
          <Card key={`items-${name}`} className="mt-2">
            <Card.Header>{itemLable}</Card.Header>
            <Card.Body>{fieldsComponent}</Card.Body>
          </Card>
        ) : (
          <div>{fieldsComponent}</div>
        )
      })}
      {(touched && error) ? error : null}
    </div>
  )
}

export default ({ input, label, field, option }) => {
  let renderItems = field.itemsRender || defaultItemsRender
  if(typeof renderItems === 'string') {
    renderItems = app.get('array_render')[renderItems]
  }
  const { items } = field
  const fieldsBuilder = (name, index, removeBtn, itemLable) => {
    const itemLabel = itemLable || (<div>{removeBtn ? removeBtn : ''}</div>)
    const itemFields = items.fields ? 
      (items.fields.map(f => prefixFieldKey(f, name + '.'))) : 
      [ { ...items, key: name, name: name, label: itemLabel } ]

    return objectBuilder(itemFields, items.render, option)
  }
  return (
    <FieldArray name={field.name} label={label} input={input} component={renderItems} field={field} fieldsBuilder={fieldsBuilder} />
  )
}
