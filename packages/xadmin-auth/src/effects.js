import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { app, api } from 'xadmin-core'

function *handle_get_userinfo({ type }) {
  try{
    const user = yield api({ resource_name: 'auth' }).get('user')
    yield put({ type, payload: user, success: true })
  } catch(err) { 
    app.error(err)
  }
}

function *handle_user_signin({ payload: user }) {
  if(user.name == undefined && user.username == undefined) {
    yield put({ type: '@@xadmin/GET_USER_INFO' })
  }
}

function *handle_user_signout() {
  const { _t } = app.context
  try{
    yield api({ resource_name: 'auth/logout' }).save({})
    yield put({ type: '@@xadmin/AUTH_SIGN_OUT_FINISH' })
    yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
      type: 'success', headline: 'Success', message: _t('Successfully logged out')
    } })
  } catch(err) { 
    app.error(err)
  }
}

function *handle_verify_email({ payload }) {
  const { _t } = app.context
  try {
    yield api({ resource_name: 'auth/registration/verify-email' }).save({
      language: 'zh_CN',
      ...payload
    })
    yield put({ type: '@@xadmin/ADD_NOTICE', payload: {
      type: 'success', headline: 'Success', message: _t('Send verify code to your email, please check')
    } })
  } catch(err) {
    app.error(err)
  }
}

export default function *() {
  yield [
    takeEvery(action => action.type == '@@xadmin/GET_USER_INFO' && action.success != true, handle_get_userinfo),
    takeEvery(action => action.type == '@@xadmin/AUTH_VERIFY_EMAIL', handle_verify_email),
    takeEvery(action => action.type == '@@xadmin/AUTH_SIGN_IN', handle_user_signin),
    takeEvery(action => action.type == '@@xadmin/AUTH_SIGN_OUT', handle_user_signout)
  ]
}
