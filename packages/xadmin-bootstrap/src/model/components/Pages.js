import React from 'react'
import PropTypes from 'prop-types'
import { Button, Nav, Row, Col } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { app } from 'xadmin'
import { C, Page } from 'xadmin-ui'
import { ModelWrap, ModelBlock } from 'xadmin-model'

import Pagination from './Pagination'
import Form from './Form'
import Info from './Info'
import SubMenu from './SubMenu'
import ActionBar from './ActionBar'

@ModelWrap('model.page.list')
class ModelListPage extends React.Component {

  renderNav() {
    const { title, canAdd, addItem, model } = this.props
    const { _t } = app.context
    return [
      <Nav key="nav-left" className="mr-auto">
        <ModelBlock name="model.list.nav" />
      </Nav>,
      <Nav key="nav-right">
        <ModelBlock name="model.list.navbtn" />
        { canAdd ?
          (<Button variant="primary" onClick={addItem}><Icon name="plus"/> {_t('Add {{object}}', { object: model.title })}</Button>) : null
        }
      </Nav>
    ]
  }

  render() {
    const { icon, title, location, model } = this.props
    const ItemsComponent = (model.components && model.components.DataTable) || C('Model.DataTable')
    const query = location && location.query

    const GridComponents = [
      <div key="model-list-subnav" style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
        <Pagination size="sm" className="my-0"/>
        <SubMenu />
      </div>,
      <ItemsComponent key="model-list-grid" query={query} />,
      <ActionBar key="model-list-action" />,
      <Pagination key="model-list-pagination" />
    ]

    return (
      <Page className={`xadmin-model-list-${model.key}`} title={(<span><Icon name={icon}/> {title}</span>)} nav={this.renderNav()}>
        <ModelBlock name="model.list.submenu" />
        <ModelBlock name="model.list.sidemenu" >
          { sideMenu => (
            <ModelBlock name="model.list.sidepanel" >
              { sidePanel => (sideMenu || sidePanel) ? (
                <Row>
                  { sideMenu ? <Col sm={(sideMenu && sidePanel) ? 1 : 2}>{ sideMenu }</Col> : null }
                  <Col sm={(sideMenu && sidePanel) ? 9 : 10}>{ GridComponents }</Col>
                  { sidePanel ? <Col sm={(sideMenu && sidePanel) ? 1 : 2}>{ sidePanel }</Col> : null  }
                </Row>
              ) : GridComponents }
            </ModelBlock>
          ) }
        </ModelBlock>
      </Page>
    )
  }

}

@ModelWrap('model.page.form')
class ModelFormPage extends React.Component {

  renderNav() {
    return [
      <Nav key="nav-left" className="mr-auto">
        <ModelBlock name="model.edit.nav" />
      </Nav>,
      <Nav key="nav-right">
        <ModelBlock name="model.edit.navbtn" />
      </Nav>
    ]
  }

  render() {
    const { params, location: { query }, title, model, onSuccess, componentClass } = this.props
    const FormComponent = (model.components && model.components.DataForm) || C('Model.DataForm')
    return (
      <Page title={title} className={`xadmin-model-form-${model.key}`} nav={this.renderNav()}>
        <ModelBlock name="model.form.before" />
        <FormComponent id={params && params.id} query={query} onSubmitSuccess={onSuccess} />
        <ModelBlock name="model.form.after" />
      </Page>
    )
  }

}

@ModelWrap('model.page.detail')
class ModelDetailPage extends React.Component {

  renderNav() {
    const { onClose, onEdit, canEdit } = this.props
    const { _t } = app.context
    return [
      <Nav key="nav-left" className="mr-auto">
        <ModelBlock name="model.detail.nav" />
      </Nav>,
      <Nav key="nav-right">
        <ModelBlock name="model.detail.navbtn" />
        {canEdit?<Button onClick={onEdit} className="mr-2"><Icon name="pencil"/> {_t('Edit')}</Button>:null}
        <Button  onClick={onClose} variant="secondary">{_t('Back')}</Button>
      </Nav>
    ]
  }

  render() {
    const { params, title, model, componentClass } = this.props
    const DetailComponent = (model.components && model.components.DataDetail) || C('Model.DataDetail')
    const { _t } = app.context

    return (
      <Page title={title} className={`xadmin-model-detail-${model.key}`} nav={this.renderNav()}>
        <ModelBlock name="model.detail.before" />
        <DetailComponent id={params && params.id} />
        <ModelBlock name="model.detail.after" />
      </Page>
    )
  }

}

export {
  ModelListPage,
  ModelFormPage,
  ModelDetailPage
}

