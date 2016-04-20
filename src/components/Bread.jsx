import React from 'react'
import {Breadcrumb, BreadcrumbItem} from 'react-bootstrap'

module.exports = React.createClass({

  propTypes: {},

  render() {
    return (
      <Breadcrumb>
        <BreadcrumbItem href="#">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="http://getbootstrap.com/components/#breadcrumbs">
          Library
        </BreadcrumbItem>
        <BreadcrumbItem active>
          Data
        </BreadcrumbItem>
      </Breadcrumb>
    )
  }

})
