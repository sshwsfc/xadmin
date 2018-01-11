import echarts from 'echarts'
import PropTypes from 'prop-types'
import React from 'react'

import elementResizeEvent from 'element-resize-event'

class ReactEcharts extends React.Component {

  // first add
  componentDidMount() {
    let echartObj = this.renderEchartDom()
    let onEvents = this.props.onEvents || {}

    this.bindEvents(echartObj, onEvents)
    // on chart ready
    if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj)

    // on resize
    elementResizeEvent(this.refs.echartsDom, () => {
      echartObj.resize()
    })
  }

  // update
  componentDidUpdate() {
    let echartObj = this.renderEchartDom()
    this.bindEvents(this.getEchartsInstance(), this.props.onEvents || [])
    echartObj.resize()
  }

  // remove
  componentWillUnmount() {
    echarts.dispose(this.refs.echartsDom)
  }

  //bind the events
  bindEvents(instance, events) {
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
  renderEchartDom() {
    // init the echart object
    let echartObj = this.getEchartsInstance()
    // set the echart option
    echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false)
    // set loading mask
    if (this.props.showLoading) echartObj.showLoading()
    else echartObj.hideLoading()

    return echartObj
  }

  getEchartsInstance() {
    // return the echart object
    return echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme)
  }

  render() {
    let style = this.props.style || {
      height: '100%'
    }
    // for render
    return (
      <div ref="echartsDom"
        className={this.props.className}
        style={style} />
    )
  }
}
ReactEcharts.propTypes = {
  option: PropTypes.object.isRequired,
  notMerge: PropTypes.bool,
  lazyUpdate: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  theme: PropTypes.string,
  onChartReady: PropTypes.func,
  showLoading: PropTypes.bool,
  onEvents: PropTypes.object
}

export default ReactEcharts
