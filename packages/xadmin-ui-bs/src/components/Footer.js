import React from 'react'
import { Block, config as _c } from '../index'

module.exports = React.createClass({

  propTypes: {
    site_title: React.PropTypes.string
  },

  render() {
    return (
      <div id="footer">
        <hr/>
        <footer className="text-center">
            <p>&copy; <slot>{_c('site.copyright')}</slot></p>
        </footer>
      </div>
    )
  }

})
