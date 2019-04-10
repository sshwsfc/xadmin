import React from 'react'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserSignUp } from '../models'

const SignUpForm = StoreWrap('auth.sign_up')(({ onSuccess }) => {
  const { _t } = app.context
  return (
    <Model schema={UserSignUp(app)}>
      <C is="Model.DataForm"
        onSubmit={onSuccess}
        component={C('Auth.Signup') || C('Auth.Form')}
      />
    </Model>
  )
})

export default SignUpForm
