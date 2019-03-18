import React from 'react'
import _ from 'lodash'
import EChartContainer from './EChartContainer'
import './china'

class EChartMap extends EChartContainer {

  getOption = () => {
    const opts = {
      tooltip: {},
      geo: [ {
        type:'map',
        map: 'china',
        itemStyle: {
          normal: {
            borderWidth: 3,
            shadowBlur: 50,
            shadowColor: 'rgba(255, 255, 255, 0.2)',
            borderColor: '#51ccfe'
          },
          emphasis: {
            color: 'rgba(64, 173, 229, 1)',
            areaColor: null,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 1)'
          }
        }
      } ],
      series: this.getSeries()
    }
    return opts
  }

}

EChartMap.Title = '地图容器'
EChartMap.Category = '地图组件'
EChartMap.Container = true
EChartMap.CanSelect = true

EChartMap.ParamSchema = {
  type: 'object',
  properties: { }
}

EChartMap.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    return state
  }
  return state
}

export default EChartMap
