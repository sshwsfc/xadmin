import React from 'react'
import { Field } from 'redux-form'
import { Panel } from 'react-bootstrap'
import { objectBuilder } from '../builder'

export default ({ input, label, meta: { touched, error }, field, group, option }) => {
  return (
    <Panel collapsible defaultExpanded header={<h3>{label}</h3>}>
      {objectBuilder(field.fields, field.render, { ...option, group })}
    </Panel>
  )
}
