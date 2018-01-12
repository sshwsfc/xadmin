import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import app from 'xadmin'
import Icon from 'react-fontawesome'
import { Item } from './components/Items'

export default [
  (SubPrev, schema) => {
    if(schema.type == 'string' && [ 'time', 'date', 'datetime' ].indexOf(schema.format) > -1) {
      const dtf = app.load_dict('config').date_format || {}
      const format = schema.dateFormat || { time: dtf.time || 'LT', date: dtf.date || 'LL', datetime: dtf.datetime || 'LLL' }[schema.format]
      return ({ value, wrap: WrapComponent }) => {
        const time = moment(value)
        return <WrapComponent>{time.format(format)}</WrapComponent>
      }
    } else if(schema.type == 'string' && schema.enum && schema.enum_title) {
      return ({ value, wrap: WrapComponent }) => {
        let result = null
        let index = schema.enum.indexOf(value)
        if(_.isArray(schema.enum_title) && index > -1) {
          result = schema.enum_title[index]
        } else {
          result = schema.enum_title[value]
        }
        return <WrapComponent>{result || value}</WrapComponent>
      }
    } else if((schema.type == 'number' || schema.type == 'integer') && schema.enum && schema.enum_title) {
      return ({ value, wrap: WrapComponent }) => {
        let result = null
        let index = schema.enum.indexOf(value)
        if(_.isArray(schema.enum_title) && index > -1) {
          result = schema.enum_title[index]
        }
        return <WrapComponent>{result || value}</WrapComponent>
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
          return <Item nest={true} item={{ [fieldName]: item }} field={fieldName} schema={schema.items} wrap={itemWrap} />
        }) : null
        return <WrapComponent>{renderValue}</WrapComponent>
      }
    } else if(schema.type == 'string' && schema.format == 'email') {
      return ({ value, wrap: WrapComponent }) => {
        return <WrapComponent>{value ? <a href={`mailto:${value}`}>{value}</a> : ''}</WrapComponent>
      }
    } else if(schema.type == 'object') {
      return ({ value, wrap }) => {
        const displayField = schema.display_field || 'name'
        const WrapComponent = wrap
        return <Item nest={true} item={value} field={displayField} schema={schema.properties[displayField]} wrap={wrap} />
      }
    }
    return SubPrev
  }
]
