
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

const _wrap_component = (tag, WrappedComponent, wrappers) => {
  const mappers = app.load_dict_list('mapper')[tag] || []
  const connectDisplayName = `Connect(${getDisplayName(WrappedComponent)})`

  // Helps track hot reloading.
  const version = nextVersion++

  class Connect extends Component {
    shouldComponentUpdate() {
      return this.haveOwnPropsChanged || this.hasStoreStateChanged
    }

    constructor(props, context) {
      super(props, context)
      this.version = version
      this.store = props.store || context.store

      invariant(this.store,
        `Could not find "store" in either the context or ` +
        `props of "${connectDisplayName}". ` +
        `Either wrap the root component in a <Provider>, ` +
        `or explicitly pass "store" as a prop to "${connectDisplayName}".`
      )

      const storeState = this.store.getState()
      this.state = { storeState }
      this.clearCache()
    }

    computeStateProps(store, props) {
      if (!this.finalMapStateToProps) {
        return this.configureFinalMapState(store, props)
      }

      const state = store.getState()
      const stateProps = this.doStatePropsDependOnOwnProps ?
        this.finalMapStateToProps(state, props) :
        this.finalMapStateToProps(state)

      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(stateProps, 'mapStateToProps')
      }
      return stateProps
    }

    configureFinalMapState(store, props) {
      const mappedState = mapState(store.getState(), props)
      const isFactory = typeof mappedState === 'function'

      this.finalMapStateToProps = isFactory ? mappedState : mapState
      this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1

      if (isFactory) {
        return this.computeStateProps(store, props)
      }

      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(mappedState, 'mapStateToProps')
      }
      return mappedState
    }

    computeDispatchProps(store, props) {
      if (!this.finalMapDispatchToProps) {
        return this.configureFinalMapDispatch(store, props)
      }

      const { dispatch } = store
      const dispatchProps = this.doDispatchPropsDependOnOwnProps ?
        this.finalMapDispatchToProps(dispatch, props) :
        this.finalMapDispatchToProps(dispatch)

      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(dispatchProps, 'mapDispatchToProps')
      }
      return dispatchProps
    }

    configureFinalMapDispatch(store, props) {
      const mappedDispatch = mapDispatch(store.dispatch, props)
      const isFactory = typeof mappedDispatch === 'function'

      this.finalMapDispatchToProps = isFactory ? mappedDispatch : mapDispatch
      this.doDispatchPropsDependOnOwnProps = this.finalMapDispatchToProps.length !== 1

      if (isFactory) {
        return this.computeDispatchProps(store, props)
      }

      if (process.env.NODE_ENV !== 'production') {
        checkStateShape(mappedDispatch, 'mapDispatchToProps')
      }
      return mappedDispatch
    }

    updateStatePropsIfNeeded() {
      const nextStateProps = this.computeStateProps(this.store, this.props)
      if (this.stateProps && shallowEqual(nextStateProps, this.stateProps)) {
        return false
      }

      this.stateProps = nextStateProps
      return true
    }

    updateDispatchPropsIfNeeded() {
      const nextDispatchProps = this.computeDispatchProps(this.store, this.props)
      if (this.dispatchProps && shallowEqual(nextDispatchProps, this.dispatchProps)) {
        return false
      }

      this.dispatchProps = nextDispatchProps
      return true
    }

    updateMergedPropsIfNeeded() {
      const nextMergedProps = computeMergedProps(this.stateProps, this.dispatchProps, this.props)
      if (this.mergedProps && checkMergedEquals && shallowEqual(nextMergedProps, this.mergedProps)) {
        return false
      }

      this.mergedProps = nextMergedProps
      return true
    }

    isSubscribed() {
      return isPlainObject(this.unsubscribe)
    }

    trySubscribe() {
      if (!this.unsubscribe) {
        const callback = this.handleChange.bind(this)
        const self = this
        this.unsubscribe = mapper.reduce((prev, mapper) => {
          return { ...prev, ...mapper.subscribe.bind(self)(callback) }
        }, {})
        this.handleChange()
      }
    }

    tryUnsubscribe() {
      if (this.unsubscribe) {
        const self = this
        mapper.forEach((mapper) => {
          mapper.unsubscribe.bind(self)()
        })
        this.unsubscribe = null
      }
    }

    componentDidMount() {
      this.trySubscribe()
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps, this.props)) {
        this.haveOwnPropsChanged = true
      }
    }

    componentWillUnmount() {
      this.tryUnsubscribe()
      this.clearCache()
    }

    clearCache() {
      this.dispatchProps = null
      this.stateProps = null
      this.mergedProps = null
      this.haveOwnPropsChanged = true
      this.hasStoreStateChanged = true
      this.haveStatePropsBeenPrecalculated = false
      this.statePropsPrecalculationError = null
      this.renderedElement = null
      this.finalMapDispatchToProps = null
      this.finalMapStateToProps = null
    }

    handleChange() {
      if (!this.unsubscribe) {
        return
      }

      const storeState = this.store.getState()
      const prevStoreState = this.state.storeState
      if (pure && prevStoreState === storeState) {
        return
      }

      if (pure && !this.doStatePropsDependOnOwnProps) {
        const haveStatePropsChanged = tryCatch(this.updateStatePropsIfNeeded, this)
        if (!haveStatePropsChanged) {
          return
        }
        if (haveStatePropsChanged === errorObject) {
          this.statePropsPrecalculationError = errorObject.value
        }
        this.haveStatePropsBeenPrecalculated = true
      }

      this.hasStoreStateChanged = true
      this.setState({ storeState })
    }

    getWrappedInstance() {
      invariant(withRef,
        `To access the wrapped instance, you need to specify ` +
        `{ withRef: true } as the fourth argument of the connect() call.`
      )

      return this.refs.wrappedInstance
    }

    render() {
      const {
        haveOwnPropsChanged,
        hasStoreStateChanged,
        haveStatePropsBeenPrecalculated,
        statePropsPrecalculationError,
        renderedElement
      } = this

      this.haveOwnPropsChanged = false
      this.hasStoreStateChanged = false
      this.haveStatePropsBeenPrecalculated = false
      this.statePropsPrecalculationError = null

      if (statePropsPrecalculationError) {
        throw statePropsPrecalculationError
      }

      let shouldUpdateStateProps = true
      let shouldUpdateDispatchProps = true
      if (pure && renderedElement) {
        shouldUpdateStateProps = hasStoreStateChanged || (
          haveOwnPropsChanged && this.doStatePropsDependOnOwnProps
        )
        shouldUpdateDispatchProps =
          haveOwnPropsChanged && this.doDispatchPropsDependOnOwnProps
      }

      let haveStatePropsChanged = false
      let haveDispatchPropsChanged = false
      if (haveStatePropsBeenPrecalculated) {
        haveStatePropsChanged = true
      } else if (shouldUpdateStateProps) {
        haveStatePropsChanged = this.updateStatePropsIfNeeded()
      }
      if (shouldUpdateDispatchProps) {
        haveDispatchPropsChanged = this.updateDispatchPropsIfNeeded()
      }

      let haveMergedPropsChanged = true
      if (
        haveStatePropsChanged ||
        haveDispatchPropsChanged ||
        haveOwnPropsChanged
      ) {
        haveMergedPropsChanged = this.updateMergedPropsIfNeeded()
      } else {
        haveMergedPropsChanged = false
      }

      if (!haveMergedPropsChanged && renderedElement) {
        return renderedElement
      }

      if (withRef) {
        this.renderedElement = createElement(WrappedComponent, {
          ...this.mergedProps,
          ref: 'wrappedInstance'
        })
      } else {
        this.renderedElement = createElement(WrappedComponent,
          this.mergedProps
        )
      }

      return this.renderedElement
    }
  }

  Connect.displayName = connectDisplayName
  Connect.WrappedComponent = WrappedComponent
  Connect.contextTypes = {
    store: storeShape
  }
  Connect.propTypes = {
    store: storeShape
  }

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

  return hoistStatics(Connect, WrappedComponent)
}

