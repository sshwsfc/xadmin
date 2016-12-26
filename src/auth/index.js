
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
  context: (app) => (context, cb) => {
    const { store } = context
    if(localStorage.user) {
      try {
        const user = JSON.parse(localStorage.user)
        store.dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: user })
      } catch(err) {
        localStorage.user = null
      }
    }
    let user = null
    store.subscribe(() => {
      const state = store.getState()
      if(state.user !== user) {
        if(state.user) {
          localStorage.user = JSON.stringify(state.user)
        } else {
          localStorage.user = null
        }
        user = state.user
      }
    })
    cb(null, context)
  },
  routers: {
    '/' : [ {
      path: 'login',
      component: SignInForm
    }, {
      path: 'signup',
      component: SignUpForm
    }, {
      path: 'forget_password',
      component: ForgetPasswordForm
    }, {
      path: 'password_reset_confirm',
      component: ResetPasswordForm
    } ]
  },
  models,
  effects,
  mappers,
  reducers
}
