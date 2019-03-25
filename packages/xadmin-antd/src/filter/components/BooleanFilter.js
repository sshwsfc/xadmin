import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { Switch } from 'antd'

export default class BooleanFilter extends React.Component {

  render() {
    const { input: { name, value, onChange, ...inputProps }, field } = this.props
    const { _t } = app.context

    return (
      <Switch checked={value} onChange={onChange}
        checkedChildren={field.boolLabel ? field.boolLabel[0] : _t('True')}
        unCheckedChildren={field.boolLabel ? field.boolLabel[1] : _t('False')}
      />
    )
  }

}
