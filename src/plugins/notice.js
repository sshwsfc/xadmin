import React from 'react'
import { StoreWrap } from '../index'
import { AlertList } from 'react-bs-notifier'

const Notices = StoreWrap('xadmin.notice')(({ notices, onDismiss }) => {
  return <AlertList alerts={notices} position="top-right" timeout={3000} onDismiss={onDismiss} dismissTitle="Dismiss" />
})

export default {
  name: 'xadmin.notice',
  blocks: {
    'main': () => <Notices />
  },
  mappers: {
    'xadmin.notice': {
      data: ({ state }) => {
        return {
          notices: state.notices
        }
      },
      method: {
        onDismiss: ({ dispatch }) => (notice) => {
          dispatch({ type: '@@xadmin/DISMISS_NOTICE', payload: notice })
        }
      }
    }
  },
  reducers: {
    notices: (state=[], { type, payload }) =>{
      if(type == '@@xadmin/ADD_NOTICE') {
        return [ ...state, { ...payload, id: (new Date()).getTime() } ]
      } else if(type == '@@xadmin/DISMISS_NOTICE') {
        const idx = state.indexOf(payload)
        if (idx >= 0) {
          return [ ...state.slice(0, idx), ...state.slice(idx + 1) ]
        }
      }
      return state
    }
  }
}
