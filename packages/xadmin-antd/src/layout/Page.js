import { PageHeader } from 'antd'
import { Layout, Menu } from 'antd'
import React from 'react'

class Page extends React.Component {
  render() {
    const { title, subTitle, content, breadcrumb, extra, actions, tabs, footer, className, style, children, ...pageProps } = this.props
    
    return (
      <div className={className} style={style}>
        <PageHeader
          title={title}
          subTitle={subTitle}
          extra={actions}
          tabs={tabs}
          breadcrumb={breadcrumb}
          footer={footer}
          style={{ margin: 10 }}
          {...pageProps}
        >
          { (content || extra) ? (
            <>
            { content && <div className="content padding">{content}</div> }
            { extra && <div className="extraContent">{extra}</div> }
            </>
          ): null }
        </PageHeader>
        <div style={{ margin: 10 }}>
          {children}
        </div>
      </div>
    )
  }
}

export default Page
