import React from 'react'
import _ from 'lodash'
import { ModelWrap, Model } from 'xadmin-model'
import { getFieldProp } from 'xadmin-model/lib/utils'
import { app, Block } from 'xadmin'
import { C, Loading } from 'xadmin-ui'
import { Table, Empty, Menu, Dropdown, Icon, List, Card, Button, Popconfirm } from 'antd'

class BaseRow extends React.Component {

  actions() {
    const { canEdit, canDelete } = this.props
    const { _t } = app.context
    let actions = (this.props.actions || []).map(Action => <Action {...this.props} />)
    if(canEdit) {
      actions.push(<Button key="action-edit" size="small" className="model-list-action" onClick={this.props.editItem}>{_t('Edit')}</Button>)
    }
    if(canDelete) {
      actions.push((
        <Popconfirm title="Are you sure delete this task?" onConfirm={this.props.deleteItem} okText={_t('Delete')} cancelText={_t('Cancel')}>
          <Button size="small" className="model-list-action" type="danger">{_t('Delete')}</Button>
        </Popconfirm>
      ))
    }
    return <div className="model-list-action">{actions}</div>
  }

  render() {
    const { is, actions, ...extProps } = this.props
    if(is != undefined) {
      const newActions = this.actions()
      const RowComponent = is
      return <RowComponent actions={newActions} {...extProps} />
    } else {
      return this.renderRow()
    }
  }

}

@ModelWrap('model.list.item')
class Item extends React.Component {

  state = { over: false }

  render() {
    const { item, value, field, schema, componentClass, wrap, nest, model: { editable_fields } } = this.props
    const { _t } = app.context
    const WrapComponent = wrap || (({ children }) => <span>{children}</span>)

    if(componentClass) {
      const ItemComponent = componentClass
      return <ItemComponent item={item} value={value} field={field} schema={schema} wrap={WrapComponent} />
    } else {
      return <WrapComponent>{value == undefined || value == null?<span className="text-muted">{_t('Null')}</span>:value}</WrapComponent>
    }
  }

}

@ModelWrap('model.list.header')
class Header extends React.Component {

  renderOrder() {
    const { field, order, canOrder } = this.props
    const { _t } = app.context
    let orderItems = []

    if(canOrder) {
      orderItems = [
        <Menu.Item onClick={e=>{ this.props.changeOrder('ASC') }} key="ASC"><Icon type="caret-up" /> {_t('Sort ASC')}</Menu.Item>,
        <Menu.Item onClick={e=>{ this.props.changeOrder('DESC') }} key="DESC"><Icon type="caret-down" /> {_t('Sort DESC')}</Menu.Item>
      ]
      if(order != '') {
        orderItems.push(<Menu.Item onClick={e=>{ this.props.changeOrder('') }}><Icon type="close" /> {_t('Clear order')}</Menu.Item>)
      }
    }
    return orderItems
  }

  render() {
    const { title, order, showText } = this.props
      , icon = {
        'ASC' : <Icon type="caret-up" />,
        'DESC' : <Icon type="caret-down" />
      }[order] || ''
    const items = [ ...this.renderOrder(), ...(Block('model.list.header.menu', this) || []) ]
    return (items.filter(item=>!_.isNil(item)).length>0) ? (
      <Dropdown overlay={(
        <Menu selectedKeys={[ order ]}>{React.Children.toArray(items)}</Menu>
      )} trigger={[ 'click' ]}>
        <a style={{ cursor: 'pointer' }}>{title} {icon}</a>
      </Dropdown>
    ) : ( showText === false ? null : <span>{title} {icon}</span>)
  }

}

class BaseData extends React.Component {

  render() {
    if(this.props.loading) {
      return <Loading>{this.renderData()}</Loading>
    } else {
      return this.renderData()
    }
  }

}

@ModelWrap('model.items')
class DataTable extends BaseData {

  renderData() {
    const { fields, items, model, loading, avageWidth=8 ,size, onRow } = this.props
    const { _t } = app.context

    if(items.length > 0) {

      const lockedFields = model.locked_fields || []
      const columns = []

      fields.forEach((fieldName, index)=> {
        const field = getFieldProp(model, fieldName)
        const column = {
          field,
          width: field.width || 100,
          fixed: lockedFields.indexOf(fieldName) >= 0,
          //title: field.header || field.title || field.name,
          title: <Header key={`model-list-header-${fieldName}`} field={fieldName} />,
          key: fieldName,
          dataIndex: fieldName,
          render: (value, item) => {
            return <Item value={value} item={item} field={fieldName} />
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

      return (
        <div style={{ marginBottom: 20, backgroundColor: '#FFF' }}>
          <Table
            columns={columns}
            dataSource={items}
            bordered
            size={size}
            pagination={false}
            onRow={onRow}
            //scroll={{ y: Math.min(730, (items.length + 1) * 40 + 36) }}
          />
        </div>)
    } else {
      return (<Empty style={{ marginBottom: '.5rem' }}>{_t('No Data')}</Empty>)
    }
  }

}

@ModelWrap('model.list.row')
class DataListRender extends BaseRow {

  render() {
    const { item, fields, selected } = this.props
    
    return (
      <List.Item actions={[ this.actions() ]}>
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

}

@ModelWrap('model.items')
class DataList extends BaseData {

  renderData() {
    const { fields, loading, items, model, size } = this.props
    const { _t } = app.context

    if(items.length > 0) {
      const RenderItem = (model.components && model.components.listRenderItem) || C('Model.DataListRender') || DataListRender
      return (
        <Card style={{ marginBottom: '.5rem' }}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={items}
            size={size}
            renderItem={item => <RenderItem key={item.id} fields={fields} id={item.id} />}
          />
        </Card>)
    } else {
      return (<Empty style={{ marginBottom: '.5rem' }}>{_t('No Data')}</Empty>)
    }
  }

}

@ModelWrap('model.items')
class DataCard extends React.Component {

  render() {
    const { fields, items, model, loading, avageWidth=8 ,size, onRow } = this.props
    const { _t } = app.context
    if(loading && (items== null ||items.length == 0)) {
      return <Loading />
    } else {
      if(items.length > 0) {

        const lockedFields = model.locked_fields || []
        const columns = []

        fields.forEach((fieldName, index)=> {
          const field = getFieldProp(model, fieldName)
          const column = {
            field,
            width: field.width || 100,
            fixed: lockedFields.indexOf(fieldName) >= 0,
            //title: field.header || field.title || field.name,
            title: <Header key={`model-list-header-${fieldName}`} field={fieldName} />,
            key: fieldName,
            dataIndex: fieldName,
            render: (value, item) => {
              return <Item value={value} item={item} field={fieldName} />
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

        return (
          <div style={{ marginBottom: 20, backgroundColor: '#FFF' }}>
            <Table
              columns={columns}
              dataSource={items}
              bordered
              size={size}
              pagination={false}
              onRow={onRow}
              //scroll={{ y: Math.min(730, (items.length + 1) * 40 + 36) }}
            />
          </div>)
      } else {
        return (<Empty>{_t('No Data')}</Empty>)
      }
    }
  }

}

export default DataTable
export {
  Item, Header, DataTable, DataList, DataCard
}
