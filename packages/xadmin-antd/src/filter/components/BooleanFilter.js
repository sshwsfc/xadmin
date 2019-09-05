import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { _t } from 'xadmin-i18n'
import { Switch, Checkbox, Tooltip } from 'antd'

export default props => {
  const { input: { name, value, onChange, ...inputProps }, field } = props
  const disabled = (value === null || value === undefined || value === '')

  return (<>
    <Tooltip title={_t('Use this filter')}>
      { disabled ? <Checkbox checked={false} onClick={()=>onChange(true)}/> : <Checkbox checked={true} onClick={()=>onChange(null)}/> }
    </Tooltip>{' '}
    <Switch checked={value} disabled={disabled} onChange={onChange}
      checkedChildren={field.boolLabel ? field.boolLabel[0] : _t('True')}
      unCheckedChildren={field.boolLabel ? field.boolLabel[1] : _t('False')}
    />
    </>
  )

}
