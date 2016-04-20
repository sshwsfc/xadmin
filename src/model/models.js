
module.exports = {
  user: {
    title: 'User',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 3
        },
        gender: {
          type: 'string',
          minLength: 3
        },
        age: {
          type: 'number',
          max: 30
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
    filters: ['name', 'gender', 'age', 'createdAt'],
    list_display: ['name', 'gender', 'age', 'createdAt']
  },
  car: {
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
    list_display: ['name', 'brand', 'color', 'createdAt']
  }
}
