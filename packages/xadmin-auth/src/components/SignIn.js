import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'

import { UserSignIn } from '../models'

const SignInForm = props => {
  const { onSignIn } = use('auth.login')
  return (
    <SchemaForm
      schema={UserSignIn(app)}
      onSubmit={onSignIn}
      component={C('Auth.Signin') || C('Auth.Form')}
    />
  )
}

export default SignInForm
