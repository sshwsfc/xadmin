
const block = (tag, element, props) => {
  const app = window.__app__

  const blocks = app.get('blocks')
  if(blocks[tag] !== undefined) {
    const nodes = blocks[tag].reduce((prev, block) => {
      const ret = block({ nodes: prev, ...element.props, ...props })
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
  return block(props.name, { props })
}

export { Block, block }
