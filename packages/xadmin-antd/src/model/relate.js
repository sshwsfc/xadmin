import React from 'react'
import _ from 'lodash'
import { Button, Dropdown, Select, Menu, Spin } from 'antd'

import app, { api } from 'xadmin'
import { Loading, Icon } from 'xadmin-ui'
import { RelateBase } from 'xadmin-model/lib/relate'

const Option = Select.Option

class AsyncSelect extends React.Component {

  state = {
    data: {},
    fetching: false
  }

  fetchOptions = (value) => {
    this.setState({ data: [], fetching: true }, () => 
      this.props.loadOptions(value)
        .then(options => {
          this.setState({ data: options.reduce((prev, opt) => {
            prev[opt.value] = { key: opt.value, ...opt }
            return prev
          }, {}), fetching: false })
        })
    )
  }

  onChange = (value) => {
    const data = this.state.data
    this.props.onChange(_.isArray(value) ? value.map(({ key }) => data[key]) : data[value.key])
  }

  componentDidMount() {
    this.fetchOptions('')
  }
 
  render() {
    const { value, isOptionSelected, onChange, loadOptions, style, ...extraProps } = this.props
    const { fetching, data } = this.state
    let options = Object.values(data)
    if(extraProps.mode == 'multiple' && value) {
      const selected = value.map(v => v.key)
      options = options.filter(opt => selected.indexOf(opt.key) == -1)
    }
    return (
      <Select
        showSearch
        labelInValue
        value={value ? value : ( isOptionSelected ? Object.values(data).filter(isOptionSelected) : undefined )}
        notFoundContent={fetching ? <div style={{ margin: '2px', textAlign: 'center' }}><Spin size="small" /></div> : null}
        onSearch={this.fetchOptions}
        onChange={this.onChange}
        filterOption={false}
        style={style}
        {...extraProps}
      >
        {options.map(d => <Option key={d.key}>{d.label}</Option>)}
      </Select>
    )
  }

}

class RelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.item)
  }

  render() {
    const { _t } = app.context
    const { input: { value: item }, field } = this.props
    const displayField = field.displayField || 'name'
    return (
      <AsyncSelect 
        value={item ? { item, label: item[displayField], key: item.id } : null} 
        onChange={this.onChange}
        loadOptions={this.loadOptions} 
      />
    )
  }
}

class RelateMultiSelect extends RelateBase {

  onChange = (options) => {
    this.props.input.onChange(options.map(opt => opt.item))
  }

  render() {
    const { _t } = app.context
    const { input: { value: items }, field } = this.props
    const displayField = field.displayField || 'name'
    return (
      <AsyncSelect mode="multiple"
        value={items ? items.map(item => ({ key: item.id, item, label: item[displayField] })) : null} 
        onChange={this.onChange} 
        loadOptions={this.loadOptions} 
      />
    )
  }

}

class FilterRelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.value)
  }

  render() {
    const { _t } = app.context
    const { input: { value: selectId } } = this.props

    return (
      <AsyncSelect 
        isOptionSelected={option => selectId && option.key == selectId}
        onChange={this.onChange} 
        loadOptions={this.loadOptions} 
      />
    )
  }
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

class RelateContainer extends React.Component {

  render() {
    const { data, model, children } = this.props
    const displayField = model.displayField || 'name'
    return  (
      <>
        <h4><Icon name={model.icon} /> {data[displayField]}</h4>
        {children}
      </>
    )
  }

}

class RelateAction extends React.Component {

  render() {
    const { model, item, actions, ...extraProps } = this.props
    const { _t } = app.context

    return (
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
  }
}

export default {
  components: {
    'Relate.Action': RelateAction,
    'Relate.Container': RelateContainer
  },
  form_fields
}
