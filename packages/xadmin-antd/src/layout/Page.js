import { PageHeader } from 'antd'
import { Layout, Menu } from 'antd'
import React from 'react'

class Page extends React.Component {
  render() {
    const { title, subTitle, content, breadcrumb, extra, actions, tabs, footer } = this.props
    
    return (
      <div className={this.props.className} style={this.props.style}>
        <PageHeader
          title={title}
          subTitle={subTitle}
          extra={actions}
          tabs={tabs}
          breadcrumb={breadcrumb}
          footer={footer}
          style={{ margin: 10 }}
        >
          { (content || extra) ? (
            <>
            { content && <div className="content padding">{content}</div> }
            { extra && <div className="extraContent">{extra}</div> }
            </>
          ): null }
        </PageHeader>
        <div style={{ margin: 10 }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Page
