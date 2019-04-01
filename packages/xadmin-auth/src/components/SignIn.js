import React from 'react'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserSignIn } from '../models'

const SignInForm = StoreWrap('auth.sign_in')(({ onSignIn }) => {
  return (
    <Model schema={UserSignIn(app)}>
      <C is="Model.DataForm"
        onSubmit={onSignIn}
        component={C('Auth.Signin')}
      />
    </Model>
  )
})

export default SignInForm
