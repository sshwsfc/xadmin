import React from 'react'

class PluginManager {

  constructor () {
    this.debug = false
    this.ctx = {}
    this.coms = {}
    this.plgins = []
  }

  loadPlugins (plugin) {
    this.plgins.push(plugin)
  }

  init () {
    for (var i in this.plgins) {
      this.plgins[i].use(this)
    }
  }

  regCom (tag, com) {
    if (!this.coms[tag]) {
      this.coms[tag] = []
    }
    this.coms[tag].push(com)
  }

  getComs (tag) {
    return this.coms[tag] || []
  }

}

const PM = new PluginManager()

const block = (tag, context) =>{
  let exposedProps = context.props || {}
  return PM.getComs(tag).map((ComPlugin)=>{
    return <ComPlugin key={ComPlugin.displayName} context={context} {...exposedProps} />
  })
}

module.exports = {
  PM,
  block
}
