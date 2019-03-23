import React from 'react'
import { Pagination, Button } from 'antd'
import app from 'xadmin'
import { ModelWrap } from 'xadmin-model'

class ModelPagination extends React.Component {

  render() {
    const { _t } = app.context
    const { emptyComponent, items, activePage, maxButtons=6, changePage } = this.props

    const onSelect = (page) => changePage(page)

    if(items > 1 || emptyComponent == undefined) {
      return (
        <Pagination showQuickJumper={items > 10} current={activePage} 
          size={this.props.size == 'sm' ? 'small' : ''} className={this.props.className}
          pageSize={1} total={items} onChange={onSelect}
        />
      )
    } else {
      return emptyComponent !== undefined ? emptyComponent : <Button>{_t('No paging')}</Button>
    }
  }

}

export default ModelWrap('model.list.pagination')(ModelPagination)
