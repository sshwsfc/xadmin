import React from 'react'
import { FieldArray } from 'xadmin-form'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Card, Button } from 'antd'
import { objectBuilder, prefixFieldKey } from 'xadmin-form'
import app from 'xadmin'

const defaultItemsRender = ({ fields, meta: { touched, error }, field, fieldsBuilder }) => {
  const { items, label } = field
  return (
    <div>
      <Button onClick={() => fields.push(null)}><PlusOutlined /></Button>
      {fields.map((name, index) => {
        const removeBtn = (<Button size="small" onClick={(e) => { fields.remove(index); e.persist() }} style={{ float: 'right' }}><DeleteOutlined /></Button>)
        const fieldsComponent = fieldsBuilder(name, index, removeBtn)
        return fieldsComponent.length > 1 ? (
          <Card
            key={`items${index}`}
            size="small"
            title={label + ' ' + (index + 1)}
            extra={removeBtn}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {fieldsComponent}
          </Card>
        ) : fieldsComponent
      })}
      {(touched && error) ? error : null}
    </div>
  );
}

export default ({ input, label, meta, field, option, group }) => {
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
    <FieldArray name={field.name} label={label} meta={meta} input={input} component={renderItems} field={field} group={group} fieldsBuilder={fieldsBuilder} />
  )
}
