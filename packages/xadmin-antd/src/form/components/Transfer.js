import React from 'react'
import app from 'xadmin'
import { FormWrap } from 'xadmin-form'
import { Transfer, Spin } from 'antd'
import _ from 'lodash'

@FormWrap('model.form.relates2', {
  data: ({ state, form, formState }, { input: { value }, field }) => {
    const data = {}
    if(formState) {
      data['options'] = formState.relates ? _.get(formState.relates, field.name) : null
    }
    const key = `form.${form.formKey}.${field.name}.relates`
    if(state.loading[key]) {
      data['loading'] = true
    }
    return data
  },
  method: {
    getRelatedItems: ({ dispatch, form }, { field }) => () => {
      dispatch({ type: 'GET_RELATED_ITEMS', meta: { form: form.formKey, field, model: field.items.schema }, filter: { limit: 50, fields: [ 'id', 'name' ] } })
    }
  }
})
class RelateMultiTransfer extends React.Component {

  componentDidMount() {
    const { input, options, field } = this.props
    if(options == null) {
      this.props.getRelatedItems()
    }
  }

  onChange = (targetKeys) => {
    const { input: { value, onChange }, options } = this.props
    onChange(options.filter(option=>targetKeys.indexOf(option.id)>=0))
  }

  getDataSource() {
    const { input, options, field } = this.props
    const displayField = field.displayField || 'name'
    return options.map(option => ({
      label: option[displayField] || 'null',
      key: option.id,
      item: option
    }))
  }

  renderTransfer() {
    const { input, field } = this.props
    return (
      <Transfer
        dataSource={this.getDataSource()}
        showSearch
        listStyle={{
          width: 200,
          height: 300
        }}
        operations={[ '选择', '取消' ]}
        targetKeys={input.value ? input.value.map(item=>item.id) : []}
        onChange={this.onChange}
        render={item => item.label}
        searchPlaceholder="请输入搜索内容"
        notFoundContent="空"
        {...field.attrs}
      />
    )
  }

  render() {
    return this.props.options ? this.renderTransfer() : <Spin />
  }

}

export default RelateMultiTransfer
