import React from 'react'
import localforage from 'localforage'
import mappers from './mappers'
import { App as BaseApp } from 'xadmin-layout'
import SignInForm from './components/SignIn'
import SignUpForm from './components/SignUp'
import ForgetPasswordForm from './components/ForgetPassword'
import ResetPasswordForm from './components/ResetPasswordForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import UserMenu from './components/UserMenu'
import reducers from './reducer'
import models from './models'
import effects from './effects'
import {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
} from './wrap'

import './auth.css'

@IsAuthenticated
class App extends BaseApp { }

export default {
  name: 'xadmin.auth',
  config: {
    auth: {
      can_reset_password: true,
      can_change_password: true,
      can_signup: true,
      can_signin: true
    }
  },
  blocks: {
    'top.right': () => <UserMenu />
  },
  components: {
    App
  },
  context: (app) => (context, cb) => {
    const { store } = context

    let user = null
    store.subscribe(() => {
      const state = store.getState()
      if(state.user !== user) {
        if(state.user) {
          localforage.setItem('user', JSON.stringify(state.user))
        } else {
          localforage.removeItem('user')
        }
        user = state.user
      }
    })

    localforage.getItem('user', function (err, value) {
      if(err == null && value) {
        try {
          const user = JSON.parse(value)
          store.dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: user })
        } catch(err) {
          localforage.removeItem('user')
        }
      }
      cb(null, context)
    })

  },
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
  models,
  effects,
  mappers,
  reducers
}

export {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
}
