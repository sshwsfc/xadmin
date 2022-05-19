import _ from 'lodash'
import React from 'react'

import localforage from 'localforage'
import Cookies from 'js-cookie'

import { app, use, api } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { UserContext } from './context'

export default {
  'auth.user': () => React.useContext(UserContext),
  'auth.context': () => {
    const { auth } = app.load_dict('config')
    const [ init, setInit ] = React.useState(false)
    const [ user, setUser ] = React.useState(null)

    React.useEffect(() => {
      const loadUser = async () => {
        let user = null
        if(auth.persist_type == 'localforage') {
          try {
            const value = await localforage.getItem('user')
            if(value) {
              user = JSON.parse(value)
            }
          } catch (error) {
            await localforage.removeItem('user')
          }
        } else if(auth.persist_type == 'session-storage') {
          const value = sessionStorage.getItem('user')
          if(value) {
            user = JSON.parse(value)
          }
        }  else if(auth.persist_type == 'cookie') {
          user = Cookies.getJSON('user')
        }
        if(!_.isEmpty(user)) {
          setUser(user)
          try {
            const userInfo = await api({ name: 'auth' }).get('user')
            if(!_.isEmpty(userInfo)) {
              setUser({ ...user, ...userInfo })
            }
          } catch (err) {}
        }
        setInit(true)
      }
      loadUser()
    }, [])

    React.useEffect(() => {
      const saveUser = async () => {
        if(auth.persist_type == 'localforage') {
          if(user) {
            await localforage.setItem('user', JSON.stringify(user))
          } else {
            await localforage.removeItem('user')
          }
        } else if(auth.persist_type == 'session-storage') {
          if(user) {
            sessionStorage.setItem('user', JSON.stringify(user))
          } else {
            sessionStorage.removeItem('user')
          }
        } else if(auth.persist_type == 'cookie') {
          if(user) {
            Cookies.set('user', user, auth.userinfo_timeout ? { expires: auth.userinfo_timeout } : {})
          } else {
            Cookies.remove('user')
          }
        }
      }
      saveUser()
    }, [ user ])

    return { show: init, user, setUser }
  },
  'auth.login': () => {
    const location = use('location')
    const query = use('query')
    const navigate = use('navigate')
    const message = use('message')
    const { setUser } = use('auth.user')

    const onSignIn = async item => {
      try {
        const user = await api({ name: 'auth/login' }).save(item)
        setUser(_.omit(user, 'password'))

        if(user.name == undefined && user.username == undefined) {
          try {
            const userInfo = await api({ name: 'auth' }).get('user')
            setUser({ ...user, ...userInfo })
          } catch (err) {}
        }

        navigate(location.state?.from?.pathname || '/app/', { replace: true })
      } catch (error) {
        console.log(error)
        throw error.json && error.json.non_field_errors == undefined ? error.json : { password: _t('Incorrect username or password') }
      }
    }

    React.useEffect(() => {
      if(query.verifyEmail == 'success') {
        message && message.success(_t('Verify email success, please login'))
      }
    }, [])

    return { onSignIn }
  },
  'auth.logout': () => {
    const { setUser } = use('auth.user')
    const message = use('message')
    const onLogout = React.useCallback( async () => {
      try{
        await api({ name: 'auth/logout' }).save({})
        message && message.success(_t('Successfully logged out'))
        setUser(null)
      } catch(err) { 
        app.error(err)
      }
    }, [])

    return { onLogout }
  },
  'auth.sign_up': () => {
    const navigate = use('navigate')
    const { dispatch } = use('redux')
    
    const onSuccess = (resp) => {
      if(resp.key) {
        dispatch({ type: '@@xadmin/AUTH_VERIFY_EMAIL', payload: resp })
      } else if(resp.detail) {
        dispatch({ type: '@@xadmin/ADD_NOTICE', payload: {
          type: 'success', headline: 'Success', message: resp.detail
        } })
      }
      navigate('/login')
    }
    return { onSuccess }
  },
  'auth.forget_password': () => {
    const navigate = use('navigate')
    const onSuccess = (user) => {
      navigate('/login')
    }
    return { onSuccess }
  },
  'auth.change_password': () => {
    const navigate = use('navigate')
    const message = use('message')
    
    const onChange = async (item) => {
      try {
        await api({ name: 'user/password' }).save(item)
        message && message.success(_t('Change password success'))
        navigate('/app/')
      } catch (error) {
        throw new Error({ old_password: _t('Incorrect old password') })
      }
    }

    return { onChange }
  },
  'auth.reset_password': () => {
    const navigate = use('navigate')
    const onSuccess = (user) => {
      navigate('/login')
    }
    return { onSuccess }
  }
}
