import React from 'react'
import _ from 'lodash'
import DNR from 'react-rnd'
import Cell from '../components/Cell'
import DashboardWrap from '../wrap'

@DashboardWrap('dashboard.container')
class FreeBox extends React.Component {

  shouldComponentUpdate() {
    return this.props.editMode
  }
  
  onResize = (key, ele) => {
    const { layout={} } = this.props
    layout[key] = {
      ...(layout[key] || {}),
      width: ele.clientWidth, height: ele.clientHeight
    }
    this.props.mergeParams({ layout })
  }

  onDrag = (key, { x, y }) => {
    const { layout={} } = this.props
    layout[key] = {
      ...(layout[key] || {}),
      x, y
    }
    this.props.mergeParams({ layout })
  }

  generateDOM() {
    const { childrenCells, widgetProps, editMode, selectedCell, selectedChild, cellKey, resizeGrid, dragGrid, layout={} } = this.props

    if(editMode) {
      const dnrProps = {}
      if(resizeGrid) {
        dnrProps['resizeGrid'] = [ resizeGrid.x, resizeGrid.y ]
      }
      if(dragGrid) {
        dnrProps['dragGrid'] = [ dragGrid.x, dragGrid.y ]
      }
      return childrenCells.map(key => (
        <DNR 
          default={{
            x: 50,
            y: 50,
            width: 100,
            height: 100
          }}
          size={{ ...layout[key] }}
          position={{ ...layout[key] }}
          style={{ pointerEvents: 'auto' }}
          bounds="parent"
          onResizeStop={(e,direction,ele,delta) => this.onResize(key, ele)}
          onDragStop={(e,data) => this.onDrag(key, data)}
          disableDragging={selectedCell != selectedChild}
          {...dnrProps}
        ><Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} /></DNR>
      ))
    } else {
      return childrenCells.map(key => (
        <div style={{ position: 'absolute', ...{
          left: layout[key].x !== undefined ? layout[key].x : 50,
          top: layout[key].y !== undefined ? layout[key].y : 50,
          width: layout[key].width !== undefined ? layout[key].width : 100,
          height: layout[key].height !== undefined ? layout[key].height : 100
        } }}><Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} /></div>
      ))
    }
  }
  
  render() {
    const { layouts, editMode, cellKey, style } = this.props
    return (
      <div key={`layer-${cellKey}-FreeBox`} style={{ height: '100%', position: 'relative' }} className="dashboard-container dashboard-container-freebox">
        {this.generateDOM()}
      </div>
    )
  }

}

FreeBox.Title = '自由容器'
FreeBox.Category = '容器组件'
FreeBox.Container = true

FreeBox.ParamSchema = {
  type: 'object',
  properties: {
    resizeGrid: {
      title: '尺寸栅格',
      type: 'object',
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        }
      }
    },
    dragGrid: {
      title: '拖拽栅格',
      type: 'object',
      properties: {
        x: {
          type: 'number'
        },
        y: {
          type: 'number'
        }
      }
    }
  }
}

FreeBox.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    let layout = {
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      ...action.layout
    }
    if(action.copyFrom && state.layout && state.layout[action.copyFrom]) {
      const c = state.layout[action.copyFrom]
      layout = { ...c, x: c.x + 10, y: c.y + 10 }
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

FreeBox.LayoutSchema ={
  type: 'object',
  properties: {
    x: {
      title: 'X坐标',
      type: 'number'
    },
    y: {
      title: 'Y坐标',
      type: 'number'
    },
    width: {
      title: '宽',
      type: 'number'
    },
    height: {
      title: '高',
      type: 'number'
    }
  }
}

FreeBox.getChildLayout = (state, key) => {
  return (state.layout || {})[key]
}
FreeBox.saveChildLayout = (state, key, values) => {
  const layout = state.layout || {}
  return {
    layout: {
      ...layout,
      [key]: { ...layout[key], ...values }
    }
  }
}

export default FreeBox
