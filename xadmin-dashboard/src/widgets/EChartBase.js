import echarts from 'echarts'
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import elementResizeEvent from 'element-resize-event'

class EChartBase extends React.Component {

  getEvents = () => {
    return this.props.onEvents || {}
  }

  isLayer = () => {
    return this.props.echartParent !== undefined
  }

  // first add
  componentDidMount() {
    if(!this.isLayer()) {
      const echartObj = this.renderEchartDom()
      // on resize
      if(echartObj) {
        elementResizeEvent(this.refs.echartsDom, () => {
          echartObj.resize()
        })
      }
    } else {
      const { cellKey, echartParent } = this.props
      echartParent.series[cellKey] = this.getSeries()
    }
  }

  // update
  componentDidUpdate() {
    if(!this.isLayer()) {
      this.renderEchartDom()
    } else {
      const { cellKey, echartParent } = this.props
      echartParent.series[cellKey] = this.getSeries()
      echartParent.renderEchartDom()
    }
  }

  // remove
  componentWillUnmount() {
    if(!this.isLayer()) {
      echarts.dispose(this.refs.echartsDom)
    } else {
      const { cellKey, echartParent } = this.props
      echartParent.series = _.omit(echartParent.series, cellKey)
      echartParent.renderEchartDom()
    }
  }

  getSeries = () => {
    return []
  }
  
  getOption = () => {
    const { title, toolbox, commonSc } = this.props

    let opts = { 
      backgroundColor: {
        type: 'radial',
        x: 0.4,
        y: 0.4,
        r: 0.35,
        colorStops: [ {
          offset: 0,
          color: '#895355' // 0% 处的颜色
        }, {
          offset: .4,
          color: '#593640' // 100% 处的颜色
        }, {
          offset: 1,
          color: '#39273d' // 100% 处的颜色
        } ],
        globalCoord: false // 缺省为 false
      },
      title: {
        text:'无标题',
        textStyle: {
          color: 'rgba(255,255,255,0.9)'
        },
        x:'left'
      },
      legend: {
        show: true,
        orient: 'vertical',
        left: 'right',
        data: []
      },
      xAxis:{
        axisLabel: {
          show:true,
          inside:false,
          formatter: function (val) {
            return val
          }
        },
        axisTick:{
          inside:true,
          show:true
        }, 
        type: 'category',
        data: []
      },
      yAxis:{
        axisLabel: {
          show:true,
          inside:false,
          formatter: function (val) {
            return val
          }
        },
        axisTick:{
          inside:false,
          show:true
        },
        type: 'value'
      },
      tooltip:{
        trigger:'axis'
      },
      series: this.getSeries(),
      ...commonSc
    }

    return opts
  }


  //bind the events
  bindEvents = (instance, events) => {
    let _loop =  (eventName) => {
      // ignore the event config which not satisfy
      if (typeof eventName === 'string' && typeof events[eventName] === 'function') {
        // binding event
        instance.off(eventName)
        instance.on(eventName, (param) => {
          events[eventName](param, instance)
        })
      }
    }

    for (let eventName in events) {
      _loop(eventName)
    }

  }
  // render the dom
  renderEchartDom = () => {
    setTimeout(this.renderEchartDomTick, 0)
  }

  // render the dom
  renderEchartDomTick = () => {
    // init the echart object
    const echartObj = this.getEchartsInstance()
    // set the echart option
    echartObj.setOption(this.getOption(), false, false)
    // set loading mask
    if (this.props.showLoading) echartObj.showLoading()
    else echartObj.hideLoading()
    this.bindEvents(echartObj, this.getEvents())

    return echartObj
  }

  getEchartsInstance = () => {
    if(_.isNil(this.refs.echartsDom)) {
      return null
    }
    return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme)
  }

  render() {
    // for render
    return !this.isLayer() ? (
      <div ref="echartsDom"
        className={this.props.className}
        style={{ height: '100%' }} />
    ) : null
  }
}

EChartBase.PropTypes = {
  notMerge: PropTypes.bool,
  lazyUpdate: PropTypes.bool,
  theme: PropTypes.string,
  showLoading: PropTypes.bool,
  events: PropTypes.object
}

EChartBase.ParamSchema = {
  type: 'object',
  properties: {
    showLoading: {
      title: '显示Loading',
      type: 'boolean'
    },
    notMerge: {
      title: '不使用合并参数',
      type: 'boolean'
    },
    lazyUpdate: {
      title: '延迟更新',
      type: 'boolean'
    }
  }
}

export default EChartBase
