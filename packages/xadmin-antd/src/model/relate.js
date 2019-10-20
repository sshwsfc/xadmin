import React from 'react'
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { Button, Dropdown, Select, Menu, Spin, Empty } from 'antd'

import app, { use } from 'xadmin'
import { Icon } from 'xadmin-ui'

const Option = Select.Option

const AsyncSelect = props => {
  const { loadOptions, loading, options, value, isOptionSelected, label, onChange, style, ...extraProps } = use('model.relate.select', props)
  
  const data = React.useMemo(() => options.reduce((prev, opt) => {
    prev[opt.value] = { key: opt.value, ...opt }
    return prev
  }, {}), [ options ])

  const onItemChange = (selectOpt) => {
    onChange(_.isArray(selectOpt) ?
      selectOpt.map(({ key }) => data[key] || _.find(value, v => v.key == key) || null).filter(Boolean) :
      data[selectOpt.key])
  }

  const useOptions = React.useMemo(() => {
    let options = Object.values(data)
    if(extraProps.mode == 'multiple' && value) {
      const selected = value.map(v => v.key)
      options = options.filter(opt => selected.indexOf(opt.key) == -1)
    }
    return options
  }, [ data, extraProps.mode, value ])

  return (
    <Select
      showSearch
      labelInValue
      value={value ? value : ( isOptionSelected ? Object.values(data).filter(isOptionSelected) : undefined )}
      notFoundContent={loading ? <div style={{ margin: '2px', textAlign: 'center' }}><Spin size="small" /></div> : <Empty />}
      onSearch={loadOptions}
      onChange={onItemChange}
      filterOption={false}
      placeholder={label}
      style={{ minWidth: 150, ...style }}
      {...extraProps}
    >
      {useOptions.map(d => <Option key={d.key}>{d.label}</Option>)}
    </Select>
  )

}

const RelateSelect = props => {
  const { input: { value: item, onChange }, label, field } = props
  const displayField = field.displayField || 'name'
  return (
    <AsyncSelect 
      value={item ? { item, label: item[displayField], key: item.id } : null} 
      onChange={(option) => {
        onChange(option.item)
      }}
      field={field}
      label={label}
    />
  )
}

const RelateMultiSelect = props => {
  const { input: { value: items, onChange }, label, field } = props
  const displayField = field.displayField || 'name'
  return (
    <AsyncSelect mode="multiple"
      value={items ? items.map(item => ({ key: item.id, item, label: item[displayField] })) : null} 
      onChange={(options) => {
        onChange(options.map(opt => opt.item))
      }} 
      field={field}
      label={label}
    />
  )
}

const FilterRelateSelect = props => {
  const { input: { value: selectId, onChange }, label, field } = props

  return (
    <AsyncSelect 
      isOptionSelected={option => selectId && option.key == selectId}
      onChange={(option) => {
        onChange(option.value)
      }} 
      field={field}
      label={label}
    />
  )
}


const form_fields = {
  fkselect: {
    component: RelateSelect
  },
  multi_select: {
    component: RelateMultiSelect
  },
  filter_relate: {
    component: FilterRelateSelect,
    parse: (value, name) => {
      if(value && value.id) {
        return value.id
      }
      return value
    }
  }
}

const RelateContainer = ({ data, model, children }) => (
  <>
    <h4><Icon name={model.icon} /> {data[model.displayField || 'name']}</h4>
    {children}
  </>
)

const RelateAction = ({ model, item, actions, ...extraProps }) => (
  <Dropdown key="dropdown-action-relate" overlay={(
    <Menu>
      { actions.map((m, index) => 
        <Menu.Item key={index} onClick={()=>app.go(`/app/model/${model.name}/${item.id}/relations/${m.name}/`)}>{m.title || m.name}</Menu.Item>
      )}
    </Menu>
  )}>
    <Button size="small" className="model-list-action">{_t('Relates')}</Button>
  </Dropdown>
)

export default {
  components: {
    'Relate.Action': RelateAction,
    'Relate.Container': RelateContainer
  },
  form_fields
}
