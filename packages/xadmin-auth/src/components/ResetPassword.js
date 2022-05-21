import React from 'react'
import { use, app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'

import { UserResetPassword } from '../models'

export default props => {
  const { onSuccess } = use('auth.reset_password')
  const query = use('query')

  return (
    <SchemaForm
      schema={UserResetPassword(app)}
      initialValues={query}
      successMessage={_t('Reset password success')}
      onSubmitSuccess={onSuccess}
      component={C('Auth.ResetPassword') || C('Auth.Form')}
    />
  )
}
