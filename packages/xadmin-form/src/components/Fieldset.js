import React from 'react'
import { Field } from 'redux-form'
import { Panel } from 'react-bootstrap'
import { objectBuilder } from '../builder'

export default ({ input, label, meta: { touched, error }, field, group, option }) => {
  return (
    <Panel>
      <Panel.Heading>
        <Panel.Title toggle componentClass="h3">{label}</Panel.Title>
      </Panel.Heading>
      <Panel.Body collapsible defaultExpanded>
        {objectBuilder(field.fields, field.render, { ...option, group })}
      </Panel.Body>
    </Panel>
  )
}
