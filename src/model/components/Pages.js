import React from 'react'
import { Link } from 'react-router'
import { Button, Nav } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, app } from '../../index'
import { ModelWrap } from '../base'

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
    const { title, canAdd, addItem } = this.props
    const { _t } = app.context
    return (
      <div>
        <Nav>
          { Block('model.list.nav', this) }
        </Nav>
        <div className="navbar-btn pull-right hide-xs">
          { Block('model.list.navbtn', this) }
          { canAdd ?
          (<Button bsStyle="primary" onClick={addItem}><Icon name="plus"/> {_t('Add {{object}}', { object: title })}</Button>) : null
          }
        </div>
      </div>
      )
  },

  render() {
    const { icon, title, componentClass, location } = this.props
    const ItemsComponent = componentClass || Grid
    const query = location && location.query
    return (
      <Page title={(<span><Icon name={icon}/> {title}</span>)} nav={this.renderNav()}>
        { Block('model.list.submenu', this) }
        <Pagination bsSize="small" />
        <SubMenu />
        <ItemsComponent query={query} />
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

