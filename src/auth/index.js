
import localforage from 'localforage'
import mappers from './mappers'
import SignInForm from './components/SignIn'
import SignUpForm from './components/SignUp'
import ForgetPasswordForm from './components/ForgetPassword'
import ResetPasswordForm from './components/ResetPasswordForm'
import reducers from './reducer'
import models from './models'
import effects from './effects'

import './auth.css'

export default {
  name: 'xadmin.auth',
  config: {
    auth: {
      can_reset_password: true,
      can_change_password: true,
      can_signup: true
    }
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
    const routes = [ {
      path: 'login',
      component: SignInForm
    } ]
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
    return { '/' : routes }
  },
  models,
  effects,
  mappers,
  reducers
}
