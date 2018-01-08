import { config as _c } from 'xadmin-core'
import CaptchaCodeInput from './components/CaptchaCodeInput'

// Forms
const UserSignIn = ({ context: { _t } }) => ({
  type: 'object',
  name: 'user_sign_in',
  resource_name: 'auth/login',
  title: _t('Sign In'),
  properties: {
    username: {
      title: _t('Username'),
      type: 'string'
    },
    password: {
      title: _t('Password'),
      type: 'string'
    },
    ...(_c('auth.login.captcha')?{
      code: {
        title: _t('Captcha Code'),
        type: 'string'
      }
    }:{})
  },
  required: [ 'username', 'password', ...(_c('auth.login.captcha')?[ 'code' ]:[]) ],
  form: [ 
    'username', 
    { key: 'password', attrs: { type: 'password' } },
    ...(_c('auth.login.captcha')?[ {
      key: 'code', captcha_url: '/' + _c('auth.login.captcha'), component: CaptchaCodeInput 
    } ]:[])
  ]
})

const UserSignOut = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'user_sign_out',
  resource_name: 'auth/logout'
})

const UserForgetPassword = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'user_forgot_password',
  resource_name: 'auth/password/reset',
  title: _t('Forgot password'),
  properties: {
    email: {
      title: _t('Register Email'),
      type: 'string'
    }
  },
  required: [ 'email' ]
})

const UserResetPassword = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'user_reset_password',
  resource_name: 'auth/password/reset/confirm',
  title: _t('Reset Password'),
  properties: {
    new_password1: {
      title: _t('New Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6
    },
    new_password2: {
      title: _t('Repeat Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6,
      constant: { $data: '1/new_password1', constantName: _t('New Password') }
    },
    token: {
      type: 'string'
    },
    uid: {
      type: 'string'
    }
  },
  form: [ 
    { key: 'new_password1', attrs: { type: 'password' } },
    { key: 'new_password2', attrs: { type: 'password' } } 
  ]
})

const UserChangePassword = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'user_change_password',
  resource_name: 'user/password',
  title: _t('Change Password'),
  properties: {
    old_password: {
      title: _t('Old Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6,
      format: 'password'
    },
    new_password: {
      title: _t('New Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6
    },
    new_password2: {
      title: _t('Repeat Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6,
      constant: { $data: '1/new_password', constantName: _t('New Password') }
    }
  },
  required: [ 'old_password', 'new_password', 'new_password2' ],
  form: [ 
    { key: 'old_password', attrs: { type: 'password' } },
    { key: 'new_password', attrs: { type: 'password' } },
    { key: 'new_password2', attrs: { type: 'password' } } 
  ]
})

const UserSignUp = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'user_sign_up',
  resource_name: 'auth/registration',
  title: _t('Sign Up'),
  properties: {
    username: {
      title: _t('User Name'),
      type: 'string'
    },
    email: {
      title: _t('Email'),
      type: 'string'
    },
    password1: {
      title: _t('Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6
    },
    password2: {
      title: _t('Repeat Password'),
      type: 'string',
      maxLength: 12,
      minLength: 6,
      constant: { $data: '1/password1', constantName: _t('Password') }
    },
    ...(_c('auth.registration.captcha')?{
      code: {
        title: _t('Captcha Code'),
        type: 'string'
      }
    }:{})
  },
  permission: { add: true },
  required: [ 'username', 'email', 'password1', 'password2', ...(_c('auth.registration.captcha')?[ 'code' ]:[]) ],
  form: [ 
    'username', 
    'email', 
    { key: 'password1', attrs: { type: 'password' } },
    { key: 'password2', attrs: { type: 'password' } },
    ...(_c('auth.registration.captcha')?[ {
      key: 'code', captcha_url: '/' + _c('auth.registration.captcha'), component: CaptchaCodeInput 
    } ]:[] )
  ]
})

// Models
const Permission = ({ context: { _t } }) => ({ 
  type: 'object',
  name: 'auth_permission',
  resource_name: 'auth/permission',
  title: _t('Permission'),
  icon: 'key',
  properties: {
    name: {
      title: _t('Name'),
      type: 'string'
    },
    description: {
      title: _t('Description'),
      type: 'string'
    }
  },
  ui: { show_menu: false }
})

const Role = (app) => {
  const { _t } = app.context
  return { 
    type: 'object',
    name: 'auth_role',
    resource_name: 'auth/role',
    title: _t('Role'),
    icon: 'group',
    properties: {
      name: {
        title: _t('Name'),
        type: 'string'
      },
      permissions: {
        title: _t('Permission'),
        type: 'array',
        items: Permission(app)
      }
    },
    ui: { show_menu: false }
  }
}

const User = (app) => {
  const { _t } = app.context
  return { 
    type: 'object',
    name: 'auth_user',
    resource_name: 'user',
    title: _t('User'),
    icon: 'user',
    properties: {
      username: {
        title: _t('Name'),
        type: 'string'
      },
      email: {
        title: _t('Email'),
        type: 'string'
      },
      emailVerified: {
        type: 'boolean',
        title: _t('Email Verified')
      },
      is_superuser: {
        type: 'boolean',
        title: _t('Is SuperUser')
      },
      date_joined: {
        type: 'string',
        format: 'date',
        title: _t('Date Joined')
      },
      permissions: {
        title: _t('Permission'),
        type: 'array',
        items: Permission(app)
      },
      roles: {
        title: _t('Role'),
        type: 'array',
        items: Role(app)
      }
    },
    list_display: [ 'username', 'email', 'is_superuser', 'date_joined' ],
    form: [ 'username', 'email', 'is_superuser' ],
    permission: { view: true, add: true, edit: true, delete: true },
    ui: { show_menu: false }
  }
}

export default (app) => {
  return {
    auth_user: User(app),
    auth_permission: Permission(app),
    auth_role: Role(app)
  }
}

export {
  UserSignIn,
  UserSignOut,
  UserForgetPassword,
  UserResetPassword,
  UserChangePassword,
  UserSignUp
}
