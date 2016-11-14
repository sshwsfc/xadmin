import React from 'react'

module.exports = React.createClass({

  propTypes: {
    name: React.PropTypes.string
  },

  render() {
    return (
      <i className={'fa fa-fw fa-' + this.props.name}></i>
    )
  }

})
