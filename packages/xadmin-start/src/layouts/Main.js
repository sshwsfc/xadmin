import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { TopNav, Bread, MainMenu, Footer } from '../components'
import { Block, config as _c } from '../index'

export default React.createClass({

  render() {
    return (
      <div className="container-fluid" style={{ paddingTop: this.props.paddingTop || 70 }}>
        { Block('main', this)}
        <TopNav site_title={_c('site.title', 'Admin')}/>
        {this.props.children}
        <Footer/>
      </div>
    )
  }

})
