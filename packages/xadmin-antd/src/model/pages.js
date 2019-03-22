import React from 'react'
import PropTypes from 'prop-types'
import {
  Layout, Menu, Button
} from 'antd'

import { app } from 'xadmin'
import { C, Page, Icon } from 'xadmin-ui'
import { ModelWrap, ModelBlock } from 'xadmin-model'

// import Pagination from './components/Pagination'
// import { Grid } from './components/Items'
// import Form from './components/Form'
// import Info from './components/Info'
// import SubMenu from './components/SubMenu'
// import ActionBar from './components/ActionBar'

const {
  Header, Content, Footer, Sider
} = Layout

@ModelWrap('model.page.list')
class ModelListPage extends React.Component {

  renderActions() {
    const { title, canAdd, addItem, model } = this.props
    const { _t } = app.context
    return (<>
      <ModelBlock name="model.list.navbtn" />
      { canAdd ?
        (<Button type="primary" onClick={addItem}><Icon name="plus"/> {_t('Add {{object}}', { object: model.title })}</Button>) : null
      }
    </>)
  }

  renderPageContent() {
    return (
      <ModelBlock name="model.list.nav" />
    )
  }

  render() {
    const { icon, title, location, model } = this.props
    const ItemsComponent = (model.components && model.components.model_list) || C('Model.DataTable')
    const query = location && location.query

    const GridComponents = [
      // <div key="model-list-subnav" style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
      //   <Pagination size="sm" className="my-0"/>
      //   <SubMenu />
      // </div>,
      // <ItemsComponent key="model-list-grid" query={query} />,
      // <ActionBar key="model-list-action" />,
      // <Pagination key="model-list-pagination" />
    ]
    return (
      <Page className={`xadmin-model-list-${model.key}`} 
        title={(<span><Icon name={icon}/> {title}</span>)} 
        content={this.renderPageContent()}
        actions={this.renderActions()}>
        <ModelBlock name="model.list.submenu" />
        <ModelBlock name="model.list.sidemenu" >
          { sideMenu => (
            <ModelBlock name="model.list.sidepanel" >
              { sidePanel => (sideMenu || sidePanel) ? (
                <Layout style={{ background: '#fff' }}>
                  { sideMenu ? <Sider width={200} style={{ background: '#fff' }}>{ sideMenu }</Sider> : null }
                  <Content>{ null }</Content>
                  { sidePanel ? <Sider width={200} style={{ background: '#fff' }}>{ sidePanel }</Sider> : null  }
                </Layout>
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
        <ModelBlock name="model.edit.nav" el={this} />
      </Nav>,
      <Nav key="nav-right">
        <ModelBlock name="model.edit.navbtn" el={this} />
      </Nav>
    ]
  }

  render() {
    const { params, location: { query }, title, model, onSuccess, componentClass } = this.props
    const FormComponent = componentClass || Form
    return (
      <Page title={title} className={`xadmin-model-form-${model.key}`} nav={this.renderNav()}>
        <ModelBlock name="model.form.before" el={this} />
        <FormComponent id={params && params.id} query={query} onSubmitSuccess={onSuccess} />
        <ModelBlock name="model.form.after" el={this} />
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
        <ModelBlock name="model.detail.nav" el={this} />
      </Nav>,
      <Nav key="nav-right">
        <ModelBlock name="model.detail.navbtn" el={this} />
        {canEdit?<Button onClick={onEdit} className="mr-2"><Icon name="pencil"/> {_t('Edit')}</Button>:null}
        <Button  onClick={onClose} variant="secondary">{_t('Back')}</Button>
      </Nav>
    ]
  }

  render() {
    const { params, title, model, componentClass } = this.props
    const DetailComponent = componentClass || Info
    const { _t } = app.context

    return (
      <Page title={title} className={`xadmin-model-detail-${model.key}`} nav={this.renderNav()}>
        <ModelBlock name="model.detail.before" el={this} />
        <DetailComponent id={params && params.id} />
        <ModelBlock name="model.detail.after" el={this} />
      </Page>
    )
  }

}

export {
  ModelListPage,
  ModelFormPage,
  ModelDetailPage
}

