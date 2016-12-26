import React from 'react'
import moment from 'moment'
import { Item } from './components/Items'
import { Icon } from '../components'

export default [
  (SubPrev, schema) => {
    if(schema.type == 'string' && schema.format == 'time') {
      return ({ value, wrap: WrapComponent }) => {
        const time = moment(value)
        return <WrapComponent>{time.format('YYYY-MM-DD')}</WrapComponent>
      }
    } else if(schema.type == 'string' && schema.enum_title) {
      return ({ value, wrap: WrapComponent }) => {
        return <WrapComponent>{schema.enum_title[value] || value}</WrapComponent>
      }
    } else if(schema.type == 'boolean') {
      return ({ value, wrap: WrapComponent }) => {
        return <WrapComponent style={{ textAlign: 'center' }}>{value ? <Icon name="check-circle" style={{ color: 'green' }} /> : <Icon name="times-circle" />}</WrapComponent>
      }
    } else if(schema.type == 'array') {
      return ({ value, field, wrap: WrapComponent }) => {
        const fieldName = `${field}__items`
        const itemWrap = ({ children })=><span>{children}{', '}</span>
        const renderValue = value ? value.map(item => {
          return <Item item={{ [fieldName]: item }} field={fieldName} schema={schema.items} wrap={itemWrap} />
        }) : null
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
