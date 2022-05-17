import React from 'react'
import { use } from 'xadmin'
import { fieldBuilder } from 'xadmin-form'
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
        title: 'User ID',
        field: {
          effect: ({ value }, form) => {
            if(value === 1) {
              form.setFieldData('type', { field: {
                titleMap: [ { name: 'A', value: 'A' }, { name: 'B', value: 'B' } ]
              }})
            } else {
              form.setFieldData('type', { field: {
                titleMap: [ { name: 'C', value: 'C' }, { name: 'D', value: 'D' } ]
              }})
            }
          },
          formText: 'User'
        }
      },
      name: {
        type: 'string',
        //description: '用户的真实姓名'
        renderTemplate: '<b style="color: <%= {1:"red", 2:"blue", 3:"green"}[item.type] || "" %>;"><%= value %></b>'
      },
      username: {
        type: 'string'
      },
      type: {
        type: 'number',
        enum: [ 1, 2, 3 ]
      },
      email: {
        type: 'string',
        format: 'email',
        // field: {
        //   component: props => {
        //     const { test } = use('form', state => ({ test: state.values && state.values.type }))
        //     console.log(test)
        //     return test || 'null'
        //   }
        // }
      },
      website: {
        type: 'string',
        maxLength: 5
      },
      superUser: {
        type: 'boolean',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      brithday: {
        type: 'string',
        format: 'date'
      },
      time: {
        type: 'string',
        format: 'time',
        field: {
          formText: 'T'
        }
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
        required:[ 'street', 'suite' ],
        field: {
          render: (fields, option) => {
            console.log(fields)
            return '123'
          }
        }
        // field: {
        //   validate: () => {
        //     return 'null'
        //   }
        // }
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
    form: [ 'name', 'email', { key: 'address', fieldsRender: (fields, option) => {
      return (
        <>
          {fieldBuilder(fields[0], option)}
          <b>asdasasdads</b>
          {fieldBuilder(fields[1], option)}
        </>
      )
    } }, '*',
      { key: 'website', type: 'textarea', attrs: { rows: 5 } } ],
    formEffect: form => {

      // form.useField('type', state => {
      //   if(state.value === 'Nomral') {
      //     form.change('name', 'hi Nomral')
      //     form.setFieldData('website', { display: false })
      //   } else {
      //     form.change('name', 'hi ' + state.value)
      //     form.setFieldData('website', { display: true })
      //   }
      // })

      // form.useEffect(({ values, errors }) => {
      //   const { email, type } = values
      //   if(email && type === 'Super') {
      //     form.change('name', 'hi Nomral')
      //   }
      //   if(errors) {
      //     console.error(errors)
      //   }
      // }, [ 'values', 'errors' ])

      form.useEffect(({ submitSucceeded, submitErrors, submitFailed }) => {
        console.log('submitSucceeded', submitSucceeded, submitErrors, submitFailed)
      }, [ 'submitSucceeded', 'submitErrors', 'submitFailed' ])
    },
    filters: {
      submenu: [ 'name', 'email', 'type', 'superUser', 'id' ],
      //sidemenu: [ 'name' ]
    },
    formProps: {
      // validate: values => {
      //   return { name: 'error name' }
      // }
    },
    itemActions: [ 
      (item) => <RelateAction item={item} />,
      (item) => <C is="Model.ChildrenModel" model="Post" parent={item} refField="userId" refreshTimeout={3000} />,
      'edit', 'delete'
    ],
    dataTableProps: (columns) => ({
      scroll: { x: 1500 },
      columns: columns.map(c => c.key === '__action__' ? { ...c, width: 200 } : c )
    }),
    // batchActions: null,
    editableFields: ['name', 'type', 'address.street'],
    batchChangeFields: ['website', 'brithday', 'address.street'],
    searchFields: [ 'name', 'email' ],
    required: [ 'name', 'address' ],
    readonly: [ 'id' ],
    listFields: [ 'id', 'name', 'email', 'type', 'website', 'address.street' ],
    defaultPageSize: 20,
    route: [ {
      parentPath: '/app/',
      path: 'users'
    }, 'us' ]
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
