import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserSignUp } from '../models'

const SignUpForm = props => {
  const { onSuccess } = use('auth.sign_up', props)
  const { _t } = app.context
  return (
    <Model schema={UserSignUp(app)}>
      <C is="Model.DataForm"
        onSubmit={onSuccess}
        component={C('Auth.Signup') || C('Auth.Form')}
      />
    </Model>
  )
}

export default SignUpForm
