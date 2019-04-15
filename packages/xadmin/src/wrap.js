import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { ReactReduxContext } from 'react-redux'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const shallowEqual = (objA, objB, ingoreKey) => {
  if (objA === objB) {
    return true
  }
  if((objA == undefined && objB != undefined) || (objB == undefined && objA != undefined) 
  || (objA == null && objB != null) || (objB == null && objA != null)) {
    return false
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
        (keysA[i] != ingoreKey && objA[keysA[i]] !== objB[keysA[i]])) {
      return false
    }
  }
  return true
}

const wrap_component = (WrappedComponent, tag, defaultMapper) => {
  const app = window.__app__
  let mappers = null

  const getMappers = () => {
    if(mappers == null) {
      mappers = (defaultMapper !== undefined ? [ defaultMapper ] : []).concat(tag && app.get('mappers')[tag] || [])
    }
    return mappers
  }

  const computeDataProps = ({ wrapContext, ...props }) => 
    getMappers().reduce((prev, mapper) => 
      _.isFunction(mapper.data) ? { ...prev, ...mapper.data(wrapContext, props, prev) } : prev
    , {})

  const computeComputeProps = ({ wrapContext, ...props }) => 
    getMappers().reduce((prev, mapper) => 
      _.isFunction(mapper.compute) ? { ...prev, ...mapper.compute(wrapContext, props, prev) } : prev
    , {})

  class Connect extends React.Component {

    methodProps = null
    state = {}

    static getDerivedStateFromProps(props, state) {
      const dataProps = computeDataProps(props)
      if(shallowEqual(dataProps, state.dataProps)) {
        return null
      }
      const computeProps = computeComputeProps({ ...props, ...dataProps })
      return { dataProps, computeProps }
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(this.state, nextState) || 
        !shallowEqual(this.props, nextProps, 'wrapContext')
    }

    componentDidUpdate() {
      getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.update) {
          this.runBindMethod(mapper.event.update, this)
        }
      })
    }

    componentDidMount() {
      getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.mount) {
          this.runBindMethod(mapper.event.mount, this)
        }
      })
    }

    componentWillUnmount() {
      getMappers().forEach(mapper => {
        if(mapper.event && mapper.event.unmount) {
          this.runBindMethod(mapper.event.unmount, this)
        }
      })
    }

    runBindMethod(method, args) {
      const { dataProps, computeProps } = this.state
      return method(this.props.wrapContext, { ...this.props, ...dataProps, ...computeProps }, args)
    }

    computeMethodProps() {
      const bindMethod = this.runBindMethod.bind(this)
      return getMappers().reduce((prev, mapper) => {
        if(mapper.method === undefined) {
          return prev
        }
        const methods = mapper.method
        let bindMethods = {}
        for(let key in methods) {
          const method = methods[key]
          bindMethods[key] = (...args) => bindMethod(method)(...args)
        }
        return { ...prev, ...bindMethods }
      }, {})
    }

    render() {
      const { forwardedRef, dataProps, computeProps } = this.state
      if(this.methodProps == null) {
        this.methodProps = this.computeMethodProps()
      }
      return <WrappedComponent ref={forwardedRef} {..._.omit(this.props, 'wrapContext')} {...dataProps} {...computeProps} {...this.methodProps} />
    }
  }

  return React.forwardRef((props, ref) => <Connect { ...props } forwardedRef={ ref } />)
}

const wrap = (magic, mapper, wrappers=[]) => {
  if(_.isFunction(magic)) {
    return (arg1, arg2) => { return wrap(arg1, arg2, [ magic, ...wrappers ]) }
  } else {
    return (component) => {
      const Connect = wrap_component(component, _.isPlainObject(magic) ? null : magic, _.isPlainObject(magic) ? magic : mapper)
      const ContextComponent = wrappers.reduce((prev, wrapper) => wrapper(prev), Connect)
      ContextComponent.displayName = `Connect(${getDisplayName(component)})`
      ContextComponent.WrappedComponent = component
      return ContextComponent
    }
  }
}

const Wrap = wrap(Connect => Connect)


const StoreConnect = ({ store, subscription, children }) => {
  const [ state, setState ] = useState(store.getState())

  useEffect(() => subscription.addNestedSub(() => {
    setState(store.getState())
  }), [ store, subscription ])

  return children(state)
}

const StoreWrap = wrap(Connect => (props) => (
  <ReactReduxContext.Consumer>
    {({ store, subscription }) => (
      <StoreConnect store={store} subscription={subscription}>
        { state => (<Connect {...props} wrapContext={{ store, dispatch: store.dispatch, state: state }} /> )}
      </StoreConnect>
    )}
  </ReactReduxContext.Consumer>
))

export {
  Wrap, StoreWrap, wrap
}
