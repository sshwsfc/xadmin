import _ from 'lodash'
import {
  atom, atomFamily,
  selector, selectorFamily
} from 'recoil'

const modelAtoms = (k, model) => {
  
  const ids = atom({
    key: k('ids'), default: []
  })

  const item = atomFamily({
    key: k('item'), default: {}
  })

  const items = selector({
    key: k('items'),
    get: ({get}) => get(ids).map(id => get(item(id))).filter(item => !_.isNil(item)),
    set: ({set}, newItems) => {
      const newIds = newItems.map(record => {
        if(_.isNil(record.id)) {
          // record without id field should throw warnning.
          return null
        }
        set(item(record.id), record)
        return record.id
      }).filter(Boolean)
      set(ids, newIds)
    }
  })

  const count = atom({
    key: k('count'), default: 0 
  })

  const selected = atom({
    key: k('selected'), default: []
  })

  const option = atom({
    key: k('option'),
    default: {}
  })

  const optionSelector = key => selector({
    key: k(key),
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
    key: k('wheres'), default: {}
  })

  const where = selectorFamily({
    key: k('where'),
    get: (id) => ({ get }) => {
      return get(wheres)[id]
    },
    set: (id) => ({ get, set}, where) => {
      set(wheres, { ..._.omit(get(wheres), id), ...(!_.isEmpty(where) ? { [id]: where } : {}) })
      set(skip, 0)
    }
  })

  const loading = atomFamily({
    key: k('loading'), default: false
  })

  const itemSelected = selectorFamily({
    key: k('itemSelected'),
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
    key: k('allSelected'),
    get: ({ get }) => {
      const selects = get(selected).map(item => item.id)
      return _.every(get(ids), id => selects.indexOf(id) >= 0)
    },
    set: ({ get, set}, selectAll) => {
      if(selectAll) {
        set(selected, _.unionWith(get(selected), get(items), (a, b) => a.id == b.id))
      } else {
        set(selected, _.differenceWith(get(selected), get(items), (a, b) => a.id == b.id))
      }
    }
  })

  const itemOrder = selectorFamily({
    key: k('itemOrder'),
    get: (field) => ({ get }) => {
      const orders = get(order)
      return orders !== undefined ? (orders[field] || '') : ''
    },
    set: (field) => ({get, set}, newOrder) => {
      const orders = get(order)
      set(order, { ...orders, [field]: newOrder })
    }
  })
  
  return {
    ids, item, items, selected, count, option, optionSelector, fields, order, limit, skip, wheres, where, loading, itemSelected, allSelected, itemOrder
  }
}

export default modelAtoms