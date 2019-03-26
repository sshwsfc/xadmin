import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Button, Card } from 'antd'

import { app } from 'xadmin'
import { C, Page, Icon } from 'xadmin-ui'
import { ModelWrap, ModelBlock } from 'xadmin-model'

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
    const ItemsComponent = (model.components && model.components.DataTable) || C('Model.DataTable')
    const query = location && location.query

    const GridComponents = [
      <div key="model-list-subnav" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
        <C is="Model.Pagination" />
        <C is="Model.ListSubMenu" />
      </div>,
      <ItemsComponent key="model-list-grid" query={query} />,
      <div key="model-list-downnav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem' }}>
        {/* <ActionBar key="model-list-action" /> */}
        <C is="Model.Pagination" />
      </div>
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
                <Layout>
                  { sideMenu ? <Sider width={200} style={{ backgroundColor: 'transparent', marginRight: '.5rem' }}><Card>{ sideMenu }</Card></Sider> : null }
                  <Content>{GridComponents}</Content>
                  { sidePanel ? <Sider width={200} style={{ backgroundColor: 'transparent', marginLeft: '.5rem' }}><Card>{ sidePanel }<Card></Card></Card></Sider> : null  }
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

  render() {
    const { params, location: { query }, title, model, onSuccess } = this.props
    const FormComponent = (model.components && model.components.DataForm) || C('Model.DataForm')
    return (
      <Page className={`xadmin-model-form-${model.key}`} 
        title={title} 
        content={<ModelBlock name="model.edit.nav" />}
        actions={<ModelBlock name="model.edit.navbtn" />}>
        <ModelBlock name="model.form.before" />
        <FormComponent id={params && params.id} query={query} onSubmitSuccess={onSuccess} />
        <ModelBlock name="model.form.after" />
      </Page>
    )
  }

}

@ModelWrap('model.page.detail')
class ModelDetailPage extends React.Component {

  renderActions() {
    const { onClose, onEdit, canEdit } = this.props
    const { _t } = app.context
    return (<>
      <ModelBlock name="model.detail.navbtn" />
      { canEdit ?
        (<Button type="primary" onClick={onEdit}><Icon name="edit"/> {_t('Edit')}</Button>) : null
      }
    </>)
  }

  renderPageContent() {
    return (
      <ModelBlock name="model.detail.nav" />
    )
  }

  render() {
    const { params, title, model } = this.props
    const DetailComponent = (model.components && model.components.DataDetail) || C('Model.DataDetail')

    return (
      <Page className={`xadmin-model-detail-${model.key}`} 
        title={title}
        content={this.renderPageContent()}
        actions={this.renderActions()}>
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

