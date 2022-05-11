import React from 'react'
import { useLocation } from 'react-router-dom'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserResetPassword } from '../models'

export default props => {
  const { _t } = app.context
  const { onSuccess } = use('auth.reset_password', props)
  const { query } = useLocation()

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
