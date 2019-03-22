import React from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'react-bootstrap'
import app from 'xadmin'
import { ModelWrap } from 'xadmin-model'

class ModelPagination extends React.Component {

  renderPageButtons({ activePage, items, maxButtons, onSelect }) {
    const pageButtons = []

    let startPage
    let endPage
    let hasHiddenPagesAfter

    if (maxButtons) {
      let hiddenPagesBefore = activePage - parseInt(maxButtons / 2, 10)
      startPage = Math.max(hiddenPagesBefore, 1)
      hasHiddenPagesAfter = items >= startPage + maxButtons

      if (!hasHiddenPagesAfter) {
        endPage = items
        startPage = items - maxButtons + 1
        if (startPage < 1) {
          startPage = 1
        }
      } else {
        endPage = startPage + maxButtons - 1
      }
    } else {
      startPage = 1
      endPage = items
    }

    for (let pagenumber = startPage; pagenumber <= endPage; pagenumber++) {
      pageButtons.push(
        <Pagination.Item
          onClick={()=>onSelect(pagenumber)}
          key={pagenumber}
          active={pagenumber === activePage}
        >
          {pagenumber}
        </Pagination.Item>
      )
    }

    if (startPage !== 1) {
      pageButtons.unshift(
        <Pagination.Ellipsis
          key="ellipsisFirst"
          disabled
        />
      )

      pageButtons.unshift(
        <Pagination.Item
          onClick={()=>onSelect(1)}
          key={1}
          active={false}
        >
          1
        </Pagination.Item>
      )
    }

    if (maxButtons && hasHiddenPagesAfter) {
      pageButtons.push(
        <Pagination.Ellipsis
          key="ellipsis"
          disabled
        />
      )

      if (endPage !== items) {
        pageButtons.push(
          <Pagination.Item
            onClick={()=>onSelect(items)}
            key={items}
            active={false}
          >
            {items}
          </Pagination.Item>
        )
      }
    }

    return pageButtons
  }


  render() {
    const { _t } = app.context
    const { emptyComponent, items, activePage, maxButtons=6, changePage } = this.props
    const c = (num) => () => changePage(num)

    const pages = []
    for (let i = 1; i <= items; i++) {
      pages.push(<Pagination.Item active={activePage == i} onClick={c(i)}>{i}</Pagination.Item>)
    }

    const onSelect = (page) => changePage(page)

    if(items > 1) {
      return (
        <Pagination
          size={this.props.size || ''} className={this.props.className}>
          <Pagination.Prev disabled={activePage == 1} onClick={activePage == 1 ? ()=>{} : c(activePage - 1)} />
          {this.renderPageButtons({ activePage, items, maxButtons, onSelect })}
          <Pagination.Next disabled={activePage == items} onClick={activePage == items ? ()=> {} : c(activePage + 1)}/>
        </Pagination>
      )
    } else {
      return emptyComponent !== undefined ? emptyComponent : (
        <Pagination
          size={this.props.size || ''} className={this.props.className}>
          <Pagination.Item disabled>{_t('No paging')}</Pagination.Item>
        </Pagination>
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
