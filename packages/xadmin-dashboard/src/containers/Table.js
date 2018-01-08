import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Cell from '../components/Cell'

class Table extends React.Component {

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
      <table 
        className="dashboard-container dashboard-container-table"
        key={`layer-${cellKey}-Table`}
      >
        {this.generateDOM()}
      </table>
    )
  }

}

Table.Title = '表格容器'
Table.Category = '容器组件'
Table.Container = true

Table.ParamSchema = {
  type: 'object',
  properties: {
    cols: {
      title: '列数',
      type: 'number'
    },
    rows: {
      title: '行数',
      type: 'number'
    }
  }
}

Table.CellReducer = (state={}, action) => {
  if(action.type == '@@x-dashboard/ADD_CELL') {
    return state
  }
  return state
}

export default Table
