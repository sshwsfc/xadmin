import React from 'react'
import _ from 'lodash'
import app, { api } from 'xadmin'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { RelateBase } from 'xadmin-model/lib/relate'
import AsyncSelect from 'react-select/lib/Async'

//@FormWrap('model.form.fkselect')
class RelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.item)
  }

  render() {
    const { _t } = app.context
    const { input: { value: item }, label, meta, field, group: FieldGroup } = this.props
    const displayField = field.displayField || 'name'
    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions 
          selectOption={item ? { item, label: item[displayField], value: item.id } : null} 
          onChange={this.onChange}
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
    )
  }
}

class RelateMultiSelect extends RelateBase {

  onChange = (options) => {
    this.props.input.onChange(options.map(opt => opt.item))
  }

  render() {
    const { _t } = app.context
    const { input: { value: items }, label, meta, field, group: FieldGroup } = this.props
    const displayField = field.displayField || 'name'
    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions isMulti closeMenuOnSelect={false}
          selectOption={items ? items.map(item => ({ value: item.id, item, label: item[displayField] })) : null} 
          onChange={this.onChange} 
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
    )
  }

}

class FilterRelateSelect extends RelateBase {

  onChange = (option) => {
    this.props.input.onChange(option.value)
  }

  render() {
    const { _t } = app.context
    const { input: { value: selectId }, label, meta, field, group: FieldGroup } = this.props

    return (
      <FieldGroup label={label} meta={meta} input={this.props.input} field={field}>
        <AsyncSelect cacheOptions defaultOptions 
          isOptionSelected={option => selectId && option.value == selectId}
          onChange={this.onChange} 
          loadOptions={this.loadOptions} 
        />
      </FieldGroup>
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
    const displayField = model.display_field || 'name'
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
      <DropdownButton
        title={_t('Relates')}
        variant={ 'primary' }
        key="dropdown-action-relate"
        size="sm"
        className="model-list-action"
      >
        { actions.map((m, index) => 
          (<Dropdown.Item eventKey={index} key={index} 
            onSelect={()=>app.go(`/app/model/${model.name}/${item.id}/relations/${m.name}/`)}>{m.title || m.name}</Dropdown.Item>)
        )}
      </DropdownButton>
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
