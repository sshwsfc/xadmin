import React from 'react'
import _ from 'lodash'

const block = (tag, props={}) => {
  const app = window.__app__

  const blocks = app.get('blocks')
  if(blocks[tag] !== undefined) {
    const nodes = blocks[tag].reduce((prev, block) => {
      const ret = block({ nodes: prev, ...props })
      if(ret !== undefined && ret != prev) {
        if(Array.isArray(ret)) {
          prev = prev.concat(ret.map(c => React.cloneElement(c, props)))
        } else {
          prev.push(React.cloneElement(ret, props))
        }
      }
      return prev
    }, [])
    if(nodes.length && nodes.filter(node => node !== null).length > 0) {
      return nodes
    }
  }
  return null
}

const Block = ({ name, children, ...props }) => {
  const bs = block(name, props)
  return _.isFunction(children) ? 
    children(bs ? React.Children.toArray(bs) : null) : React.Children.toArray(bs)
}

export { Block, block }
