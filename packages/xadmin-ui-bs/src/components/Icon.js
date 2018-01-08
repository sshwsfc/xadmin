import React from 'react'

module.exports = React.createClass({

  propTypes: {
    name: React.PropTypes.string
  },

  render() {
    const fontClass = this.props.fontClass || 'fa fa-fw fa-'
    return (
      <i className={fontClass + this.props.name} {...this.props}></i>
    )
  }

})
