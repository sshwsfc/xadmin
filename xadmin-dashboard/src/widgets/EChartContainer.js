import echarts from 'echarts'
import React from 'react'
import EChartBase from './EChartBase'
import Cell from '../components/Cell'

import elementResizeEvent from 'element-resize-event'

class EChartContainer extends EChartBase {

  series = {}

  getSeries = () => {
    return Object.values(this.series)
  }

  generateLayers() {
    const { childrenCells, widgetProps, editMode } = this.props
    return childrenCells.map(key => {
      return (<Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} echartParent={this} 
        widgetWrap={(widget)=> widget || null} />)
    })
  }

  render() {
    // for render
    return (
      <div style={{ height: '100%' }}>
        <div ref="echartsDom"
          className={this.props.className}
          style={{ height: '100%' }} />
        <div style={{ position: 'absolute', top: -1000, display: 'none' }}>
          {this.generateLayers()}
        </div>
      </div>
    )
  }

}

EChartContainer.Title = 'EChart容器'
EChartContainer.Category = '容器组件'
EChartContainer.Container = true
EChartContainer.CanSelect = true

EChartContainer.ParamSchema = {
  type: 'object',
  properties: { }
}

EChartContainer.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    return state
  }
  return state
}


export default EChartContainer
