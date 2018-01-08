import React from 'react'
import Header from './Header'
import DashboardWrap from '../wrap'
import Dashboard from './Dashboard'
import ComponentTree from './ComponentTree'
import PropForm from './PropForm'
import { Layout, Icon, Tabs, Button, Card } from 'antd'

const { Sider, Content } = Layout
const TabPane = Tabs.TabPane

export default class Editor extends React.Component {
  
  state = {
    percent: 100,
    collapsedLeft: false,
    collapsedRight: false
  }

  toggleRight() {
    this.setState({
      collapsedRight: !this.state.collapsedRight
    })
  }

  toggleLeft() {
    this.setState({
      collapsedLeft: !this.state.collapsedLeft
    })
  }

  increase() {
    let percent = this.state.percent + 10
    if (percent > 100) {
      percent = 100
    }
    this.setState({ percent })
  }

  decline() {
    let percent = this.state.percent - 10
    if (percent < 0) {
      percent = 0
    }
    this.setState({ percent })
  }

  SliderChange = (value) => {
    this.setState({ percent: value })
  }

  renderHeader() {
    return (
      <Header
        SliderChange = { this.SliderChange }
        percent={ this.state.percent } 
        decline={ this.decline.bind(this) } 
        increase={ this.increase.bind(this) }/>
    )
  }

  renderMain() {
    const scale = this.state.percent / 100 + 0.0001
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsedLeft}
          width = { 250 }
          collapsedWidth = { 0 }
          className="left-sider"> 
          <Icon
            className="trigger-left"
            type={this.state.collapsedLeft ? 'double-right' : 'double-left'}
            onClick={this.toggleLeft.bind(this)}/>
          <h5 className="title">组件树</h5>
          <div className="sider-content">
            <ComponentTree />
          </div>
        </Sider>
        <Content style={{ overflow: 'auto', padding: 20 }}>
          <Dashboard scale={scale} />
        </Content>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsedRight}
          className="right-sider"
          width = { 300 }
          collapsedWidth = { 0 }>
          <Icon
            className="trigger-right"
            type={this.state.collapsedRight ? 'double-left' : 'double-right'}
            onClick={this.toggleRight.bind(this)}/>
          <h5 className="title m-b">属性面板</h5>
          <div className="sider-content" style={{ padding: '0 10px 20px' }}>
            <PropForm />
          </div>
        </Sider>
      </Layout>
    )
  }

  render() {
    return (
      <Layout style={{ height: '100%' }}>
        {this.renderHeader()}
        {this.renderMain()}
      </Layout>
    )
  }
}
