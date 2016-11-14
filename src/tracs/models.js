import React from 'react'

import { Button, ButtonGroup, Panel, Media, Badge } from 'react-bootstrap'
import { List, Item } from '../model/components/Items'
import { ModelWrap } from '../model/base'
import { Radios } from '../form/components'
import { Icon } from '../components'
import { app } from '../index'

const id = { type: 'string' }

export default {
  'document': {
    name: 'document',
    type: 'object',
    icon: 'file-text',
    title: 'My Documents',
    properties: {
      id,
      name: {
        type: 'string'
      },
      owner: {
        type: 'string'
      },
      products: {
        type: 'array',
        items: {
          name: 'product',
          type: 'object',
          properties: {
            id,
            name: {
              type: 'string'
            }
          }
        }
      },
      type: {
        type: 'string',
        enum: [ '1_1524', '15212' ]
      },
      create_time: {
        type: 'string',
        format: 'time'
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'name', { key: 'type', component: Radios, attrs: { inline: true } }, 'products' ],
    required: [ 'name', 'type' ],
    filters: {
      nav: [ 'id', 'create_time', 'name', { key: 'type', attrs: { inline: true } } ],
      submenu: [ 'type' ]
    },
    list_display: [ 'name', 'type', 'products', 'create_time' ],
    item_actions: [ ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/model/version/list?document=' + item.id)}>Versions</Button> ], 
    ui: { show_menu: true }
  },
  'version': {
    name: 'version',
    type: 'object',
    icon: 'file-code-o',
    title: 'Version',
    properties: {
      id,
      code: {
        type: 'string'
      },
      document: {
        type: 'object',
        title: 'Document',
        properties: {
          id,
          name: {
            type: 'string'
          }
        }
      },
      owner: {
        type: 'string'
      },
      create_time: {
        type: 'string',
        format: 'datetime'
      },
      released: {
        type: 'boolean'
      },
      release_time: {
        type: 'string',
        format: 'datetime'
      },
      status: {
        type: 'number'
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'document', 'code' ],
    required: [ 'code' ],
    list_display: [ 'document', 'code', 'create_time', 'status' ],
    item_actions: [ 
      ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/fake/version/view')}>Reviewers</Button>,
      ({ item }) => <Button bsSize="xs" onClick={()=>{alert('OK')}}>Duplicate</Button>,
      ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/fake/version/view')}>view</Button>
    ], 
    ui: { show_menu: false }
  },
  'released': {
    name: 'version',
    type: 'object',
    icon: 'file-code-o',
    title: 'Released Documents',
    properties: {
      id,
      code: {
        type: 'string'
      },
      document: {
        type: 'string',
        title: 'Document',
        properties: {
          id: {
            type: 'number'
          },
          name: {
            type: 'string'
          }
        }
      },
      owner: {
        type: 'string'
      },
      create_time: {
        type: 'string',
        format: 'datetime'
      },
      released: {
        type: 'boolean'
      },
      release_time: {
        type: 'string',
        format: 'datetime'
      },
      status: {
        type: 'number'
      }
    },
    permission: { view: true },
    form: [ 'document', 'code' ],
    required: [ 'code' ],
    list_display: [ 'document', 'code', 'owner', 'create_time', 'release_time' ],
    item_actions: [ 
      ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/fake/version/view')}>view</Button>
    ], 
    ui: { show_menu: false }
  },
  'review': {
    name: 'review',
    type: 'object',
    icon: 'pencil-square-o',
    title: 'My Review',
    properties: {
      id,
      document: {
        type: 'string'
      },
      version: {
        type: 'string'
      },
      reviewer: {
        type: 'string'
      },
      active: {
        type: 'boolean'
      }
    },
    permission: { view: true },
    form: [ 'reviewer', 'active' ],
    required: [ 'reviewer' ],
    list_display: [ 'document', 'version', 'reviewer', 'active' ],
    item_actions: [ 
      ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/fake/version/view')}>Review</Button>
    ]
  },
  'comment': {
    name: 'comment',
    type: 'object',
    icon: 'comment-o',
    title: 'Comment',
    properties: {
      id,
      document: {
        type: 'number'
      },
      version: {
        type: 'string'
      },
      creater: {
        type: 'string'
      },
      content: {
        type: 'string'
      },
      create_time: {
        type: 'string',
        format: 'time'
      }
    },
    permission: { view: true },
    form: [ 'content' ],
    required: [ 'content' ],
    list_display: [ 'document', 'version', 'creater', 'create_time', 'content' ],
    item_actions: [ 
      ({ item }) => <Button bsSize="xs" onClick={()=>app.go('/fake/version/edit')}>Edit document</Button>
    ],
    components: {
      'model.list': List,
      'model.list.row': ({ item, fields, selected, actions, handleSelect }) => {
        const footer = (
          <div>
            {item.creater} @ <Item item={item} field="create_time" />
            <ButtonGroup className="pull-right">{actions}</ButtonGroup>
          </div>
          )
        return (
          <Panel footer={footer} bsStyle={selected?'danger':'default'}>
            <Media>
              <Media.Body>
                <Media.Heading>{item.document} - {item.version}</Media.Heading>
                <p>{item.content}</p>
              </Media.Body>
            </Media>
          </Panel>
          )
      }
    }
  },
  'message': {
    name: 'message',
    type: 'object',
    icon: 'envelope-o',
    title: 'Message',
    properties: {
      id,
      receiver: {
        type: 'string'
      },
      sender: {
        type: 'string'
      },
      content: {
        type: 'string'
      },
      create_time: {
        type: 'string',
        format: 'datetime'
      },
      read_time: {
        type: 'string',
        format: 'datetime'
      },
      readed: {
        type: 'boolean'
      }
    },
    permission: { view: true, add: true },
    form: [ 'receiver', 'content' ],
    required: [ 'receiver', 'content' ],
    search_fields: [ 'content', 'sender' ],
    list_display: [ 'sender', 'create_time', 'content', 'readed' ],
    components: {
      'model.list': List,
      'model.list.row': ModelWrap('message.item')(({ item, fields, actions, onMarkreaded }) => {
        return (
          <Panel style={item.readed?{ color: 'grey' }:{ cursor: 'pointer' }} onClick={()=>{
            if(!item.readed) {
              onMarkreaded(item)
            }
          }}>
            <h5>
            {item.readed?<Icon name="check-square-o"/>:<Icon name="square-o"/>}{' '}
            {item.sender}<small className="pull-right">{item.create_time}</small></h5>
            <p>{item.content}</p>
          </Panel>
          )
      })
    },
    ui: { show_menu: false }
  },
  'commdata': {
    name: 'commdata',
    type: 'object',
    icon: 'list',
    title: 'Common Data',
    properties: {
      id,
      document: {
        type: 'number'
      },
      path: {
        type: 'string'
      },
      value: {
        type: 'string'
      },
      unit: {
        type: 'string'
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    form: [ 'document', 'path', 'value', 'unit' ],
    required: [ 'path', 'value' ],
    list_display: [ 'path', 'value', 'unit' ]
  }
}
