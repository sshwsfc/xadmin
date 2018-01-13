import React from 'react'
import { FieldArray } from 'redux-form'
import { Panel, Button, PanelGroup } from 'react-bootstrap'
import { Collapse } from 'antd'
import { objectBuilder } from 'xadmin-form'
import Icon from 'react-fontawesome'
import { app } from 'xadmin'

const defaultItemsRender = ({ fields, meta: { touched, error }, field, fieldsBuilder }) => {
  const { items, label } = field
  return (
    <div>
      <Button bsSize="xsmall" onClick={() => fields.push()}><Icon name="plus"/></Button>
      {fields.length ? (
      <div style={{ marginTop: 5 }}> 
      <Collapse bordered={false}>
        {fields.map((name, index) => {
          const removeBtn = (<Button bsSize="xsmall" onClick={(e) => { fields.remove(index); e.persist() }} style={{ float: 'right' }}><Icon name="minus"/></Button>)
          const itemLable = (<span>{label + ' ' + (index + 1)}{removeBtn}</span>)
          const fieldsComponent = fieldsBuilder(name, index, removeBtn, itemLable)
          return fieldsComponent.length > 1 ? (
            <Collapse.Panel header={itemLable} eventKey={index} key={`items${index}`}>
            {fieldsComponent}
            </Collapse.Panel>
          ) : (
            <div>{fieldsComponent}</div>
          )
        })}
      </Collapse>
      </div>
      ): null}
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
    const itemFields = items.fields ? (items.fields
      .map(f => { return { ...f, 
        key: name + '.' + f.key,
        name: name + '.' + f.name
      } })) : [ { ...items, key: name, name: name, label: itemLable } ]

    return objectBuilder(itemFields, items.render, option)
  }
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <FieldArray name={field.name} label={label} component={renderItems} field={field} fieldsBuilder={fieldsBuilder} />
    </FieldGroup>
  )
}
