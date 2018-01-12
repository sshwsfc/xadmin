
const Block = (tag, element, props) => {
  const app = window.__app__

  const blocks = app.load_dict_list('blocks')
  if(blocks[tag] !== undefined) {
    return blocks[tag].reduce((prev, block) => {
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
  }
}

const BlockTag = ({ tag, children, props, ...extraProps }) => {
  const app = window.__app__

  const blocks = app.load_dict_list('blocks') && app.load_dict_list('blocks')[tag]
  if(blocks !== undefined) {
    return blocks.reduce((prev, block) => {
      const ret = block({ nodes: prev, ...props, ...extraProps })
      if(ret !== undefined && ret != prev) {
        if(Array.isArray(ret)) {
          prev = prev.concat(ret)
        } else {
          prev.push(ret)
        }
      }
      return prev
    }, [ children ])
  } else {
    return children
  }
}

