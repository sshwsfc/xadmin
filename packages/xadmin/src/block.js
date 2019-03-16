import React from 'react'
import _ from 'lodash'

const block = (tag, props={}) => {
  const app = window.__app__

  const blocks = app.get('blocks')
  if(blocks[tag] !== undefined) {
    const nodes = blocks[tag].reduce((prev, block) => {
      const ret = block({ nodes: prev, ...(_.omit(props, 'children')) })
      if(ret !== undefined && ret != prev) {
        if(Array.isArray(ret)) {
          prev = prev.concat(ret)
        } else {
          prev.push(ret)
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

const Block = (props) => {
  const bs = block(props.name, { ...(props.el && props.el.props), ...props })
  return _.isFunction(props.children) ? 
    props.children(bs ? React.Children.toArray(bs) : null) : React.Children.toArray(bs)
}

export { Block, block }
