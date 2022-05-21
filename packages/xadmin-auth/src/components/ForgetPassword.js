import React from 'react'
import { use, app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'
import { _t } from 'xadmin-i18n'

import { UserForgetPassword } from '../models'

export default props => {
  const { onSuccess } = use('auth.forget_password')
  return (
    <SchemaForm
      schema={UserForgetPassword(app)}
      successMessage={_t('Send reset password email success')}
      onSubmitSuccess={onSuccess}
      component={C('Auth.ForgetPassword') || C('Auth.Form')}
    />
  )
}
