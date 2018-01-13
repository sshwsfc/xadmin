import React, { Component } from 'react'
import _ from 'lodash'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import app from 'xadmin'

const IsAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => state.user !== null,
  redirectPath: '/login',
  wrapperDisplayName: 'UserIsAuthenticated'
})

const ShowAuthenticated = connectedAuthWrapper({
  authenticatedSelector: state => state.user !== null,
  wrapperDisplayName: 'UserShowAuthenticated'
})

const IsSuperUser = connectedRouterRedirect({
  authenticatedSelector: state => state.user !== null && state.user.isSuper,
  redirectPath: '/app',
  wrapperDisplayName: 'UserIsSuper'
})

const HasPermission = ({ permission, failureComponent=null, children, ...childProps }) => {
  const UserAuthTag = connectedAuthWrapper({
    authenticatedSelector: state => {
      const user = state.user
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
    wrapperDisplayName: 'VisibleOnlyHasPermission',
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
