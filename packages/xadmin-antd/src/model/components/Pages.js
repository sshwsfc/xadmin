import { Button, Layout } from 'antd'
import React from 'react'
import { use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { ModelBlock } from 'xadmin-model'
import { C, Icon, Page } from 'xadmin-ui'

const { Content, Sider } = Layout

const ModelListPage = ({ location }) => {
  const { model } = use('model')
  const { canAdd } = use('model.permission')
  const { onAdd } = use('model.event')

  const ItemsComponent = (model.components && model.components.DataList) || C('Model.DataTable')
  const query = location && location.query

  const icon = model.icon || model.name
  const title = model.title

  const renderActions = () => {
    return (<>
      <ModelBlock name="model.list.navbtn" />
      { canAdd ?
        (<Button type="primary" onClick={onAdd}><Icon name="plus"/> {_t('Add {{object}}', { object: model.title })}</Button>) : null
      }
    </>)
  }

  const GridComponents = [
    <div key="model-list-subnav" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
      <C is="Model.Pagination" />
      <C is="Model.ListSubMenu" />
    </div>,
    <ItemsComponent key="model-list-grid" query={query} />,
    <div key="model-list-downnav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '.5rem' }}>
      <C is="Model.ActionBar" />
      <C is="Model.Pagination" />
    </div>
  ]
  
  return (
    <Page className={`xadmin-model-list-${model.key}`} 
      title={(<span><Icon name={icon}/> {title}</span>)} 
      subTitle={<ModelBlock name="model.list.nav" />}
      actions={renderActions()}>
      <ModelBlock name="model.list.submenu" />
      <ModelBlock name="model.list.sidemenu" >
        { sideMenu => (
          <ModelBlock name="model.list.sidepanel" >
            { sidePanel => (sideMenu || sidePanel) ? (
              <Layout>
                { sideMenu ? <Sider width={200} style={{ backgroundColor: 'transparent', marginRight: '.5rem' }}>{ sideMenu }</Sider> : null }
                <Content>{GridComponents}</Content>
                { sidePanel ? <Sider width={200} style={{ backgroundColor: 'transparent', marginLeft: '.5rem' }}>{ sidePanel }</Sider> : null  }
              </Layout>
            ) : GridComponents }
          </ModelBlock>
        ) }
      </ModelBlock>
    </Page>
  )
}

const ModelFormPage = ({ params, location: { query } }) => {
  const { model } = use('model')
  const { onSave } = use('model.event')

  const title = params && params.id ? _t('Edit {{title}}', { title: model.title }) : _t('Create {{title}}', { title: model.title })
  const FormComponent = (model.components && model.components.DataForm) || C('Model.DataForm')

  return (
    <Page className={`xadmin-model-form-${model.key}`} 
      title={title} 
      subTitle={<ModelBlock name="model.edit.nav" />}
      actions={<ModelBlock name="model.edit.navbtn" />}>
      <ModelBlock name="model.form.before" />
      <FormComponent id={params && params.id} query={query} onSubmitSuccess={onSave} />
      <ModelBlock name="model.form.after" />
    </Page>
  )
}

const ModelDetailPage = ({ params }) => {
  const { model } = use('model')

  const renderActions = () => {
    const { canEdit } = use('model.permission')
    const { onEdit } = use('model.event')

    return (<>
      <ModelBlock name="model.detail.navbtn" />
      { canEdit ?
        (<Button type="primary" onClick={()=>onEdit(params && params.id)}><Icon name="edit"/> {_t('Edit')}</Button>) : null
      }
    </>)
  }

  const DetailComponent = (model.components && model.components.DataDetail) || C('Model.DataDetail')

  return (
    <Page className={`xadmin-model-detail-${model.key}`} 
      title={model.title}
      subTitle={<ModelBlock name="model.detail.nav" />}
      actions={renderActions()}>
      <ModelBlock name="model.detail.before" />
      <DetailComponent id={params && params.id} />
      <ModelBlock name="model.detail.after" />
    </Page>
  )
}

export { ModelListPage, ModelFormPage, ModelDetailPage }

