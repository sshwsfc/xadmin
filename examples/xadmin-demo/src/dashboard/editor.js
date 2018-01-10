import React from 'react'
import { Button, Popover } from 'antd'
import { app, StoreWrap, Block } from 'xadmin-core'
import { DashboardWrap } from 'xadmin-dashboard'
import { Editor } from 'xadmin-dashboard/lib/editor'

const LoadBtn = DashboardWrap('load.button')(({ loadData }) => <Button onClick={loadData} icon="sync">加载布局</Button>)
const DumpBtn = DashboardWrap('dump.button')(({ href }) => <a download="dashboard.json" href={href} target="_blank">点击下载布局文件</a>)
const PreviewBtn = () => <Button onClick={()=>app.go('/show')} icon="eye">预览</Button>

const DumpBtnWrap = () => (
  <Popover trigger="click" rootClose={true} placement="bottom" content={<DumpBtn />}>
    <Button icon="download">导出布局</Button>
  </Popover>
)

const Design = (props) => (
  <div style={{ height: '100%' }}>
    { Block('main', { props })}
    <Editor {...props} />
  </div>
)

export default {
  blocks: {
    'dashboard.menu': ({ nodes }) => [ <LoadBtn />, <DumpBtnWrap />, <PreviewBtn /> ]
  },
  mappers: {
    'dump.button': {
      data: ({ dashboard }) => {
        return { data: dashboard }
      },
      compute: (_, { data }) => {
        const str = JSON.stringify({ params: data.params, cells: data.cells, endpoints: data.endpoints },null,2)
        const b64 = window.btoa(unescape(encodeURIComponent(str)))
        return { href: 'data:application/json;base64,' + b64 }
      }
    }
  },
  routers: {
    '/' : {
      path: 'edit',
      component: Design
    }
  }
}
