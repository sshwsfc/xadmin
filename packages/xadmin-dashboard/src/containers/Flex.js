import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Cell from '../components/Cell'
import DashboardWrap from '../wrap'

@DashboardWrap('dashboard.container')
class Flex extends React.Component {

  generateDOM() {
    const { childrenCells, widgetProps, editMode, layout={} } = this.props

    return childrenCells.map(key => {
      const {
        width='auto', height='auto',
        order=0,
        flexGrow=0,
        flexShrink=1,
        flexBasis='auto',
        alignSelf='auto'
      } = layout[key] || {}
      return (
        <div style={{
          width,
          height,
          order,
          flexGrow,
          flexShrink,
          flexBasis,
          alignSelf
        }}><Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} /></div>
      )
    })

  }

  render() {
    const { layouts, editMode, cellKey,
      flexDirection='row',
      flexWrap='wrap',
      justifyContent='flex-start',
      alignItems='flex-start',
      alignContent='flex-start'
    } = this.props

    const style = {
      height: '100%',
      display: 'flex',
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent
    }

    return (
      <div style={style} key={`container-${cellKey}-Flow`} className="dashboard-container dashboard-container-flow" >
        {this.generateDOM()}
      </div>
    )
  }

}

Flex.Title = 'Flex布局容器'
Flex.Category = '容器组件'
Flex.Container = true

Flex.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    let layout = {
      width: 100,
      height: 100,
      ...action.layout
    }
    return {
      ...state,
      layout: {
        ...(state.layout || {}),
        [action.key]: layout
      }
    }
  } else if(action.type == '@@x-dashboard/REMOVE_CELL') { 
    return {
      ...state,
      layout: { ..._.omit(state.layout, action.key) }
    }
  }
  return state
}


Flex.ParamSchema = {
  type: 'object',
  properties: {
    flexDirection: {
      type: 'string',
      title: '排列方向',
      enum: [ 'row' , 'row-reverse' , 'column' , 'column-reverse' ],
      enum_title: [ '水平方向，起点在左端' , '水平方向，起点在右端' , '垂直方向，起点在上沿' , '垂直方向，起点在下沿' ]
    },
    flexWrap: {
      type: 'string',
      title: '换行方式',
      enum: [ 'nowrap' , 'wrap' , 'wrap-reverse' ],
      enum_title: [ '不换行' , '换行' , '向上换行' ]
    },
    justifyContent: {
      type: 'string',
      title: '主轴对齐',
      enum: [ 'flex-start' , 'flex-end' , 'center' , 'space-between', 'space-around' ],
      enum_title: [ '左对齐' , '右对齐' , '居中' , '两端对齐', '两侧的间隔相等' ]
    },
    alignItems: {
      type: 'string',
      title: '交叉轴对齐',
      enum: [ 'flex-start' , 'flex-end' , 'center' , 'baseline', 'stretch' ],
      enum_title: [ '起点对齐' , '终点对齐' , '中点对齐' , '文字基线对齐', '占满容器' ]
    },
    alignContent: {
      type: 'string',
      title: '多轴对齐',
      enum: [ 'flex-start' , 'flex-end' , 'center' , 'space-between', 'space-around', 'stretch' ],
      enum_title: [ '左对齐' , '右对齐' , '居中' , '两端对齐', '两侧的间隔相等', '占满容器' ]
    }
  }
}

Flex.LayoutSchema ={
  type: 'object',
  properties: {
    width: {
      title: '宽',
      type: 'string'
    },
    height: {
      title: '高',
      type: 'string'
    },
    order: {
      title: '排列顺序',
      type: 'number'
    },
    flexGrow: {
      title: '放大比例',
      type: 'number'
    },
    flexShrink: {
      title: '缩小比例',
      type: 'number'
    },
    flexBasis: {
      title: '占据主轴空间',
      type: 'string'
    },
    alignSelf: {
      type: 'string',
      title: '对齐方式',
      enum: [ 'auto', 'flex-start' , 'flex-end' , 'center' , 'baseline', 'stretch' ],
      enum_title: [ '自动', '起点对齐' , '终点对齐' , '中点对齐' , '文字基线对齐', '占满容器' ]
    }
  }
}

Flex.getChildLayout = (state, key) => {
  return (state.layout || {})[key]
}
Flex.saveChildLayout = (state, key, values) => {
  const layout = state.layout || {}
  return {
    layout: {
      ...layout,
      [key]: { ...layout[key], ...values }
    }
  }
}

export default Flex
