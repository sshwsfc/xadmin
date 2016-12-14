
import { app, config } from '../index'
import mock from './mock'

const cache = {}

export default (model) => {
  const resource = model.resource_name || model.name
  if(cache[resource] == undefined) {
    cache[resource] = config('api', mock)(model)
  }
  return cache[resource]
}
