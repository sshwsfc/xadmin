import React from 'react'
import localforage from 'localforage'
import Cookies from 'js-cookie'
import mappers from './mappers'
import hooks from './hooks'
import { App as BaseApp, C } from 'xadmin-ui'
import SignInForm from './components/SignIn'
import SignUpForm from './components/SignUp'
import ForgetPasswordForm from './components/ForgetPassword'
import ResetPasswordForm from './components/ResetPassword'
import ChangePasswordForm from './components/ChangePassword'
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
    App: IsAuthenticated(BaseApp)
  },
  context: (app) => (context, cb) => {
    const { store } = context
    const { auth } = app.load_dict('config')

    let user = null
    store.subscribe(() => {
      const state = store.getState()
      if(state.user !== user) {
        if(auth.persist_type == 'localforage') {
          if(state.user) {
            localforage.setItem('user', JSON.stringify(state.user))
          } else {
            localforage.removeItem('user')
          }
        } else if(auth.persist_type == 'session-storage') {
          if(state.user) {
            sessionStorage.setItem('user', JSON.stringify(state.user))
          } else {
            sessionStorage.removeItem('user')
          }
        } else if(auth.persist_type == 'cookie') {
          if(state.user) {
            Cookies.set('user', state.user, auth.userinfo_timeout ? { expires: auth.userinfo_timeout } : {})
          } else {
            Cookies.remove('user')
          }
        }
        user = state.user
      }
    })

    if(auth.persist_type == 'localforage') {
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
    } else if(auth.persist_type == 'session-storage') {
      const value = sessionStorage.getItem('user')
      if(value) {
        const user = JSON.parse(value)
        store.dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: user })
      }
      cb(null, context)
    }  else if(auth.persist_type == 'cookie') {
      const user = Cookies.getJSON('user')
      if(user) {
        store.dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: user })
      }
      cb(null, context)
    } else {
      cb(null, context)
    }
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
  schema_converter: (f, schema) => {
    if (schema.type === 'string' && schema.fieldType == 'captcha') {
      f.type = 'captcha'
    }
    return f
  },
  models,
  effects,
  mappers,
  hooks,
  reducers
}

export {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
}
