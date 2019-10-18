import React from 'react'
import { RelateAction } from 'xadmin-model/lib/relate'
import { C } from 'xadmin-ui'

export default {
  User: {
    name: 'User',
    resource: 'users',
    type: 'object',
    icon: 'user', // fa-icon
    title: 'User',
    persistent: true,
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
      type: {
        type: 'string',
        enum: [ 'Nomral', 'Super', 'God' ]
      },
      email: {
        type: 'string',
        format: 'email'
      },
      website: {
        type: 'string',
        maxLength: 5
      },
      superUser: {
        type: 'boolean',
      },
      brithday: {
        type: 'string',
        format: 'date'
      },
      loginTime: {
        type: 'string',
        format: 'datetime'
      },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string', maxLength: 5 },
          suite: { type: 'string' }
        },
        required:[ 'street', 'suite' ]
      },
      property: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'string' }
          },
          required:[ 'name' ]
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'name', 'email', 'address', '*',
      { key: 'website', type: 'textarea', attrs: { rows: 5 } } ],
    filters: {
      submenu: [ 'name', 'email', 'type', 'superUser' ],
      //sidemenu: [ 'name' ]
    },
    itemActions: [ 
      (item) => <RelateAction item={item} />,
      (item) => <C is="Model.ChildrenModel" model="Post" parent={item} refField="userId" refreshTimeout={3000} />,
      'edit', 'delete'
    ],
    // batchActions: null,
    editableFields: ['name', 'type', 'address.street'],
    batchChangeFields: ['website', 'brithday', 'address.street'],
    searchFields: [ 'name', 'email' ],
    required: [ 'name', 'email', 'website', 'address' ],
    readonly: [ 'id' ],
    listFields: [ 'id', 'name', 'email', 'type', 'website', 'address.street' ]
  },
  Post: {
    name: 'Post',
    resource: 'posts',
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
      category: {
        type: 'string',
        enum: [ 'Question', 'Idea', 'Isusse' ]
      },
      user: {
        type: 'object',
        name: 'User',
        relateTo: 'User',
        showDetail: true,
        properties: {
          id: { type: 'number' },
          name: { type: 'string' }
        }
      },
      readers: {
        type: 'array',
        name: 'Readers',
        items: {
          type: 'object',
          relateTo: 'User',
          properties: {
            name: { type: 'string' },
            value: { type: 'string' }
          }
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'title', 'body', 'category', 'user', { key: 'readers', type: 'transfer' } ],
    filters: {
      nav: [ 'title', 'user' ],
      //navform: { fields: [ 'title' ], submitOnChange: false },
      sidemenu: [ 'user' ],
      submenu: { fields: [ 'id', 'title', 'body' ], submitOnChange: true },
    },
    display: (post) => post.title,
    searchFields: [ 'title' ],
    required: [ 'title', 'user', 'body' ],
    readonly: [ 'id' ],
    listFields: [ 'id', 'title', 'user' ],
    components: {
      DataList: C.lazy('Model.DataList')
    }
  }
}
