import React from 'react'
import _ from 'lodash'
import { app, StoreWrap } from 'xadmin'
import { Icon } from 'xadmin/lib/components'
import DashboardWrap from '../wrap'
import Animate from './Animate'

const _transformSheet = function (stylesheet, namespace) {
  return stylesheet.
    // Prettier output.
    replace(/}\s*/ig, '\n}\n').
    // Regular rules are namespaced.
    replace(
      /(^|{|}|;|,)\s*([&a-z0-9\-~_=\.:#^\|\(\)\[\]\$'",>*\s]+)\s*(\{)/ig,
      function (matched) {
        return matched.replace(/[\&|#_]/g, '#' + namespace)
      }
    )
}

const ControlBar = React.createClass({

  getInitialState() {
    return { show: false }
  },

  onClose() {
    this.setState({ show: false })
  },

  render() {
    const { onRemove, cellKey, onCopy } = this.props
    return (
      <div className="widget-ctl-bar">
        <Icon onClick={onRemove} name="trash-o" />
      </div>
    )
  }
})

const MissWidgetType = ({ type }) => (<span>组件类型 [{type}] 未定义</span>)

const convertData = (data, value, editMode) => {
  if(typeof value == 'string' && value.indexOf('{{') >= 0) {
    try {
      value = _.template(value)(data)
    } catch (error) {
      if(!editMode) {
        console.error(error)
      }
    }
  }

  if(typeof value == 'string' && value.indexOf('data:') == 0) {
    return _.get(data, value.substring(5))
  } else if(_.isArray(value)) {
    return value.map(v => convertData(data, v, editMode))
  } else if(_.isPlainObject(value)) {
    return _.mapValues(value, v => convertData(data, v, editMode))
  } else{
    return value
  }
}

const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true
  }
  if(!_.isPlainObject(objA) || !_.isPlainObject(objB)) {
    return false
  }
  // object
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }
  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !shallowEqual(objA[keysA[i]], objB[keysA[i]]) ) {
      return false
    }
  }
  return true
}

@DashboardWrap('dashboard.cell')
export default class Cell extends React.Component {

  constructor(props) {
    super(props)
    const { cellKey, editMode, data, cells, params } = props
    const widgetParams = convertData(data, params, editMode)

    let display = true
    if(!editMode && widgetParams['__display__']) {
      display = eval(widgetParams['__display__'])
    }

    // 初始化不会跟随data改变而改变的东西
    this.state = {
      childrenCells: (params.childrenCells || []).map(key => cells[key]),
      events: this.getEvents(params.events),
      widgetParams,
      display, widgetDisplay: display
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = {}
    if(nextProps.cells !== this.props.cells || nextProps.params !== this.props.params) {
      newState['childrenCells'] = (nextProps.params.childrenCells || []).map(key => nextProps.cells[key])
    }
    if(nextProps.params && this.props.params && nextProps.params.events !== this.props.params.events) {
      newState['events'] = this.getEvents(nextProps.params.events)
    }
    if(nextProps.data !== this.props.data || nextProps.params !== this.props.params) {
      const oldParams = this.state.widgetParams
      const newParams = convertData(nextProps.data, nextProps.params)
      if(!shallowEqual(oldParams, newParams)) {
        newState['widgetParams'] = newParams
      }

      if(!nextProps.editMode && newParams['__display__']) {
        const data = nextProps.data
        const display = eval(newParams['__display__'])
        if(display != this.state.display) {
          newState['widgetDisplay'] = display
          const animed = newParams.animate && newParams.animate.active
          
          if (display || !animed) {
            newState['display'] = display
          }
        }
      }
    }
    if(Object.keys(newState).length > 0) {
      this.setState(newState)
    }
  }

  getEvents = (events) => {
    const { data, dispatchData } = this.props
    let es = {}
    if(events) {
      es = Object.keys(events).reduce((prev, eventName) => {
        prev[eventName] = ((data, func) => (e, args) => {
          const result = eval('result = ' + func)
          if(result && _.isPlainObject(result)) {
            dispatchData(result)
          }
        })(data, events[eventName])
        return prev
      }, {})
    }
    return es
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.editMode) { return true }
    // 在运行模式只有state变化时才刷新
    if(nextState != this.state) { return true }
    return false
  }

  render() {
    const { selected, params={}, data, cellKey, editMode, wrapStyle, widgetWrap,
      dispatchData, removeCell, selectCell, copyCell, onSettings, ...extraProps } = this.props

    // is should display
    if(!this.state.display) { return null }

    const animed = params.animate && params.animate.active
    const Widget = app.load_dict('dashboard_widgets')[params.type] || MissWidgetType
    const style = { height: '100%', padding: 0, position: 'relative', userSelect: 'none', ...wrapStyle }
    const cellSelected = selected && editMode

    if(cellSelected) {
      style['boxShadow'] = '0px 0px 1px #f00'
    }
    const widgetParams = this.state.widgetParams

    const canSelect = Widget.CanSelect || !Widget.Container
    const wrapId = 'dashboard-cell-wrap-' + cellKey.replace(/[\/\.]/g, '_')
    const cellStyle = widgetParams.style ? <style scope={true}>{_transformSheet(widgetParams.style, wrapId)}</style> : null
    const typeClassName = 'dashboard-widget-' + params.type.replace(/[\/\.]/g, '_')
    const wrapClassName = [ 'dashboard-cell-wrap', typeClassName ].join(' ')

    const wrap = widgetWrap || ((widget) => (editMode ? (
      <div id={wrapId} className={wrapClassName} style={style}>
        { cellSelected && <ControlBar onRemove={()=>removeCell(cellKey)} onCopy={()=>copyCell(cellKey)} cellKey={cellKey} /> }
        { canSelect ? (
          <div onClick={()=>editMode && selectCell(cellKey)} style={{ height: '100%' }}>
            { widget }
          </div>
        ) : widget }
        {cellStyle}
      </div>
    ) : (
      <div id={wrapId} className={wrapClassName} style={style}>
        { animed ? (
          <Animate id={wrapId + '-anim'} {...params.animate}
            show={this.state.widgetDisplay}
            onExited={()=>this.setState({ display: false })}
          >
            { widget }
          </Animate>
        ) : widget }
        {cellStyle}
      </div>
    )))

    return wrap(Widget ? <Widget key={cellKey} cellKey={cellKey} editMode={editMode}
      childrenCells={this.state.childrenCells} events={this.state.events} dispatchData={dispatchData}
      {...extraProps} {...widgetParams} /> : <div>没有找到组件类型 {params.type} </div>)
  }

}
