import React from 'react'
import _ from 'lodash'
import Cell from '../components/Cell'
import 'react-reflex/styles.css'

// then you can import the components
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'

class Flex extends React.Component {

  onStopResize = (e) => {
    console.log(e)
  }

  generateDOM() {
    const { childrenCells, widgetProps, orientation='vertical', editMode } = this.props
    const children = []
    childrenCells.forEach((key, index) => {
      children.push(
        <ReflexElement>
          <Cell cellKey={key} editMode={editMode} widgetProps={widgetProps} />
        </ReflexElement>
      )
      if(editMode && index !== childrenCells.length - 1) {
        children.push(<ReflexSplitter propagate={true} onStopResize={this.onStopResize} />)
      }
    })
    return (
      <ReflexContainer orientation={orientation}>
        {children}
      </ReflexContainer>
    )
  }

  render() {
    const { layouts, editMode, cellKey } = this.props
    return (
      <div key={`container-${cellKey}-Flow`} className="dashboard-container dashboard-container-flow" style={{ height: '100%' }} >
        {this.generateDOM()}
      </div>
    )
  }

}

Flex.Title = '流布局容器'
Flex.Category = '容器组件'
Flex.Container = true

Flex.ParamSchema = {
  type: 'object',
  properties: {
    orientation: {
      type: 'string',
      title: '方向',
      enum: [ 'vertical', 'horizontal' ],
      enum_title: [ '水平', '垂直' ]
    }
  }
}

export default Flex
