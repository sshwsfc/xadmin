import {
  atom, atomFamily,
  selector, selectorFamily
} from 'recoil'

const ids = atom({
  key: 'ids', default: []
})

const item = atomFamily({
  key: 'item'
})

const items = selector({
  key: 'items',
  get: ({get}) => get(ids).map(id => get(item(id)))
})

const count = atom({
  key: 'count', default: 0 
})

const selected = atom({
  key: 'selected', default: []
})

const fields = atom({
  key: 'fields', default: []
})

const order = atom({
  key: 'order', default: {}
})

const limit = atom({
  key: 'limit', default: 15
})

const skip = atom({
  key: 'skip', default: 0
})

const wheres = atom({
  key: 'wheres', default: {}
})

export {
  ids, item, items, selected, count, fields, order, limit, skip, wheres
}