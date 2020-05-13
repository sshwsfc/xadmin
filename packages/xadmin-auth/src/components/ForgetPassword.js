import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserForgetPassword } from '../models'

export default props => {
  const { _t } = app.context
  const { onSuccess } = use('auth.forget_password', props)
  return (
    <Model schema={UserForgetPassword(app)}>
      <C is="Model.DataForm" 
        successMessage={_t('Send reset password email success')}
        onSubmitSuccess={onSuccess}
        component={C('Auth.ForgetPassword') || C('Auth.Form')}
      />
    </Model>
  )
}
