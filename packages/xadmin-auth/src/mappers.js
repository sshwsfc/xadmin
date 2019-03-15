import _ from 'lodash'
import { SubmissionError } from 'xadmin-form'
import { UserSignIn, UserChangePassword } from './models'
import app from 'xadmin'

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
      },
      onChangePassword: () => () => {
        app.go('/app/change_password')
      }
    }
  },
  'auth.sign_in': {
    method: {
      onSignIn: ({ dispatch }, { location: { query } }) => (item) => {
        const { _t } = app.context
        return new Promise((resolve, reject) => {
          dispatch({ model: UserSignIn(app), type: 'SAVE_ITEM', item, promise: { resolve, reject }, 
            message: false })
        }).then(user => {
          dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: _.omit(user, 'password') })
          app.go(query && query.redirect || '/app/')
        }).catch(error => {
          dispatch({ type: '@@xadmin/AUTH_SIGN_IN_ERROR', error })
          throw new SubmissionError(error.json && error.json.non_field_errors == undefined ? error.json : { password: _t('Incorrect username or password') })
        })
      }
    },
    event: {
      mount: ({ dispatch }, { location: { query } }) => {
        const { _t } = app.context
        if(query.verifyEmail == 'success') {
          dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'success', headline: 'Success', message: _t('Verify email success, please login')
          } })
        }
      }
    }
  },
  'auth.sign_up': {
    method: {
      onSuccess: ({ dispatch }) => (resp) => {
        if(resp.key) {
          dispatch({ type: '@@xadmin/AUTH_VERIFY_EMAIL', payload: resp })
        } else if(resp.detail) {
          dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
            type: 'success', headline: 'Success', message: resp.detail
          } })
        }
        app.go('/login')
      }
    }
  },
  'auth.forget_password': {
    method: {
      onSuccess: () => (user) => {
        app.go('/login')
      }
    }
  },
  'auth.change_password': {
    method: {
      onChange: ({ dispatch }) => (item) => {
        const { _t } = app.context
        return new Promise((resolve, reject) => {
          dispatch({ model: UserChangePassword(app), type: 'SAVE_ITEM', item, promise: { resolve, reject }, 
            message: _t('Change password success') })
        }).then(user => {
          app.go('/app/')
        }).catch(error => {
          throw new SubmissionError({ old_password: _t('Incorrect old password') })
        })
      }
    }
  },
  'auth.reset_password': {
    method: {
      onSuccess: () => (user) => {
        app.go('/login')
      }
    }
  }
}
