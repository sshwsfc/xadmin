import { takeEvery } from 'redux-saga/effects'
import { message } from 'antd'

function handle_message({ type: actionType, payload, ...props }) {
  const { type='info', message: content } = { ...props, ...payload }
  if(type == 'success') {
    message.success(content)
  } else if (type == 'danger') {
    message.error(content)
  } else if (type == 'warning') {
    message.warning(content)
  } else if (type == 'info') {
    message.info(content)
  }
}

export default function *() {
  yield takeEvery(action => action.type == '@@xadmin/ADD_NOTICE', handle_message)
}
