import React from 'react'
import { StoreWrap, config as _c, Block, app } from 'xadmin'
import { IsAuthenticated } from 'xadmin-auth'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

function itemRender(route, params, routes, paths) {
  const last = routes.indexOf(route) === routes.length - 1
  const click = (to) => () => app.go(to)
  return last ? <span>{route.breadcrumbName}</span> : <a onClick={click('/' + paths.join(''))}>{route.breadcrumbName}</a>
}

@StoreWrap('main.menu')
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

@IsAuthenticated
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
          <Header style={{ background: '#fff', padding: 0, height: 47, boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 3px', zIndex: 10 }}>
            <Icon
              className="trigger pull-left"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            {/* <Breadcrumb routes={routes} params={params} itemRender={itemRender} style={{ float: 'left', lineHeight: '47px' }} /> */}
            <div className="pull-right">
              <Menu mode="horizontal">
                <Block name="topmenu" el={this} />
              </Menu>
            </div>
          </Header>
          <Content style={{ margin: 15,  overflow: 'initial' }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            &copy; <slot>{_c('site.copyright')}</slot>
          </Footer>
        </Layout>
      </Layout>
    )
  }

}
export default App
