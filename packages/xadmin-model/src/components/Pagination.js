import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'react-bootstrap'
import app from 'xadmin'
import { ModelWrap } from '../base'

class ModelPagination extends React.Component {

  render() {
    const { _t } = app.context
    const { emptyComponent, items, activePage, changePage } = this.props
    const c = (num) => () => changePage(num)

    const pages = []
    for (let i = 1; i <= items; i++) {
      pages.push(<Pagination.Item active={activePage == i} onClick={c(i)}>{i}</Pagination.Item>)
    }

    if(items > 1) {
      return (
        <Pagination
          style={{ marginTop: 0 }}
          bsSize={this.props.bsSize || ''}>
          <Pagination.First disabled={activePage == 1} onClick={c(1)} />
          <Pagination.Prev disabled={activePage == 1} onClick={c(activePage - 1)} />
          {pages}
          <Pagination.Next disabled={activePage == items} onClick={c(activePage + 1)}/>
          <Pagination.Last disabled={activePage == items} onClick={c(items)}/>
        </Pagination>
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
