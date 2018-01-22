import React from 'react'
import PropTypes from 'prop-types'
import isPlainObject from 'lodash/isPlainObject'

// Helps track hot reloading.
let nextVersion = 0

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true
  }
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }
  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }
  return true
}

const _wrap_component = (tag, WrappedComponent, wrappers, defaultMapper) => {
  const connectDisplayName = `Connect(${getDisplayName(WrappedComponent)})`
  // Helps track hot reloading.
  const version = nextVersion++

  class Connect extends React.Component {

    constructor(props, context) {
      super(props, context)
      this.version = version
      this.stateContext = this.getState()
      this.clearCache()

      this.trySubscribe()
    }

    getState() {
      const context = this.context
      return wrappers.reduce((prev, wrapper) => {
        if(wrapper.getState !== undefined) {
          return { ...prev, ...wrapper.getState(context) }
        } else {
          return prev
        }
      }, {})
    }

    isSubscribed() {
      return isPlainObject(this.unsubscribe)
    }

    trySubscribe() {
      if (!this.unsubscribe) {
        const callback = this.handleChange.bind(this)
        const context = this.context
        this.unsubscribe = wrappers.reduce((prev, wrapper) => {
          if(wrapper.subscribe !== undefined) {
            return { ...prev, ...wrapper.subscribe(context, callback) }
          } else {
            return prev
          }
        }, {})
        //this.handleChange()
      }
    }

    tryUnsubscribe() {
      if (this.unsubscribe) {
        const unsubscribe = this.unsubscribe
        wrappers.forEach((wrapper) => {
          if(wrapper.unsubscribe !== undefined) {
            wrapper.unsubscribe(unsubscribe)
          }
        })
        this.unsubscribe = null
      }
    }

    componentDidUpdate() {
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.update) {
          this.runBindMethod(mapper.event.update, this)
        }
      })
    }

    componentWillMount() {
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.willMount) {
          this.runBindMethod(mapper.event.willMount, this)
        }
      })
    }

    componentDidMount() {
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.mount) {
          this.runBindMethod(mapper.event.mount, this)
        }
      })
    }

    componentWillUnmount() {
      this.tryUnsubscribe()
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.unmount) {
          this.runBindMethod(mapper.event.unmount, this)
        }
      })
      this.clearCache()
    }

    componentWillReceiveProps(nextProps) {
      if(shallowEqual(nextProps, this.props)) {
        return
      }
      this.getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.receiveProps) {
          this.runBindMethod(mapper.event.receiveProps, nextProps)
        }
      })
    }

    clearCache() {
      this.methodProps = null
      this.dataProps = null
      this.computeProps = null
      this.wrapProps = null
      this.mappers = null
    }

    getMappers() {
      if(this.mappers == null) {
        const app = window.__app__
        this.mappers = (defaultMapper !== undefined ? [ defaultMapper ] : []).concat(app.load_dict_list('mappers')[tag] || [])
      }
      return this.mappers
    }

    computeDataProps() {
      const { stateContext, props } = this
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.data === undefined) {
          return prev
        }
        return { ...prev, ...mapper.data(stateContext, props, prev) }
      }, this.dataProps || {})
    }

    computeComputeProps() {
      const { stateContext, props } = this
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.compute === undefined) {
          return prev
        }
        return { ...prev, ...mapper.compute(stateContext, { ...props, ...this.dataProps }, prev) }
      }, this.computeProps || {})
    }

    computeWrapProps() {
      const { stateContext, props } = this
      return wrappers.reduce((prev, wrapper) => {
        if(wrapper.computeProps === undefined) {
          return prev
        }
        return { ...prev, ...wrapper.computeProps(tag, stateContext, { ...props, ...this.dataProps }, prev) }
      }, this.wrapProps || {})
    }

    runBindMethod(method, args) {
      const { stateContext, props } = this
      return method(stateContext, props, args)
    }

    computeMethodProps() {
      const bindMethod = this.runBindMethod.bind(this)
      return this.getMappers().reduce((prev, mapper) => {
        if(mapper.method === undefined) {
          return prev
        }
        const methods = mapper.method
        let bindMethods = {}
        for(let key in methods) {
          const method = methods[key]
          bindMethods[key] = (e) => {
            return bindMethod(method)(e)
          }
        }
        return { ...prev, ...bindMethods }
      }, {})
    }

    updateDataProps() {
      const nextDataProps = this.computeDataProps()
      if (this.dataProps && shallowEqual(nextDataProps, this.dataProps)) {
        return false
      }
      this.dataProps = nextDataProps
      return true
    }

    handleChange() {
      if (!this.unsubscribe) {
        return
      }
      const newState = this.getState()
      if (shallowEqual(newState, this.stateContext)) {
        return
      }
      this.stateContext = newState

      const haveDataPropsChanged = this.updateDataProps()
      if(haveDataPropsChanged) {
        this.forceUpdate()
      }
    }

    render() {
      if(this.dataProps == null) {
        this.dataProps = this.computeDataProps()
      }
      this.computeProps = this.computeComputeProps()
      if(this.methodProps == null) {
        this.methodProps = this.computeMethodProps()
      }
      if(this.wrapProps == null) {
        this.wrapProps = this.computeWrapProps()
      }
      return React.createElement(WrappedComponent,
        { ...this.props, ...this.wrapProps, ...this.methodProps, ...this.dataProps, ...this.computeProps }
      )
    }
  }

  Connect.displayName = connectDisplayName
  Connect.WrappedComponent = WrappedComponent
  Connect.contextTypes = wrappers.reduce((prev, wrapper) => {
    return { ...prev, ...wrapper.contextTypes }
  }, {})

  if (process.env.NODE_ENV !== 'production') {
    Connect.prototype.componentWillUpdate = function componentWillUpdate() {
      if (this.version === version) {
        return
      }
      // We are hot reloading!
      this.version = version
      this.trySubscribe()
      this.clearCache()
    }
  }
  return Connect
  //return hoistStatics(Connect, WrappedComponent) // will invoke the error "cannot call class as a function" in IE<=10
}

const _wrap = (magic, mapper, wrappers=[]) => {
  if(isPlainObject(magic)) {
    return (arg1, arg2) => { return _wrap(arg1, arg2, [ ...wrappers, magic ]) }
  } else {
    return (component) => {
      return _wrap_component(magic, component, wrappers, mapper)
    }
  }
}

const Wrap = _wrap({
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  getState: (context) => {
    const { router } = context
    return { router }
  }
})

const StoreWrap = Wrap({
  contextTypes: {
    store: PropTypes.object.isRequired
  },
  getState: (context) => {
    const { store } = context
    return { state: store.getState(), dispatch: store.dispatch }
  },
  subscribe: (context, callback) => {
    const { store } = context
    return { store: store.subscribe(callback) }
  },
  unsubscribe: (unsubscribe) => {
    unsubscribe['store']()
  }
})

export {
  Wrap, StoreWrap
}
