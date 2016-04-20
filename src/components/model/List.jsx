import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Button, Nav } from 'react-bootstrap'

import Page from '../Page'
import Icon from '../Icon'
import ModelMixin from './base'
import { block } from '../../plugin'

import Pagination from './Pagination'
import Grid from './Grid'
import SubMenu from './SubMenu'
import ActionBar from './ActionBar'

import { fetchItems } from '../../model/actions'

const ModelList = React.createClass({

  mixins: [ModelMixin],

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchItems({}))
  },

  renderNav() {
    return (
      <div>
        <Nav>
          {block('model.list.nav', this)}
        </Nav>
        <div className="navbar-btn pull-right hide-xs">
          <Button bsStyle="primary" onClick={()=>{this.context.router.push(this.model.$link.add.path)}}><Icon name="plus"/> Add Car</Button>
        </div>
      </div>
      )
  },

  render() {
    return (
      <Page title={(<span><Icon name={this.model.name}/> {this.model.name}</span>)} nav={this.renderNav()}>
        <Pagination bsSize='small' />
        <SubMenu />
        <Grid />
        <ActionBar />
        <Pagination bsSize='' />
      </Page>
      )
  }

})

module.exports = connect(state => {
  return {}
})(ModelList)
