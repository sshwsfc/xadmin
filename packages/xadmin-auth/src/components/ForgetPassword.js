import React from 'react'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserForgetPassword } from '../models'

export default StoreWrap('auth.forget_password')(({ onSuccess }) => {
  const { _t } = app.context
  return (
    <Model schema={UserForgetPassword(app)}>
      <C is="Model.DataForm" 
        successMessage={_t('Send reset password email success')}
        onSubmitSuccess={onSuccess}
        component={C('Auth.ForgetPassword') || C('Auth.Form')}
      />
    </Model>
  )
})
