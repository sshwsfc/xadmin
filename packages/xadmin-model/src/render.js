import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import app from 'xadmin'
import { Icon, C } from 'xadmin-ui'

export default [
  (SubPrev, schema) => {
    if(schema.renderTemplate) {
      return ({ value, wrap: WrapComponent, ...props }) => {
        const html = _.template(schema.renderTemplate)({ value, ...props })
        return <WrapComponent><span dangerouslySetInnerHTML={{ __html: html }}></span></WrapComponent>
      }
    } else if(schema.type == 'string' && [ 'time', 'date', 'date-time', 'datetime' ].indexOf(schema.format) > -1) {
      const dtf = app.load_dict('config').date_format || {}
      const format = schema.dateFormat || { time: dtf.time || 'LT', date: dtf.date || 'LL', 
        'date-time': dtf.datetime || 'LLL', 'datetime': dtf.datetime || 'LLL' }[schema.format]
      return ({ value, wrap: WrapComponent }) => {
        if(!_.isNil(value)) {
          const time = moment(value)
          return <WrapComponent>{time.format(format)}</WrapComponent>
        } else {
          return <WrapComponent><span className="text-muted">-</span></WrapComponent>
        }
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
        return <WrapComponent style={{ textAlign: 'center' }}><C is="Model.BooleanIcon" value={value} schema={schema} /></WrapComponent>
      }
    } else if(schema.type == 'array') {
      return ({ value, field, wrap: WrapComponent }) => {
        const fieldName = `${field}__items`
        const itemWrap = ({ children })=><span>{children}{', '}</span>
        const lastItemWrap = ({ children })=><span>{children}</span>
        if(!_.isArray(value)) {
          if(_.isString(value)) {
            value = value.split(',')
          } else {
            value = [ value ]
          }
        }
        const renderValue = value ? value.map((item, index) => {
          return <C is="Model.DataItem" nest={true} item={{ [fieldName]: item }} field={fieldName} schema={schema.items} wrap={value.length - 1 > index ? itemWrap : lastItemWrap} />
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
        return <C is="Model.DataItem" nest={true} item={value} field={displayField} schema={schema.properties[displayField]} wrap={wrap} />
      }
    }
    return SubPrev
  }
]
