import React from 'react'
import { app, StoreWrap } from 'xadmin-core'

@StoreWrap('hello')
class Hello extends React.Component {
  render() {
    const { count, add } = this.props
    return (
      <div>
        {count} <a onClick={add}>+</a>
      </div>
    )
  }
}

app.use({
  mappers: {
    hello: {
      data: ({ state }, props ) => {
        return { count: state.count }
      },
      method: {
        add: ({ dispatch }) => () => {
          dispatch({ type: 'ADD' })
        }
      }
    }
  },
  reducers: {
    count: (state=0, action) => {
      if(action.type == 'ADD') {
        return state + 1
      }
      return state
    }
  },
  routers: {
    '@': {
      path: '/',
      component: Hello 
    }
  }
}).start({ container: '#app' })
