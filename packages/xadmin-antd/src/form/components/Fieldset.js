import React from 'react'
import { Card } from 'antd'
import { objectBuilder } from 'xadmin-form'

export default ({ input, label, meta: { touched, error }, field, group, option }) => {
  return (
    <Card bodyStyle={{ paddingBottom: 10 }} type="inner">
      {objectBuilder(field.fields, field.render, { ...option, group })}
    </Card>
  )
}
