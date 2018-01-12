import React, { Component } from 'react'
import _ from 'lodash'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import app from 'xadmin'

const IsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'UserIsAuthenticated'
})

const ShowAuthenticated = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'UserShowAuthenticated',
  FailureComponent: null
})

const IsSuperUser = UserAuthWrapper({
  authSelector: state => state.user,
  failureRedirectPath: '/app',
  wrapperDisplayName: 'UserIsSuper',
  predicate: user => user.isSuper,
  allowRedirectBack: false
})

const HasPermission = ({ permission, failureComponent=null, children, ...childProps }) => {
  const UserAuthTag = UserAuthWrapper({
    authSelector: state => state.user,
    wrapperDisplayName: 'VisibleOnlyHasPermission',
    predicate: user => {
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
    },
    FailureComponent: failureComponent
  })(()=> Object.keys(childProps).length > 0 ? React.cloneElement(children, childProps) : children)
  return <UserAuthTag />
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