const Wrap = (tag, component) => {
  return connect((state, props={}) => {
    const funcs = app.load_dict_list('state_mapper')[tag]
    if(funcs !== undefined) {
      return funcs.reduce((prev, func) => {
        return { ...prev, ...func(state, props, prev, app) }
      })
    } else {
      return {}
    }
  }, (dispatch, props={}) => {
    const funcs = app.load_dict_list('dispatch_mapper')[tag]
    if(funcs !== undefined) {
      return funcs.reduce((prev, func) => {
        return { ...prev, ...func(dispatch, props, prev, app) }
      })
    } else {
      return {}
    }
  })(component)
}


const _wrap = (magic, wrappers=[]) => {
  if(isPlainObject(magic)) {
    wrappers.push(magic)
    return (arg) => { return _wrap(arg, wrappers) }
  } else {
    return (component) => {
      return _wrap_component(magic, component, wrappers)
    }
  }
}

const Wrap = _wrap({
  contextTypes: {
    router: React.PropTypes.object.isRequired,
    store: React.PropTypes.object.isRequired
  },
  getContext: () => {
    const { store, router } = this.context
    return { state: store.getState(), dispatch: store.dispatch, router }
  },
  subscribe: (callback) => {
    const { store } = this.context
    return { store: store.subscribe(callback) }
  },
  unsubscribe: (unsubscribe) => {
    unsubscribe['store']()
  }
})
