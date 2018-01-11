import React from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import Textarea from 'xadmin-form/lib/components/Textarea'
import { app, StoreWrap } from 'xadmin-core'

class HtmlPart extends React.Component {

  render() {
    const { html, params=[] } = this.props
    const vs = params.reduce(( prev, { key, value }) => {
      prev[key] = value
      return prev
    }, {})
    return <div dangerouslySetInnerHTML={{ __html: _.template(html)(vs) }} />
  }

}

HtmlPart.Title = 'HTML组件'

HtmlPart.ParamSchema = {
  type: 'object',
  properties: {
    html: {
      type: 'string',
      format: 'code'
    },
    params: {
      type: 'array',
      title: '变量',
      items: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            title: '变量名'
          },
          value: {
            type: 'string',
            title: '变量值'
          }
        }
      }
    }
  },
  form: [ '*', { key: 'html', component: Textarea }, 'params' ]
}

export default HtmlPart
