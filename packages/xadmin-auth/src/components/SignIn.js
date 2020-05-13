import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserSignIn } from '../models'

const SignInForm = props => {
  const { onSignIn } = use('auth.login', props)
  return (
    <C is="Model.DataForm"
      onSubmit={onSignIn}
      component={C('Auth.Signin') || C('Auth.Form')}
    />
  )
}

export default props => <Model schema={UserSignIn(app)}><SignInForm {...props} /></Model>
