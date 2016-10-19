import React from 'react'
import { Link } from 'react-router'
import { Button, Nav } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block } from '../../index'
import { ModelWrap } from '../base'

import Pagination from './Pagination'
import Grid from './Grid'
import SubMenu from './SubMenu'
import ActionBar from './ActionBar'

const ModelList = React.createClass({

  propTypes: {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    addModel: React.PropTypes.func.isRequired
  },

  renderNav() {
    const { title } = this.props
    return (
      <div>
        <Nav>
          { Block('model.list.nav', this) }
        </Nav>
        <div className="navbar-btn pull-right hide-xs">
          <Button bsStyle="primary" onClick={this.props.addModel}><Icon name="plus"/> Add {title}</Button>
        </div>
      </div>
      )
  },

  render() {
    const { icon, title } = this.props
    return (
      <Page title={(<span><Icon name={icon}/> {title}</span>)} nav={this.renderNav()}>
        <Pagination bsSize="small" />
        <SubMenu />
        <Grid />
        <ActionBar />
        <Pagination bsSize="" />
      </Page>
      )
  }

})

module.exports = ModelWrap('model.list')(ModelList)
