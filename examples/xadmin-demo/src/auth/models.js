
const User = {
  name: 'User',
  resource_name: 'Users',
  type: 'object',
  icon: 'user',
  title: '用户',
  properties: {
    username: {
      type: 'string',
      title: '用户名'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      title: '密码',
      type: 'string',
      maxLength: 12,
      minLength: 6
    },
    password2: {
      title: '重复密码',
      type: 'string',
      maxLength: 12,
      minLength: 6,
      constant: { $data: '1/password', constantName: '密码' }
    },
    roles: {
      type: 'array',
      title: '用户角色',
      notInclude: true,
      items: {
        type: 'object',
        name: 'Role',
        properties: {
          Id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    },
    departments: {
      type: 'array',
      title: '用户所属部门',
      items: {
        type: 'object',
        name: 'Department',
        properties: {
          Id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  },
  displayField: 'username',
  partialSave: true,
  permission: { view: true, add: true, edit: true, delete: true },
  form: [
    'username', 'email', 'roles', 'departments',
    { key: 'password', attrs: { type: 'password' } },
    { key: 'password2', attrs: { type: 'password' } }
  ],
  search_fields: [ 'username', 'email' ],
  required: [ 'username', 'email' ],
  list_display: [ 'username', 'email' ],
  relations: {
    departments: {}
  }
}

export default {
  User
}
