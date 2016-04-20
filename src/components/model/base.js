import React from 'react'
import adapter from './adapter/apicloud'

module.exports = {
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  childContextTypes: {
    model: React.PropTypes.object.isRequired
  },
  getChildContext () {
    return { model: this.model }
  },
  componentWillMount () {
    this.model = this.getModel()
  },
  getModel () {
    var model = this.props.params.model

    return {
      name: model,
      title: 'Car',
      schema: {
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
            max: 30
          },
          active: {
            type: 'boolean'
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
          createdAt: {
            title: 'Date',
            type: 'date'
          }
        },
        required: [
          'name'
        ]
      },
      form: [
        '*'
      ],
      filters: ['name', 'brand', 'color', 'createdAt'],
      list_display: ['name', 'brand', 'color', 'createdAt'],
      $link: {
        list: {
          path: `/model/${model}`
        },
        add: {
          path: `/model/${model}/add`
        },
        get (id) {
          return {
            path: `/model/${model}/${id}`
          }
        },
        edit (id) {
          return {
            path: `/model/${model}/${id}/edit`
          }
        }
      },
      $res: adapter(model)
    }
  }
}
