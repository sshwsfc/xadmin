import _ from 'lodash'
import {
  atom, atomFamily,
  selector, selectorFamily
} from 'recoil'

const ids = atom({
  key: 'ids', default: []
})

const item = atomFamily({
  key: 'item', default: {}
})

const items = selector({
  key: 'items',
  get: ({get}) => get(ids).map(id => get(item(id))).filter(item => !_.isNil(item)),
  set: ({set}, newItems) => {
    const newIds = newItems.map(record => {
      set(item(record.id), record)
      return record.id
    })
    set(ids, newIds)
  }
})

const count = atom({
  key: 'count', default: 0 
})

const selected = atom({
  key: 'selected', default: []
})

const option = atom({
  key: 'option',
  default: {}
})

const optionSelector = key => selector({
  key,
  get: ({get}) => get(option)[key],
  set: ({get, set}, value) => {
    set(option, {
      ...get(option),
      [key]: value
    })
  }
})

const fields = optionSelector('fields')

const order = optionSelector('order')

const limit = optionSelector('limit')

const skip = optionSelector('skip')

const wheres = atom({
  key: 'wheres', default: {}
})

const loading = atomFamily({
  key: 'loading', default: false
})

const itemSelected = selectorFamily({
  key: 'itemSelected',
  get: (id) => ({ get }) => {
    return get(selected).find(item => item.id == id) !== undefined
  },
  set: (id) => ({ get, set}, isSelect) => {
    const selectedItems = get(selected).filter(i => { return i.id !== id })
    if (isSelect) {
      selectedItems.push(get(item(id)))
    }
    set(selected, selectedItems)
  }
})

const allSelected = selector({
  key: 'allSelected',
  get: ({ get }) => {
    const selects = get(selected).map(item => item.id)
    return _.every(get(ids), id => selects.indexOf(id) >= 0)
  },
  set: ({ get, set}, selectAll) => {
    if(selectAll) {
      set(selected, _.unionWith(get(selected), get(items), (a, b) => a.id == b.id))
    } else {
      set(selected, [])
    }
  }
})

const itemOrder = selectorFamily({
  key: 'itemOrder',
  get: (field) => ({ get }) => {
    const orders = get(order)
    return orders !== undefined ? (orders[field] || '') : ''
  },
  set: (field) => ({get, set}, newOrder) => {
    const orders = get(order)
    set(order, { ...orders, [field]: newOrder })
  }
})

export {
  ids, item, items, selected, count, option, optionSelector, fields, order, limit, skip, wheres, loading, itemSelected, allSelected, itemOrder
}