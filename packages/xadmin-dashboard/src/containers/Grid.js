import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import ReactGridLayout, { WidthProvider } from 'react-grid-layout'
import Cell from '../components/Cell'
import DashboardWrap from '../wrap'

const GridLayout = WidthProvider(ReactGridLayout)

@DashboardWrap('dashboard.container')
class Grid extends React.Component {

  shouldComponentUpdate() {
    return this.props.editMode
  }
  
  getLayerProps = () => {
    const { cols=36, yheight=10, margin=15, gridMargin=0, verticalFree=false, layout, editMode, selectedCell, selectedChild } = this.props
    return {
      className: 'layout',
      style: { margin: -1 * gridMargin },
      margin: [ margin, margin ],
      draggableHandle: '.widget-ctl-bar',
      cols: cols,
      rowHeight: yheight,
      verticalCompact: !verticalFree,
      ...((editMode && selectedCell == selectedChild) ? {} : {
        isDraggable: false,
        isResizable: false
      }),
      onLayoutChange: () => {}
    }
  }

  generateDOM() {
    const { childrenCells, widgetProps, editMode } = this.props
    return childrenCells.map(key => {
      return (
        <div key={key}>
          <Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} />
        </div>
        )
    })
  }

  layoutChange = (layout) => {
    this.props.mergeParams({ layout })
  }

  render() {
    const { layout=[], editMode, cellKey } = this.props
    return (
      <div className="dashboard-container dashboard-container-grid">
        <GridLayout 
          key={`layer-${cellKey}-grid`}
          {...this.getLayerProps()}
          layout={layout}
          onLayoutChange={(layout) => this.layoutChange(layout)}
        >
          {this.generateDOM()}
        </GridLayout>
      </div>
    )
  }

}

Grid.Title = '栅格容器'
Grid.Category = '容器组件'
Grid.Container = true

Grid.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'number'
    },
    yheight: {
      title: '行高度',
      type: 'number'
    },
    margin: {
      title: '间距',
      type: 'number'
    },
    gridMargin: {
      title: '容器外间距',
      type: 'number'
    },
    verticalFree: {
      title: '自由摆放',
      type: 'boolean'
    }
  }
}

Grid.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    return {
      ...state,
      layout: [
        ...(state.layout || []),
        { i: action.key, x: 0, y: 0, w: 4, h: 4, ...action.layout }
      ]
    }
  } else if(action.type == '@@x-dashboard/REMOVE_CELL') { 
    return {
      ...state,
      layout: state.layout.filter(l => l.i !== action.key)
    }
  }
  return state
}

export default Grid
