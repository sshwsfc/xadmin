import React from 'react'
import { Modal, Menu, List } from 'antd'
import { app, use } from 'xadmin'

import { Icon } from 'xadmin-ui'

const BatchDeleteBtn = props => {
  const { _t } = app.context
  const [ show, setShow ] = React.useState(false)
  const { canDelete, onBatchDelete } = use('actons.batch_delete', props)
  const { selected } = use('model.select', props)
  const { model } = use('model', props)

  const onClose = () => {
    setShow(false)
  }

  const renderModel = () => {
    return (
      <Modal
        key="actions_batch_delete_modal"
        title={_t('Confirm to delete selected items')}
        visible={show}
        onOk={() => {
          onBatchDelete()
          onClose()
        }}
        okText={_t('Delete')}
        okType="danger"
        cancelText={_t('Cancel')}
        onCancel={onClose}
      >
        <List
          dataSource={selected}
          renderItem={item => (<List.Item key={item.id}><Icon name={model.icon}/> {model.display ? model.display(item) : item.name}</List.Item>)}
        />
      </Modal>
    )
  }

  return canDelete ? [ (
    <Menu.Item {...props} key={'actions_batch_delete'} 
      onClick={(e)=>{
        props.onClick(e)
        setShow(true)
      }} disabled={selected.length == 0}>
      {_t('Batch Delete Items')}
    </Menu.Item>
  ),
  selected.length > 0 ? renderModel() : null
  ] : null

}

export default BatchDeleteBtn
