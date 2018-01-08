import React from 'react'
import _ from 'lodash'
import { Menu, Icon, Col, Row, Button, Popover, Progress , Modal, Tabs, Slider } from 'antd'
import { app, StoreWrap, Block } from 'xadmin'
import DashboardWrap from '../wrap'

import XMenu from './Menu'
import DashForm from './DashForm'
import DataModal from './DataModal'
import ConnectModal from './ConnectModal'

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup
const ButtonGroup = Button.Group
const TabPane = Tabs.TabPane

const WidgetCategories = [ '容器组件', '图表组件', '地图组件', '展示组件', '装饰组件', '3D组件' ]

@DashboardWrap('dashboard.view')
export default class Header extends React.Component {

  state = {
    showDataModal: false,
    showConnectModal: false,
    showDashboardModal: false
  }

  constructor() {
    super()
    const widgets = app.load_dict('dashboard_widgets')

    this.addMenu = _.uniq([ 
      ...WidgetCategories, 
      ...Object.values(widgets).map(Widget => Widget.Category).filter(c=>!_.isNil(c)), 
      '其他' 
    ]).map(category => (
      <SubMenu key={`category-${category}`} title={category}>
        {Object.keys(widgets)
          .filter(key=> (category == '其他' && widgets[key].Category === undefined) || widgets[key].Category == category)
          .map(key=>{
            const Widget = widgets[key]
            const link =  <a onClick={()=>this.addCell(key)}>{ Widget.Icon || null } { Widget.Title }</a>
            return (
              <Menu.Item key={key}>
              {
                Widget.Screenshot ? (
                  <Popover 
                    placement="right" 
                    content={<img className="screenshot" src={Widget.Screenshot} />} 
                    title={ Widget.Title } 
                    overlayClassName="popover-position">
                    {link}
                  </Popover>
                ) : link
              }
              </Menu.Item>
            )
          })
        }
      </SubMenu>
    ))
  }
  
  addCell = (type) => {
    const Widget = app.load_dict('dashboard_widgets')[type]
    this.props.addCell({ type })
  }

  changeLayer = (editLayer) => {
    const { params, saveParams } = this.props
    saveParams({
      ...params,
      editLayer
    })
  }

  render() {
    const percents = this.props.percent
    const marks = {
      0: { style:{ fontSize:'12px' },label:'0%' },
      25: '25%',
      50: '50%',
      75: '75%',
      100: '100%'
    }
    const content1 = (
      <div className="popover-button">
        <Button icon="laptop" />
        <Button icon="tablet" />
        <Button icon="mobile" />
      </div>
    )
    const content2 = (
      <div className="slider">
        <Button onClick={this.props.decline} icon="minus" />
        <Slider 
          className="progress"
          marks={marks} 
          value={percents} 
          onChange={this.props.SliderChange}/>
        <Button onClick={this.props.increase} icon="plus" />
      </div>
    )
    return (
      <div className="header-bg">
        <Row>
          <Col span={3} className="b-bottom logo">
            E.T LIVE生产平台
          </Col>
          <Col span={14}>
            <Menu
              theme="dark"
              selectedKeys={[ this.state.current ]}
              mode="horizontal"> 
              <SubMenu key="add-cell" title={<span><Icon type="plus-circle-o" /><span>添加组件</span></span>}>
                { this.addMenu }
              </SubMenu>
              <Menu.Item key="dashboard-form">
                <a onClick={()=>this.setState({ showDashboardModal: true })}><Icon type="setting" />页面属性</a>
                <DashForm show={this.state.showDashboardModal} onClose={()=>this.setState({ showDashboardModal: false })} />
              </Menu.Item>
              <Menu.Item key="datasource">
                <a onClick={()=>this.setState({ showDataModal: true })}><Icon type="retweet" />数据源</a>
                <DataModal show={this.state.showDataModal} onClose={()=>this.setState({ showDataModal: false })} />
              </Menu.Item>
              <Menu.Item key="connect">
                <a onClick={()=>this.setState({ showConnectModal: true })}><Icon type="retweet" />接口管理</a>
                <ConnectModal show={this.state.showConnectModal} onClose={()=>this.setState({ showConnectModal: false })} />
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={7} className="b-bottom">
            <Popover placement="bottom"  content={content1} trigger="hover">
              <Button icon="laptop" />
            </Popover>
            <Popover placement="bottom"  content={content2} trigger="hover">
              <Button type="" icon="search" /> 
            </Popover>
            {Block('dashboard.menu', this)}
          </Col>
        </Row>
      </div>
    )
  }
}
