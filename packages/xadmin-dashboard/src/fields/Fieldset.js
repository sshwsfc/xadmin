import React from 'react'
import { Field } from 'redux-form'
import { Collapse } from 'antd'
import { objectBuilder } from 'xadmin/lib/form/builder'

export default class Fieldset extends React.Component {

  constructor(props) {
    super(props)
    const field = props.field
    this.state = {
      activeKey: field.schema.collapsed || field.collapsed ? [] : [ '1' ]
    }
  }

  onChange = (key) => {
    this.setState({ activeKey: key })
  }

  render() {
    const { input, label, meta: { touched, error }, field, group, option } = this.props
    return (
      <Collapse bordered={false} activeKey={this.state.activeKey} onChange={this.onChange}>
        <Collapse.Panel header={label} key="1">
          {objectBuilder(field.fields, field.render, { ...option, group })}
        </Collapse.Panel>
      </Collapse>
    )
  }
}
