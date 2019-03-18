import React from 'react'
import { app, StoreWrap } from 'xadmin'
import Cell from './Cell'
import DashboardWrap from '../wrap'
import Root from './Root'

@DashboardWrap('dashboard.view')
class Dashboard extends React.Component {

  renderContent() {
    const { params, scale, cells, editMode=true } = this.props
    const { background='transparent', height=1080, width='auto' } = params
    const childrenCells = Object.keys(cells).filter(key => cells[key].parent == Root.key)
    
    const style = { position: 'relative', height, width, background }
    if(!editMode) {
      style['overflow'] = 'hidden'
    }
    if(scale) {
      style['transform'] = 'scale('+ scale +')'
    }
    const Main = Root.getWidget()

    return <Main className="dashboard" editMode={editMode} style={style} cellKey={Root.key} childrenCells={childrenCells} />
  }

  componentDidCatch(error, info) {
    this.props.showError({ error, info })
  }

  render() {
    const { height=1080, width='auto' } = this.props.params
    return (
      <div className="dashboard" style={{ width, height, margin: '0 auto' }}>
        {this.renderContent()}
      </div>
    )
  }

}

export default Dashboard
