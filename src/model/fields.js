import React from 'react'
import moment from 'moment'
import { Item } from './components/Items'

export default [
  (SubPrev, schema) => {
    if(schema.type == 'string' && schema.format == 'time') {
      return ({ value, wrap }) => {
        const time = moment(value)
        const WrapComponent = wrap
        return <WrapComponent>{time.fromNow()}</WrapComponent>
      }
    } else if(schema.type == 'array') {
      return ({ value, field, wrap }) => {
        const WrapComponent = wrap
        const fieldName = `${field}__items`
        const itemWrap = ({ children })=><span>{children}{', '}</span>
        const renderValue = value.map(item => {
          return <Item item={{ [fieldName]: item }} field={fieldName} schema={schema.items} wrap={itemWrap} />
        })
        return <WrapComponent>{renderValue}</WrapComponent>
      }
    } else if(schema.type == 'object') {
      return ({ value, wrap }) => {
        const displayField = schema.display_field || 'name'
        const WrapComponent = wrap
        return <Item item={value} field={displayField} schema={schema.properties[displayField]} wrap={wrap} />
      }
    }
    return SubPrev
  }
]
