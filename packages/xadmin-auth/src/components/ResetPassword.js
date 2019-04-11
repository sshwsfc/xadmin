import React from 'react'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserResetPassword } from '../models'

export default StoreWrap('auth.reset_password')(({ onSuccess, location: { query } }) => {
  const { _t } = app.context
  return (
    <Model schema={UserResetPassword(app)}>
      <C is="Model.DataForm" 
        initialValues={query}
        successMessage={_t('Reset password success')}
        onSubmitSuccess={onSuccess}
        component={C('Auth.ResetPassword') || C('Auth.Form')}
      />
    </Model>
  )
})
