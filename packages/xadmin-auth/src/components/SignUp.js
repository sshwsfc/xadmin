import React from 'react'
import { use, app } from 'xadmin'
import { SchemaForm } from 'xadmin-form'
import { C } from 'xadmin-ui'

import { UserSignUp } from '../models'

const SignUpForm = props => {
  const { onSuccess } = use('auth.sign_up')
  return (
    <SchemaForm
      schema={UserSignUp(app)}
      onSubmit={onSuccess}
      component={C('Auth.Signup') || C('Auth.Form')}
    />
  )
}

export default SignUpForm
