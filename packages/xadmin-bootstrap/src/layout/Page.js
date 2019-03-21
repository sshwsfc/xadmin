import PageHeader from 'ant-design-pro/lib/PageHeader'
import { Layout, Menu } from 'antd'
import React from 'react'

class Page extends React.Component {
  render() {
    const { title, content, breadcrumb, extra, logp, nav, tabs, onTabChange } = this.props
    return (
      <div className={this.props.className} style={this.props.style}>
        <PageHeader
          title={title}
          logo={logp ? <img alt="" src={logp} /> : null}
          action={nav}
          content={content}
          extraContent={extra}
          breadcrumbList={breadcrumb}
          tabList={tabs}
          onTabChange={onTabChange}
        />
        <div style={{ margin: 10 }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Page
