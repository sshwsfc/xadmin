import { Button, Layout } from 'antd'
import React from 'react'
import _ from 'lodash'
import { use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { ModelBlock } from 'xadmin-model'
import { C, Icon, Page, Loading } from 'xadmin-ui'

const { Content, Sider } = Layout

const DefaultAddButton = ({ onAdd, children }) => (
  <Button type="primary" onClick={onAdd}>{children}</Button>
)

const ModelListPage = () => {
  const { model } = use('model')
  const { canAdd } = use('model.permission')
  const { onAdd } = use('model.event')
  const query = use('searchParams')

  const ItemsComponent = (model.components && model.components.DataList) || C('Model.DataTable')

  let icon = model.icon || model.name
  if(_.isString(icon)) {
    icon = <Icon name={icon}/>
  }
  const title = model.title

  const renderActions = () => {
    const AddButton = (model.components && model.components.AddButton) || C('Model.AddButton') || DefaultAddButton
    return (<>
      <ModelBlock name="model.list.navbtn" />
      { canAdd ?
        (<AddButton onAdd={onAdd}><Icon name="plus"/> {_t('Add {{object}}', { object: model.title })}</AddButton>) : null
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
      title={(<span>{icon} {title}</span>)} 
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

const ModelFormPage = () => {
  const { model } = use('model')
  const { id } = use('params')
  const { onSaved } = use('model.event')
  const { data, loading } = use('model.item', { id })
  const query = use('query')
  
  const title = id ? _t('Edit {{title}}', 
    { title: model.title + ' ' + (data && data[model.displayField || 'name'] || '') }) : _t('Create {{title}}', { title: model.title })
  const FormComponent = (model.components && model.components.DataForm) || C('Model.DataForm')

  return (
    <Page className={`xadmin-model-form-${model.key}`} 
      title={title} onBack={()=>history.back()}
      subTitle={<ModelBlock name="model.edit.nav" />}
      actions={<ModelBlock name="model.edit.navbtn" />}>
      <ModelBlock name="model.form.before" />
      { loading ? <Loading /> : <FormComponent id={id} item={data} query={query} onSubmitSuccess={onSaved} /> }
      <ModelBlock name="model.form.after" />
    </Page>
  )
}

const ModelDetailPage = () => {
  const { model } = use('model')
  const { id } = use('params')

  const renderActions = () => {
    const { canEdit } = use('model.permission')
    const { onEdit } = use('model.event')

    return (<>
      <ModelBlock name="model.detail.navbtn" />
      { canEdit ?
        (<Button type="primary" onClick={()=>onEdit(id)}><Icon name="edit"/> {_t('Edit')}</Button>) : null
      }
    </>)
  }

  const DetailComponent = (model.components && model.components.DataDetail) || C('Model.DataDetail')

  return (
    <Page className={`xadmin-model-detail-${model.key}`} 
      title={model.title} onBack={()=>history.back()}
      subTitle={<ModelBlock name="model.detail.nav" />}
      actions={renderActions()}>
      <ModelBlock name="model.detail.before" />
      <DetailComponent id={id} />
      <ModelBlock name="model.detail.after" />
    </Page>
  )
}

export { ModelListPage, ModelFormPage, ModelDetailPage }

