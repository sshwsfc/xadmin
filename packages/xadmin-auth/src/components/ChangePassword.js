import React from 'react'
import { use, app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { Page, C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'

import { UserChangePassword } from '../models'

export default props => {
  const { onChange } = use('auth.change_password')
  return (
    <Page title={_t('Change Password')}>
      <SchemaForm
        schema={UserChangePassword(app)}
        onSubmit={onChange}
        submitText={_t('Change Password')}
        component={C('Auth.ChangePassword') || C('Auth.Form')}
      />
    </Page>
  )
}
