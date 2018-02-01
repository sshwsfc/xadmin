import React from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import Textarea from 'xadmin-form/lib/components/Textarea'
import { app, StoreWrap } from 'xadmin'

class HtmlPart extends React.Component {

  render() {
    const { html } = this.props
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }

}

HtmlPart.Title = 'HTML组件'

HtmlPart.ParamSchema = {
  type: 'object',
  properties: {
    html: {
      type: 'string',
      format: 'code'
    }
  },
  form: [ '*', { key: 'html', component: Textarea }, 'params' ]
}

export default HtmlPart
