import React from 'react'
import { Icon } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'

export default ({ value, schema }) => {
  return value ? 
    <div style={{ width: '100%' }}><Icon name="check-circle" style={{ color: 'green' }} /><span style={{ display: 'none' }}>{schema.trueText || _t('Yes')}</span></div> : 
    <div style={{ width: '100%' }}><Icon name="close-circle" /><span style={{ display: 'none' }}>{schema.falseText || _t('No')}</span></div>
}
