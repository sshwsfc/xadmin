import React from 'react'
import { Card } from 'react-bootstrap'
import { objectBuilder } from '../builder'

export default ({ input, label, meta: { touched, error }, field, group, option }) => {
  return (
    <Card className="mb-3">
      <Card.Header>{label}</Card.Header>
      <Card.Body>
        {objectBuilder(field.fields, field.render, { ...option, group })}
      </Card.Body>
    </Card>
  )
}
