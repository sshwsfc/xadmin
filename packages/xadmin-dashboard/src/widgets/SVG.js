import React from 'react'
import ReactSVG from 'react-svg'

class SVG extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    return <ReactSVG {...this.props} />
  }
}

export default SVG
