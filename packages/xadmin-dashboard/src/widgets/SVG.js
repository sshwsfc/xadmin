import React from 'react'
import ReactSVG from 'react-svg'


const SVG = React.createClass({

  shouldComponentUpdate(nextProps, nextState) {
    return false
  },

  render() {
    return <ReactSVG {...this.props} />
  }
})

export default SVG
