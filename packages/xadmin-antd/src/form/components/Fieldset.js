import React from 'react'
import { objectBuilder } from '../builder'

export default ({ input, label, meta: { touched, error }, field, group, option }) => {
  return (
    <>
      <h5>{label}</h5>
      {objectBuilder(field.fields, field.render, { ...option, group })}
    </>
  )
}
