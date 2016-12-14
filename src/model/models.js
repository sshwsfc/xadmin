// this file is e.g. for models
import { Radios, Textarea } from '../form/components'

export default {
  car: {
    name: 'car',
    title: 'Car',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3
      },
      color: {
        type: 'string',
        minLength: 3
      },
      count: {
        type: 'number',
        maximum: 30
      },
      active: {
        type: 'boolean'
      },
      saleDate: {
        title: '售卖日期',
        type: 'string',
        format: 'date'
      },
      brand: {
        title: 'Car Brand',
        type: 'string',
        enum: [
          'benz',
          'BMW',
          'audi'
        ]
      },
      comment: {
        title: 'Comment',
        type: 'string',
        maxLength: 20,
        validationMessage: 'Don\'t be greedy!',
        description: 'Please write your comment here.'
      },
      othercar: {
        name: 'othercar',
        title: 'Other Car',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 3
          },
          color: {
            type: 'string',
            minLength: 3
          }
        }
      },
      cars: {
        title: 'Chlid Cars',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 3
            },
            color: {
              type: 'string',
              minLength: 3
            },
            saleDate: {
              title: '售卖日期',
              type: 'string',
              format: 'date'
            }
          }
        }
      },
      items: {
        title: 'Chlid Items',
        type: 'array',
        items: {
          type: 'string',
          minLength: 3
        }
      }
    },
    permission: { view: true, add: true, edit: true, delete: true },
    required: [ 'name' ],
    form: [ 
      { key: 'name', attrs: { bsSize: 'lg' } }, 
      'color', 
      'saleDate',
      { key: 'brand', component: Radios, attrs: { inline: true } }, 
      { key: 'comment', component: Textarea, attrs: { rows: 5 } },
      '*'
    ],
    filters: [ 'name', 'brand', 'color', 'createdAt' ],
    list_display: [ 'name', 'brand', 'color', 'createdAt' ]
  }
}
