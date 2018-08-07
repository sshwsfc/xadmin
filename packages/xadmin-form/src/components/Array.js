import React from 'react'
import { FieldArray } from 'redux-form'
import { FieldGroup } from './base'
import { Panel, Button, PanelGroup } from 'react-bootstrap'
import { objectBuilder, prefixFieldKey } from '../builder'
import Icon from 'react-fontawesome'
import app from 'xadmin'

const defaultItemsRender = ({ fields, meta: { touched, error }, field, fieldsBuilder }) => {
  const { items, label } = field
  return (
    <div>
      <h5>{label}{' '}
        <Button bsSize="xsmall" onClick={() => fields.push()}><Icon name="plus"/></Button></h5>
      <PanelGroup accordion>
        {fields.map((name, index) => {
          const removeBtn = (<Button bsSize="xsmall" onClick={(e) => { fields.remove(index); e.persist() }} style={{ float: 'right' }}><Icon name="minus"/></Button>)
          const itemLable = (<h6>{label + ' ' + (index + 1)}{removeBtn}</h6>)
          const fieldsComponent = fieldsBuilder(name, index, removeBtn)
          return fieldsComponent.length > 1 ? (
            <Panel eventKey={index} key={`items${index}`}>
              <Panel.Heading>
                <Panel.Title toggle>{itemLable}</Panel.Title>
              </Panel.Heading>
              <Panel.Body collapsible>{fieldsComponent}</Panel.Body>
            </Panel>
          ) : (
            <div>{fieldsComponent}</div>
          )
        })}
      </PanelGroup>
      {(touched && error) ? error : null}
    </div>
  )
}

export default ({ input, label, meta, field, option, group: FieldGroup }) => {
  let renderItems = field.itemsRender || defaultItemsRender
  if(typeof renderItems === 'string') {
    renderItems = app.load_dict('array_render')[renderItems]
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
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <FieldArray name={field.name} label={label} component={renderItems} field={field} fieldsBuilder={fieldsBuilder} />
    </FieldGroup>
  )
}
