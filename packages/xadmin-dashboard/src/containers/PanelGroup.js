import React from 'react'
import _ from 'lodash'
import Cell from '../components/Cell'
import { Panel, PanelGroup } from 'react-bootstrap'

class PanelGroupContainer extends React.Component {

  constructor(props, context) {
    super(props, context)
    const defaultPanel = props.defaultPanel === undefined ? 1 : props.defaultPanel
    this.state = {
      activeKey: `panel-${defaultPanel-1}`
    }
  }

  handleSelect = (activeKey) => {
    this.setState({ activeKey })
  }

  onClickSubHeader = (e, subHeader, index) => {
    const { events } = this.props
    if(events && events.onClickSubHeader) {
      events.onClickSubHeader(e, { subHeader, index })
      e.stopPropagation()
    }
  }

  render() {
    const { accordion=true, headers=[], subHeaders=[], defaultPanel=1, childrenCells, widgetProps, editMode, cellKey } = this.props
    return (
      <PanelGroup key={`container-${cellKey}-PanelGroup`} className="dashboard-container dashboard-container-panelgroup" 
        accordion={accordion}
        onSelect={this.handleSelect}
        activeKey={this.state.activeKey} >
        {childrenCells.map((cellKey, index) => (
          <Panel className={`panel-${index}` == this.state.activeKey ? 'active' : ''} header={(
            <span>{headers[index] || `面板${index+1}`}{subHeaders[index]?<span onClick={(e)=>this.onClickSubHeader(e, subHeaders[index], index)} className="sub-header">{subHeaders[index]}</span>:null}</span>
            )} eventKey={`panel-${index}`}>
            <Cell cellKey={cellKey} editMode={editMode} widgetProps={widgetProps} />
          </Panel>
        ))}
      </PanelGroup>
    )
  }

}

PanelGroupContainer.Title = '面板组容器'
PanelGroupContainer.Category = '容器组件'
PanelGroupContainer.Container = true

PanelGroupContainer.ParamSchema = {
  type: 'object',
  properties: {
    accordion: {
      type: 'boolean',
      title: '手风琴效果'
    },
    headers: {
      type: 'array',
      title: '面板标题',
      items: {
        type: 'string'
      }
    },
    subHeaders: {
      type: 'array',
      title: '面板副标题',
      items: {
        type: 'string'
      }
    },
    defaultPanel: {
      type: 'number',
      title: '默认展开面板'
    }
  }
}

PanelGroupContainer.EventSchema = {
  type: 'object',
  properties: {
    onClickSubHeader: {
      type: 'string',
      title: '副标题点击事件'
    }
  }
}

export default PanelGroupContainer
