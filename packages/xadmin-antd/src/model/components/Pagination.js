import React from 'react'
import { Pagination, Button } from 'antd'
import app, { use } from 'xadmin'
import { _t } from 'xadmin-i18n'

export default props => {
  const { emptyComponent, items, activePage, maxButtons=6, changePage } = use('model.pagination', props)

  if(items > 1 || emptyComponent == undefined) {
    return (
      <Pagination showQuickJumper={items > 10} current={activePage} 
        size={props.size == 'sm' ? 'small' : ''} className={props.className}
        pageSize={1} total={items} onChange={changePage}
      />
    )
  } else {
    return emptyComponent !== undefined ? emptyComponent : <Button>{_t('No paging')}</Button>
  }
}
