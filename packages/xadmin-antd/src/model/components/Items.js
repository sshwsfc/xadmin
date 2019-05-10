import React from 'react'
import _ from 'lodash'
import { getFieldProp } from 'xadmin-model/lib/utils'
import { app, Block, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { SchemaForm } from 'xadmin-form'
import { C, Loading } from 'xadmin-ui'
import { Table, Empty, Menu, Dropdown, Icon, Form, List, Card, Button, Popconfirm, Checkbox, Popover } from 'antd'

const ItemEditFormLayout = (props) => {
  const { children, pristine, invalid, handleSubmit, submitting } = props
  return (
    <Form onSubmit={handleSubmit}>
      {children}
      <Button style={{ marginTop: '-1rem' }} block type="submit" loading={submitting} disabled={pristine || invalid} size="small" onClick={handleSubmit}>{_t('Change')}</Button>
    </Form>
  )
}

const ItemEditForm = props => {
  const { item, field, schema, model, onClose, saveItem } = use('model.save', props)

  const formField = _.find(model.form || [], obj => obj && obj.key == field ) || { key: field }
  const required = (model.required || []).indexOf(field) >= 0 ? { required: [ field ] } : {}

  return (
    <SchemaForm formKey="ChangeDataForm" 
      initialValues={item}
      schema={{
        type: 'object',
        properties: {
          [field]: schema
        },
        form: [ formField ],
        ...required
      }}
      option={{ group : C('Form.InlineGroup') }}
      onSubmit={(values) => saveItem({ ...values, __partial__: true })}
      onSubmitSuccess={() => onClose()}
      component={ItemEditFormLayout}/>
  )
}

const Item = props => {
  const { item, value, field, schema, componentClass, wrap, editable } = use('model.list.item', props)
  const [ edit, setEdit ] = React.useState(false)

  const RawWrapComponent = wrap || 'span'
  const WrapComponent = editable ? RawWrapComponent : ({ children, ...props }) => {
    return (
      <Popover content={(<ItemEditForm item={item} field={field} schema={schema} onClose={()=>setEdit(false)} />)} 
        trigger="click" onVisibleChange={setEdit} visible={edit} placement="right" >
        <RawWrapComponent {...props} style={{ cursor: 'pointer' }}>{children}</RawWrapComponent>
      </Popover>
    )
  }

  if(item == undefined || item == null || value == undefined || value == null) {
    return <WrapComponent><span className="text-muted">{_t('Null')}</span></WrapComponent>
  }

  if(componentClass) {
    const ItemComponent = componentClass
    return <ItemComponent item={item} value={value} field={field} schema={schema} wrap={WrapComponent} />
  } else {
    return <WrapComponent>{value == undefined || value == null?<span className="text-muted">{_t('Null')}</span>:value}</WrapComponent>
  }
  
}

const Header = props => {
  const { title, order, showText, canOrder, changeOrder } = use('model.list.header', props)

  const renderOrder = () => {
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <Menu.Item onClick={e=>{ changeOrder('ASC') }} key="ASC"><Icon type="caret-up" /> {_t('Sort ASC')}</Menu.Item>,
        <Menu.Item onClick={e=>{ changeOrder('DESC') }} key="DESC"><Icon type="caret-down" /> {_t('Sort DESC')}</Menu.Item>
      ]
      if(order != '') {
        orderItems.push(<Menu.Item onClick={e=>{ changeOrder('') }}><Icon type="close" /> {_t('Clear order')}</Menu.Item>)
      }
    }
    return orderItems
  }
  const icon = {
    'ASC' : <Icon type="caret-up" />,
    'DESC' : <Icon type="caret-down" />
  }[order] || ''
  const items = [ ...renderOrder(), ...(Block('model.list.header.menu') || []) ]
  
  return (items.filter(item=>!_.isNil(item)).length>0) ? (
    <Dropdown overlay={(
      <Menu selectedKeys={[ order ]}>{React.Children.toArray(items)}</Menu>
    )} trigger={[ 'click' ]}>
      <a style={{ cursor: 'pointer' }}>{title} {icon}</a>
    </Dropdown>
  ) : ( showText === false ? null : <span>{title} {icon}</span>)

}

