import _ from 'lodash'
import React from 'react'
import { app, use } from 'xadmin'

export default {
  'auth.user': props => {
    const { dispatch, user } = use('redux', state => ({ user: state.user }))
    const onLogout = () => {
      dispatch({ type: '@@xadmin/AUTH_SIGN_OUT' })
    }
    const onChangePassword = () => {
      app.go('/app/change_password')
    }
    return { ...props, user, onLogout, onChangePassword }
  },
  'auth.login': props => {
    const location = use('location')
    const query = use('query')
    const navigate = use('navigate')

    const { dispatch } = use('redux')
    const { saveItem } = use('model.save', { successMessage: false })
    const { _t } = app.context

    const onSignIn = item => {
      const { _t } = app.context
      return saveItem(item).then(user => {
        dispatch({ type: '@@xadmin/AUTH_SIGN_IN', payload: _.omit(user, 'password') })
        navigate(location.state?.from?.pathname || '/app/', { replace: true })
      }).catch(error => {
        dispatch({ type: '@@xadmin/AUTH_SIGN_IN_ERROR', error })
        throw new Error(error.json && error.json.non_field_errors == undefined ? error.json : { password: _t('Incorrect username or password') })
      })
    }

    React.useEffect(() => {
      if(query.verifyEmail == 'success') {
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: _t('Verify email success, please login')
        } })
      }
    }, [])

    return { ...props, onSignIn }
  },
  'auth.sign_up': props => {
    const { dispatch } = use('redux')
    
    const onSuccess = (resp) => {
      if(resp.key) {
        dispatch({ type: '@@xadmin/AUTH_VERIFY_EMAIL', payload: resp })
      } else if(resp.detail) {
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: resp.detail
        } })
      }
      app.go('/login')
    }
    return { ...props, onSuccess }
  },
  'auth.forget_password': props => {
    const onSuccess = (user) => {
      app.go('/login')
    }
    return { ...props, onSuccess }
  },
  'auth.change_password': props => {
    const { _t } = app.context
    const { dispatch } = use('redux')
    const { saveItem } = use('model.save', { successMessage: _t('Change password success') })

    const onChange = (item) => {
      return saveItem(item).then(user => {
        app.go('/app/')
      }).catch(error => {
        throw new Error({ old_password: _t('Incorrect old password') })
      })
    }

    return { ...props, onChange }
  },
  'auth.reset_password': props => {
    const onSuccess = (user) => {
      app.go('/login')
    }
    return { ...props, onSuccess }
  }
}
