import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Cell from '../components/Cell'
import DashboardWrap from '../wrap'

@DashboardWrap('dashboard.container')
class Box extends React.Component {

  generateDOM() {
    const { childrenCells, widgetProps, editMode, selectedChild, cellKey } = this.props
    const style = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }

    const children = childrenCells.filter(key => !editMode || key != selectedChild).map(key => (
      <Cell key={`box-child-${key}`} cellKey={key} editMode={editMode} widgetProps={widgetProps} wrapStyle={{ ...style, ...(editMode && selectedChild?{ opacity: 0.3 }:{}) }} />
    ))
    if(editMode && selectedChild) {
      children.push(<Cell key={`box-child-${selectedChild}`} cellKey={selectedChild} editMode={editMode} widgetProps={widgetProps} wrapStyle={style} />)
    }
    return children
  }
  
  render() {
    const { layouts, editMode, cellKey, style } = this.props
    return (
      <div key={`layer-${cellKey}-Box`} className="dashboard-container dashboard-container-box" style={{ height: '100%', position: 'relative', ...style }}>
        {this.generateDOM()}
      </div>
    )
  }

}

Box.Title = '盒子容器'
Box.Category = '容器组件'
Box.Container = true

Box.ParamSchema = {
  type: 'object',
  properties: {  }
}

Box.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    return state
  }
  return state
}

export default Box
