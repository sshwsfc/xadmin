import React from 'react'
import PropTypes from 'prop-types'
import { ButtonToolbar, Button, Modal, Nav, NavItem } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { ModelWrap } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'
import { Block, StoreWrap, app } from 'xadmin-core'

@ModelWrap('modaltab.tabs')
class ModelTabs extends React.Component {

  render() {
    const { model, onSelect } = this.props
    const { _t } = app.context
    const tabs = model.tabs
    return tabs ? (
      <Nav bsStyle="tabs" activeKey="__current__" style={{ marginBottom: 10 }}>
      { tabs.map(tab=>{
        return (
          <NavItem eventKey={tab.url || '__current__'} onClick={()=>{
            if(tab.url) onSelect(tab.url)
          }}>{tab.title}</NavItem>)
      }) }
      </Nav>
    ) : null
  }

}

export default {
  name: 'xadmin.model.modaltabs',
  blocks: {
    'model.list.submenu': ({ nodes, ...props }) => {
      return <ModelTabs {...props} />
    }
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
