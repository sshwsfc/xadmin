import React from 'react'
import { Pagination, Button } from 'antd'
import app, { use } from 'xadmin'
import { _t } from 'xadmin-i18n'

export default props => {
  const { emptyComponent, maxButtons=6, ...pagerProps } = props
  const { items, activePage, changePage } = use('model.pagination')

  if(items > 1 || emptyComponent == undefined) {
    return (
      <Pagination showQuickJumper={items > 10} showSizeChanger={false} current={activePage} 
        size={props.size == 'sm' ? 'small' : ''} className={props.className}
        pageSize={1} total={items} onChange={changePage} {...pagerProps}
      />
    )
  } else {
    return emptyComponent !== undefined ? emptyComponent : <Button>{_t('No paging')}</Button>
  }
}
