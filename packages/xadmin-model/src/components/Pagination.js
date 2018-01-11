import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'react-bootstrap'
import app from 'xadmin-core'
import { ModelWrap } from '../base'

class ModelPagination extends React.Component {

  render() {
    const { _t } = app.context
    const { emptyComponent } = this.props

    if(this.props.items > 1) {
      return (
        <Pagination
            style={{ marginTop: 0 }}
            bsSize={this.props.bsSize || ''}
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
      return emptyComponent !== undefined ? emptyComponent : (
        <ul style={{ marginTop: 0 }} className="pagination pagination-sm">
          <li className="disabled"><a>{_t('No paging')}</a></li>
        </ul>
        )
    }
  }

}

ModelPagination.propTypes = {
  bsSize: PropTypes.string,
  items: PropTypes.number,
  activePage: PropTypes.number,
  changePage: PropTypes.func
}

export default ModelWrap('model.list.pagination')(ModelPagination)
