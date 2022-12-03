import React from 'react'
import _ from 'lodash'
import { Navigate } from 'react-router-dom'
import app, { use } from 'xadmin'

const IsAuthenticated = ({ children }) => {
  const location = use('location')
  const { user } = use('auth.user')

  if(!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children
}

const ShowAuthenticated = ({ children }) => {
  const { user } = use('auth.user')
  if(!user) {
    return null
  }
  return children
}

const IsSuperUser = ({ children }) => {
  const { user } = use('auth.user')
  if(user !== null && user.isSuper) {
    return children
  } else {
    app.go('/app')
    return null
  }
}

const HasPermission = ({ permission, FailureComponent='NoPermission', children, ...props }) => {
  const { user } = use('auth.user')

  const checkPermission = user => {
    if(user && user.isSuper) { return true }
    if(user && user.permissions) {
      if(_.isArray(permission)) {
        return !_.some(permission, p => user.permissions.indexOf(p) == -1)
      } else if(_.isFunction(permission)) {
        return permission(user)
      } else {
        return user.permissions.indexOf(permission) > -1
      }
    } else {
      return false
    }
  }
  
  if(checkPermission(user)) {
    return Object.keys(props).length > 0 ? React.cloneElement(children, props) : children
  } else {
    if(React.isValidElement(FailureComponent)) {
      return FailureComponent
    } else if(_.isFunction(FailureComponent)) {
      return <FailureComponent />
    } else {
      return FailureComponent
    }
  }
}

const perm = (permission, component, failureComponent=null) => {
  const { store } = app.context
  return (user => {
    if(user && user.isSuper) { return true }
    if(user && user.permissions) {
      if(_.isArray(permission)) {
        return !_.some(permission, p => user.permissions.indexOf(p) == -1)
      } else if(_.isFunction(permission)) {
        return permission(user)
      } else {
        return user.permissions.indexOf(permission) > -1
      }
    } else {
      return false
    }
  })(store.getState().user) ? component: failureComponent
}

export {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission,
  perm
}
