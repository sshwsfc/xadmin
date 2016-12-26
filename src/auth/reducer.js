

export default {
  user: (state=null, action) => {
    switch(action.type) {
      case '@@xadmin/AUTH_SIGN_IN':
        return action.payload
      case '@@xadmin/AUTH_SIGN_OUT':
        return null
      case '@@xadmin/GET_USER_INFO':
        if(action.payload) {
          return { ...state, ...action.payload }
        }
    }
    return state
  }
}
