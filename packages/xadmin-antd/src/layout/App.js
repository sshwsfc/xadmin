import React from 'react'
import { config as _c, Block, app } from 'xadmin'
import { Layout, Menu, Breadcrumb } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1
  const click = (to) => () => app.go(to)
  return last ? <span>{route.breadcrumbName}</span> : <a onClick={click('/' + paths.join(''))}>{route.breadcrumbName}</a>
}
class MenuBar extends React.Component {

  render() {
    return (
      <Block name="main.menu">
        {items => (
          <Menu theme="dark" mode={this.props.mode}>
            {items}
          </Menu>
        )}
      </Block>
    )
  }
}

class App extends React.Component {

  state = {
    collapsed: false,
    mode: 'inline'
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mode: !this.state.collapsed ? 'vertical' : 'inline'
    })
  }

  render() {
    const { routes, params } = this.props
    const Icon = this.state.collapsed ? MenuFoldOutlined : MenuUnfoldOutlined
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}
        >
          <div className="logo">
            {_c('site.logo')}
            {_c('site.title', 'Admin')}
          </div>
          <MenuBar mode={this.state.mode} />
        </Sider>
        <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200, transition: 'margin .2s' }}>
          <Header style={{ background: '#fff', boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 3px', zIndex: 10 }}>
            <Icon
              className="trigger pull-left"
              onClick={this.toggle}
              style={{ lineHeight: 'inherit', marginLeft: -40, fontSize: '1.2rem' }}
            />
            {/* <Breadcrumb routes={routes} params={params} itemRender={itemRender} style={{ float: 'left', lineHeight: '47px' }} /> */}
            <div style={{ float: 'right' }}>
              <Block name="top.right">
                {items => <Menu mode="horizontal" style={{ lineHeight: '62px' }}>{items}</Menu>}
              </Block>
            </div>
          </Header>
          <Content>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            &copy; <slot>{_c('site.copyright')}</slot>
          </Footer>
        </Layout>
      </Layout>
    );
  }

}
export default App
