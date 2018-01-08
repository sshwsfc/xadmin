import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import ReactGridLayout, { WidthProvider, Responsive } from 'react-grid-layout'
import Cell from '../components/Cell'

const GridLayout = WidthProvider(Responsive)

class Grid extends React.Component {

  getLayerProps = () => {
    const { cols={}, yheight=10, margin=15, gridMargin=0, verticalFree=false, layout, editMode } = this.props
    return {
      className: 'layout',
      style: { margin: -1 * gridMargin },
      margin: [ margin, margin ],
      draggableHandle: '.widget-ctl-bar',
      cols: { lg: 36, md: 36, sm: 24, xs: 12, xxs: 6, ...cols },
      rowHeight: yheight,
      verticalCompact: !verticalFree,
      ...(editMode ? {} : {
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

  layoutChange = (layouts) => {
    this.props.mergeParams({ layouts })
  }

  render() {
    const { layouts, editMode, cellKey } = this.props
    return (
      <div className="dashboard-container dashboard-container-grid">
        <GridLayout 
          key={`layer-${cellKey}-grid`}
          {...this.getLayerProps()}
          layouts={layouts}
          onLayoutChange={(layout, layouts) => this.layoutChange(layouts)}
        >
          {this.generateDOM()}
        </GridLayout>
      </div>
    )
  }

}

Grid.Title = '响应式容器'
Grid.Category = '容器组件'
Grid.Container = true

Grid.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'object',
      properties: {
        lg: {
          title: 'LG',
          type: 'number'
        },
        md: {
          title: 'MD',
          type: 'number'
        },
        sm: {
          title: 'SM',
          type: 'number'
        },
        xs: {
          title: 'XS',
          type: 'number'
        },
        xxs: {
          title: 'XXS',
          type: 'number'
        }
      }
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
      layouts: {
        ...state.layouts,
        lg: [
          ...(state.layouts && state.layouts.lg || []),
          { i: action.key, x: 0, y: 0, w: 4, h: 4 }
        ]
      }
    }
  }
  return state
}

export default Grid
