import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import { ModelWrap } from 'xadmin-model'
import { app } from 'xadmin'

@ModelWrap('modaltab.tabs')
class ModelTabs extends React.Component {

  render() {
    const { model, onSelect } = this.props
    const { _t } = app.context
    const tabs = model.tabs
    return tabs ? (
      <Nav bsStyle="tabs" activeKey="__current__" style={{ marginBottom: 10 }}>
        { tabs.map((tab, i)=>(
          <Nav.Item key={i} eventKey={tab.url || '__current__'} onClick={()=>{
            if(tab.url) onSelect(tab.url)
          }}>{tab.title}</Nav.Item>)
        ) }
      </Nav>
    ) : null
  }

}

export default {
  name: 'xadmin.model.modaltabs',
  blocks: {
    'model.list.submenu': ({ nodes, ...props }) => <ModelTabs key="modelTabs" {...props} />
  },
  mappers: {
    'modaltab.tabs': {
      method: {
        onSelect: ({ model, router }) => (url) => {
          router.push(url)
        }
      }
    }
  }
}
export { ModelTabs }
