import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserResetPassword } from '../models'

export default props => {
  const { _t } = app.context
  const { onSuccess, location: { query } } = use('auth.reset_password', props)
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
}
