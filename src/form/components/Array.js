import React from 'react'
import { FieldArray } from 'redux-form'
import { FieldGroup } from './base'
import { Panel, Button, PanelGroup } from 'react-bootstrap'
import { objectBuilder } from '../builder'
import Icon from '../../components/Icon'
import { app } from '../../index'

const defaultItemsRender = ({ fields, meta: { touched, error }, field, fieldsBuilder }) => {
  const { items, label } = field
  return (
    <div>
      <h5>{label}{' '}
      <Button bsSize="xsmall" onClick={() => fields.push()}><Icon name="plus"/></Button></h5>
      <PanelGroup accordion>
        {fields.map((name, index) => {
          const removeBtn = (<Button bsSize="xsmall" onClick={() => fields.remove(index)} style={{ float: 'right' }}><Icon name="minus"/></Button>)
          const itemLable = (<h6>{label + ' ' + (index + 1)}{removeBtn}</h6>)
          const fieldsComponent = fieldsBuilder(name, index, removeBtn)
          return fieldsComponent.length > 1 ? (
            <Panel header={itemLable} eventKey={index} key={`items${index}`}>
            {fieldsComponent}
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

export default ({ input, label, meta: { touched, error }, field }) => {
  let renderItems = field.itemsRender || defaultItemsRender
  if(typeof renderItems === 'string') {
    renderItems = app.load_dict('array_render')[renderItems]
  }
  const { items } = field
  const fieldsBuilder = (name, index, removeBtn) => {
    const itemLable = (<div>{removeBtn ? removeBtn : ''}{label + ' ' + (index + 1)}</div>)
    const itemFields = items.fields ? (items.fields
      .map(f => { return { ...f, 
        key: name + '.' + f.key,
        name: name + '.' + f.name
      } })) : [ { ...items, key: name, name: name, label: itemLable } ]

    return objectBuilder(itemFields, items.render)
  }
  return <FieldArray name={field.name} label={label} component={renderItems} field={field} fieldsBuilder={fieldsBuilder} />
}
