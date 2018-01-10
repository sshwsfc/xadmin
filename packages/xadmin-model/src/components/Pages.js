import React from 'react'
import { Link } from 'react-router'
import { Button, Nav, Row, Col } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { Block, app } from 'xadmin-core'
import { ModelWrap } from '../base'

import Page from './Page'
import Pagination from './Pagination'
import { Grid } from './Items'
import Form from './Form'
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
    const { title, canAdd, addItem, model } = this.props
    const { _t } = app.context
    return (
      <div>
        <Nav>
          { Block('model.list.nav', this) }
        </Nav>
        <div className="navbar-btn pull-right hide-xs">
          { Block('model.list.navbtn', this) }
          { canAdd ?
          (<Button bsStyle="primary" onClick={addItem}><Icon name="plus"/> {_t('Add {{object}}', { object: model.title })}</Button>) : null
          }
        </div>
      </div>
      )
  },

  render() {
    const { icon, title, componentClass, location } = this.props
    const ItemsComponent = componentClass || Grid
    const query = location && location.query

    const sideMenu = Block('model.list.sidemenu', this)
    const sidePanel = Block('model.list.sidepanel', this)

    const GridComponents = [
      <Pagination bsSize="small" />,
      <SubMenu />,
      <ItemsComponent query={query} />
    ]

    return (
      <Page title={(<span><Icon name={icon}/> {title}</span>)} nav={this.renderNav()}>
        { Block('model.list.submenu', this) }
        { (sideMenu || sidePanel) ? (
          <Row>
            { sideMenu ? <Col sm={3}>{ sideMenu }</Col> : null }
            <Col sm={9}>{ GridComponents }</Col>
            { sidePanel ? <Col sm={3}>{ sidePanel }</Col> : null  }
          </Row>
        ) : GridComponents }
        <ActionBar />
        <Pagination bsSize="" />
      </Page>
      )
  }

})


const ModelForm = React.createClass({

  propTypes: {
    title: React.PropTypes.string.isRequired,
    onSuccess: React.PropTypes.func.isRequired
  },

  render() {
    const { params, location: { query }, title, onSuccess, componentClass } = this.props
    const FormComponent = componentClass || Form
    return (
      <Page title={title}>
        { Block('model.form.before', this) }
        <FormComponent id={params && params.id} query={query} onSubmitSuccess={onSuccess} />
        { Block('model.form.after', this) }
      </Page>
    )
  }

})

export default {
  ModelListPage: ModelWrap('model.page.list')(ModelList),
  ModelFormPage: ModelWrap('model.page.form')(ModelForm),
  ModelDetailPage: ModelWrap('model.page.detail')(ModelForm)
}

