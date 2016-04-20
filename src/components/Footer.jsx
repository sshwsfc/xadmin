import React from 'react'

module.exports = React.createClass({

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    return (
      <div id="footer">
        <hr/>
        <footer className="text-center">
            <p>&copy; <slot></slot></p>
        </footer>
      </div>
    )
  }

})
