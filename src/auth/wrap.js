
import { UserAuthWrapper } from 'redux-auth-wrapper'

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

const HasPermission = (permission) => UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'VisibleOnlyHasPermission',
  predicate: user => user.permissions.indexOf(permission) > -1,
  FailureComponent: null
})

export default {
  IsAuthenticated,
  ShowAuthenticated,
  IsSuperUser,
  HasPermission
}
