import React from 'react'
import _ from 'lodash'
import { FieldArray } from 'redux-form'
import { fork, put, call, cancelled } from 'redux-saga/effects'
import { takeEvery, takeLatest, delay } from 'redux-saga'
import { FieldGroup } from '../form/components/base'
import { Checkbox } from 'react-bootstrap'
import { Icon } from '../components'
import { ModelWrap } from './base'
import adapter from './adapter'

const Checkboxes = ModelWrap('model.form.relates')(React.createClass({

  componentDidMount() {
    const { input, options, field } = this.props
    if(!options) {
      this.props.getRelatedItems()
    }
  },

  onChange(checked, option) {
    const { input: { value, onChange } } = this.props
    if(checked) {
      onChange([ ...value, option ])
    } else {
      onChange(value.filter(item => item.id != option.id))
    }
  },

  renderOptions() {
    const { input, options, field } = this.props
    const checkedIds = input.value ? input.value.map(item => item.id) : []
    return options.map(option=>{
      const checked = checkedIds.indexOf(option.id) >= 0
      return <Checkbox onChange={()=>{this.onChange(!checked, option)}} checked={checked} {...field.attrs} >{option.name}</Checkbox>
    })
  },

  render() {
    const { input, options, label, meta: { error }, field } = this.props
    const { items } = field
    return (
      <FieldGroup
        id={items.name}
        label={label}
        error={error}
        help={field.description || field.help}
        control={{ ...field.attrs }}
        >
        {options?this.renderOptions():null}
      </FieldGroup>
      )
  }

}))

const schema_converter = [
  (f, schema, options) => {
    if(schema.type === 'array' && schema.items.type == 'object') {
      f.type = 'relates'
    }
    return f
  }
]

const form_fields = {
  relates: {
    component: Checkboxes
  }
}

const mappers = {
  'model.form.relates': {
    data: ({ state, model, modelState }, { field }) => {
      const formState = _.get(state.form, `model.${model.name}`)
      if(formState) {
        return {
          options: formState.relates ? formState.relates[field.name] : null
        }
      } else {
        return {}
      }
    },
    method: {
      getRelatedItems: ({ dispatch, model }, { field }) => () => {
        dispatch({ type: 'GET_RELATED_ITEMS', meta: { form: `model.${model.name}`, field } })
      }
    }
  }
}

const reducers = {
  form: (state={}, action) => {
    if(action.type == 'GET_RELATED_ITEMS' && action.success) {
      const { form, field } = action.meta
      const { items } = action
      return { ..._.set(state, `${form}.relates.${field.name}`, items) }
    }
    return state
  }
}

function *handle_get_relate(action) {
  const { meta: { form, field } } = action
  const api = adapter(field.items.schema)
  const { items } = yield api.query()
  yield put({ ...action, items, success: true })
}

function *effects() {
  yield [
    takeEvery(action => action.type == 'GET_RELATED_ITEMS' && action.items == undefined, handle_get_relate)
  ]
}

export default {
  effects: (app) => effects,
  mappers,
  reducers,
  form_fields,
  schema_converter
}