const useActions = props => {
  const { canEdit, canDelete } = use('model.permission', props)
  const { onEdit } = use('model.event', props)
  const { deletItem } = use('model.delete', props)

  let actions = (props.actions || []).map((Action, i) => <Action key={`extra-action-${i}`} {...props} />)
  if(canEdit) {
    actions.push(<Button key="action-edit" size="small" className="model-list-action" onClick={() => onEdit(props.id)}>{_t('Edit')}</Button>)
  }
  if(canDelete) {
    actions.push((
      <Popconfirm key="action-delete" title={_t('Comfirm Delete') + '?'} onConfirm={()=>deletItem()} okText={_t('Delete')} cancelText={_t('Cancel')}>
        <Button key="action-delete" size="small" className="model-list-action" type="danger">{_t('Delete')}</Button>
      </Popconfirm>
    ))
  }
  return <Button.Group size="small" className="model-list-action">{actions}</Button.Group>
}

const useList = render => props => {
  const state = use('model.list', use('model', props))
  const { loading, items } = state
  const list = render(state)

  if(loading) {
    return <Loading>{items.length > 0 ? list : null}</Loading>
  } else {
    return items.length > 0 ? list : <Card><Empty style={{ marginBottom: '.5rem' }}>{_t('No Data')}</Empty></Card>
  }
}

const DataTableActionRender = props => {
  return <div style={{ width: '100%', textAlign: 'center' }}>{useActions(use('model.list.row', props))}</div>
}

const DataTable = useList(({ model, items, fields, size, onRow }) => {
  const { selected, onSelect, onSelectAll } = use('model.select')

  const lockedFields = model.lockedFields || []
  const columns = []

  fields.forEach((fieldName)=> {
    const field = getFieldProp(model, fieldName)
    const column = {
      field,
      width: field.width || undefined,
      fixed: lockedFields.indexOf(fieldName) >= 0,
      title: <Header key={`model-list-header-${fieldName}`} field={fieldName} />,
      key: fieldName,
      dataIndex: fieldName,
      render: (value, item) => {
        return <Item item={item} field={fieldName} />
      }
    }
    if(field.level2) {
      if(columns.length > 0 &&
        columns[columns.length - 1].children !== undefined &&
        columns[columns.length - 1].title == field.level2 ) {
        columns[columns.length - 1].children.push(column)
      } else {
        columns.push({
          title: field.level2,
          children: [ column ]
        })
      }
    } else {
      columns.push(column)
    }
  })

  columns.push({
    title: _t('Actions'),
    key: '__action__',
    render: (val, item) => <DataTableActionRender key={item.id} fields={fields} id={item.id} />
  })

  const rowSelection = {
    selectedRowKeys: selected.map(r => r.id),
    onSelect, onSelectAll
  }

  return (
    <Table
      columns={columns}
      dataSource={items}
      bordered
      size={size}
      rowSelection={rowSelection}
      pagination={false}
      onRow={onRow}
      rowKey="id"
      //scroll={{ y: Math.min(730, (items.length + 1) * 40 + 36) }}
    />
  )
})

const DataListRender = props => {
  const { item, fields, selected, actions } = use('model.list.row', props)

  return (
    <List.Item actions={[ useActions({ actions, ...props }) ]}>
      <List.Item.Meta
        title={<Item item={item} field={fields[0]} value={item[fields[0]]} selected={selected} />}
        description={<Item item={item} field={fields[1]} value={item[fields[1]]} selected={selected} />}
      />
      {React.Children.toArray(fields.slice(2).map(field=>{
        return (
          <Item item={item} field={field} value={item[field]} selected={selected} wrap={
            ({ children, ...props })=><div key={`item-${item.id}-${field}`} {...props}>{children}</div>
          } />
        )
      }))}
    </List.Item>
  )
}

const DataList = useList(({ model, items, fields, size }) => {
  const RenderItem = (model.components && model.components.DataListRender) || C('Model.DataListRender') || DataListRender
  return (
    <Card>
      <List
        itemLayout="vertical"
        dataSource={items}
        size={size}
        renderItem={item => <RenderItem key={item.id} fields={fields} id={item.id} />}
      />
    </Card>
  )
})
 
const DataCard = DataTable

export default DataTable
export {
  Item, Header, DataTable, DataList, DataCard
}
