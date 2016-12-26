import React, { createClass, PropTypes } from 'react'
import { Icon } from '../../components'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { Block, app } from '../../index'
import { ModelWrap } from '../base'

const ModelPagination = createClass({

  propTypes: {
    bsSize: PropTypes.string,
    items: PropTypes.number,
    activePage: PropTypes.number,
    changePage: PropTypes.func
  },

  render() {
    const { _t } = app.context
    if(this.props.items > 1) {
      return (
        <Pagination
            style={{ marginTop: 0 }}
            bsSize={this.props.bsSize}
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.items}
            activePage={this.props.activePage}
            onSelect={this.props.changePage}
            maxButtons={5} />
        )
    } else {
      return (
        <ul style={{ marginTop: 0 }} className="pagination pagination-sm">
          <li className="disabled"><a>{_t('No paging')}</a></li>
        </ul>
        )
    }
  }

})

export default ModelWrap('model.list.pagination')(ModelPagination)
