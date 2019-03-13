import { Textarea } from 'xadmin-form/lib/components'

export default {
  Brand: {
    name: 'brand',
    resource_name: 'brands',
    type: 'object',
    icon: 'file-o', // fa-icon
    title: 'Brand',
    properties: {
      id: {
        type: 'string',
        title: 'Brand ID'
      },
      '权限': {
        type: 'string'
      },
      property: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            unit: { type: 'string' },
            value: { type: 'string' }
          }
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'id', 'property', '权限' ],
    required: [ 'id', 'property' ],
    list_display: [ 'id', 'property' ]
  },
  User: {
    name: 'user',
    resource_name: 'users',
    type: 'object',
    icon: 'user', // fa-icon
    title: 'User',
    properties: {
      id: {
        type: 'number',
        title: 'User ID'
      },
      name: {
        type: 'string',
        description: '用户的真实姓名'
      },
      username: {
        type: 'string'
      },
      email: {
        type: 'string',
        format: 'email'
      },
      website: {
        type: 'string'
      },
      brithday: {
        type: 'string',
        format: 'date'
      },
      loginTime: {
        type: 'string',
        format: 'date-time',
        convert: 'node-link'
      },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          suite: { type: 'string' }
        }
      },
      property: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'string' }
          }
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'name', 'email', 'address', '*',
      { key: 'website', component: Textarea, attrs: { rows: 5 } } ],
    filters: {
      nav: [ 'name', 'email' ],
      sidemenu: [ 'name' ]
    },
    editable_fields: ['name'],
    batch_change_fields: ['website', 'brithday'],
    search_fields: [ 'name', 'email' ],
    required: [ 'name', 'email', 'website' ],
    readonly: [ 'id' ],
    list_display: [ 'id', 'name', 'email', 'website', 'address.street' ]
  },
  Post: {
    name: 'post',
    resource_name: 'posts',
    type: 'object',
    icon: 'file-o', // fa-icon
    title: 'Post',
    properties: {
      id: {
        type: 'number',
        title: 'User ID'
      },
      title: {
        type: 'string'
      },
      body: {
        type: 'string'
      },
      user: {
        type: 'object',
        name: 'User',
        resource_name: 'users',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'title', 'body' ],
    filters: {
      nav: [ 'title', 'user' ],
      sidemenu: [ 'user' ]
    },
    search_fields: [ 'title' ],
    required: [ 'title', 'user', 'body' ],
    readonly: [ 'id' ],
    list_display: [ 'id', 'title', 'user' ]
  }
}
