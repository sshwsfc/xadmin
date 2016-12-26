import _ from 'lodash'
import { SubmissionError } from 'redux-form'
import { UserSignIn } from './models'
import { app } from '../index'

export default {
  'auth.user': {
    data: ({ state }) => {
      return {
        user: state.user
      }
    },
    method: {
      onLogout: ({ dispatch }) => () => {
        dispatch({ type: '@@xadmin/AUTH_SIGN_OUT' })
      }
    }
  },
  'auth.sign_in': {
    method: {
      onSignIn: ({ dispatch, router }, { location: { query } }) => (item) => {
        return new Promise((resolve, reject) => {
          dispatch({ model: UserSignIn(app), type: 'SAVE_ITEM', item, promise: { resolve, reject } })
        }).then(user => {
          dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: _.omit(user, 'password') })
          router.push(query && query.redirect || '/app/')
        }).catch(error => {
          console.log(error)
          const { _t } = app.context
          throw new SubmissionError({ password: _t('Incorrect username or password') })
        })
      }
    }
  },
  'auth.sign_up': {
    method: {
      onSuccess: ({ dispatch, router }) => (user) => {
        const { _t } = app.context
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: _t('Register success.')
        } })
        dispatch({ type: '@@xadmin/AUTH_VERIFY_EMAIL', payload: user })
        router.push('/login')
      }
    }
  },
  'auth.forget_password': {
    method: {
      onSuccess: ({ dispatch, router }) => (user) => {
        const { _t } = app.context
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: _t('Send reset password email success.')
        } })
        router.push('/login')
      }
    }
  },
  'auth.reset_password': {
    method: {
      onSuccess: ({ dispatch, router }) => (user) => {
        const { _t } = app.context
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: _t('Reset password success.')
        } })
        router.push('/login')
      }
    }
  }
}
