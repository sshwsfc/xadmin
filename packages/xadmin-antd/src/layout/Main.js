import React from 'react'
import { Block } from 'xadmin'

import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

import './layout.css'

export default class Main extends React.Component {

  render() {
    return (
      <>
        <Block name="body" />
        <Layout id="xadmin-main" style={{ backgroundColor: 'transparent' }}>
          {this.props.children}
        </Layout>
      </>
    )
  }

}
