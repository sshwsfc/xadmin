import React from 'react'
import hooks from './hooks'
import { C } from 'xadmin-ui'
import SignInForm from './components/SignIn'
import SignUpForm from './components/SignUp'
import ForgetPasswordForm from './components/ForgetPassword'
import ResetPasswordForm from './components/ResetPassword'
import ChangePasswordForm from './components/ChangePassword'
import models from './models'
import { UserRoot } from './context'
import {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
} from './wrap'

export default {
  name: 'xadmin.auth',
  config: {
    auth: {
      can_reset_password: true,
      can_change_password: true,
      can_signup: true,
      can_signin: true,
      persist_type: 'localforage'
    }
  },
  blocks: {
    'top.right': (props) => <C is="Auth.UserMenu" key="auth.user" {...props} />
  },
  components: {
    App: props => <IsAuthenticated><C is="BaseApp" {...props} /></IsAuthenticated>
  },
  root_component: (app) => (children) => (
    <UserRoot>{children}</UserRoot>
  ),
  routers: (app) => {
    const { auth } = app.load_dict('config')
    const routes = []
    if(auth.can_signin) {
      routes.push({
        path: 'login',
        component: SignInForm
      })
    }
    if(auth.can_signup) {
      routes.push({
        path: 'signup',
        component: SignUpForm
      })
    }
    if(auth.can_reset_password) {
      routes.push({
        path: 'forget_password',
        component: ForgetPasswordForm
      })
      routes.push({
        path: 'password_reset_confirm',
        component: ResetPasswordForm
      })
    }
    return { 
      '/' : routes,
      '/app/': {
        path: 'change_password',
        component: ChangePasswordForm
      }
    }
  },
  schema_converter: (f, schema) => {
    if (schema.type === 'string' && schema.fieldType == 'captcha') {
      f.type = 'captcha'
    }
    return f
  },
  models,
  hooks
}

export {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
}
