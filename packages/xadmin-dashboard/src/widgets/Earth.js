import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Page, Icon } from 'xadmin/lib/components'
import { app, StoreWrap } from 'xadmin'
import elementResizeEvent from 'element-resize-event'
import WebGL from './WebGL'
import earth from '../gls/earth'

const Earth = React.createClass({

  propTypes: {
    data: React.PropTypes.any
  },

  getOption() {
    const { title, toolbox, data } = this.props
    const opts = { }

    return opts
  },

  render() {
    const { backgroundColor='#CCC' } = this.props
    return <WebGL modal={earth} />
  }

})

Earth.Title = '3D地球'

Earth.ParamSchema = {
  type: 'object',
  properties: {
    zoom: {
      title: '缩放',
      type: 'number'
    },
    backgroundColor: {
      title: '背景颜色',
      type: 'string',
      format: 'color'
    }
  }
}

export default Earth
