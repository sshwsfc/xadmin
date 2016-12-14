import React from 'react'
import { Link } from 'react-router'
import { Button, Nav } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block } from '../../index'
import { ModelWrap } from '../base'

import Pagination from './Pagination'
import { Grid } from './Items'
import SubMenu from './SubMenu'
import ActionBar from './ActionBar'

const ModelList = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    canAdd: React.PropTypes.bool.isRequired,
    addItem: React.PropTypes.func.isRequired
  },

  renderNav() {
    const { title, canAdd, addItem } = this.props
    return (
      <div>
        <Nav>
          { Block('model.list.nav', this) }
        </Nav>
        <div className="navbar-btn pull-right hide-xs">
          { Block('model.list.navbtn', this) }
          { canAdd ?
          (<Button bsStyle="primary" onClick={addItem}><Icon name="plus"/> Add {title}</Button>) : null
          }
        </div>
      </div>
      )
  },

  render() {
    const { icon, title, componentClass } = this.props
    const ItemsComponent = componentClass || Grid
    return (
      <Page title={(<span><Icon name={icon}/> {title}</span>)} nav={this.renderNav()}>
        { Block('model.list.submenu', this) }
        <Pagination bsSize="small" />
        <SubMenu />
        <ItemsComponent />
        <ActionBar />
        <Pagination bsSize="" />
      </Page>
      )
  }

})

export default ModelWrap('model.list')(ModelList)
