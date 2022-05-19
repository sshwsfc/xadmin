import React from 'react'
import _ from 'lodash'
import { app, use, api } from 'xadmin'

const UserContext = React.createContext(null)

const UserRoot = ({ children }) => {
  const { show, ...value } = use('auth.context')
  return show && <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export {
  UserContext, UserRoot
}