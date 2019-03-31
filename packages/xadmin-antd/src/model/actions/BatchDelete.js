import React from 'react'
import { Modal, Menu, List } from 'antd'
import { app } from 'xadmin'
import { ModelWrap } from 'xadmin-model'

import { Icon } from 'xadmin-ui'

@ModelWrap('actons.batch_delete')
@ModelWrap('model.list.actions')
class BatchDeleteBtn extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }

  onBatchDelete = () => {
    this.props.onBatchDelete()
    this.onClose()
  }

  renderModel() {
    const { selected, model } = this.props
    const { _t } = app.context

    return (
      <Modal
        key="actions_batch_delete_modal"
        title={_t('Confirm to delete selected items')}
        visible={this.state.show}
        onOk={this.onBatchDelete}
        okText={_t('Delete')}
        okType="danger"
        cancelText={_t('Cancel')}
        onCancel={this.onClose}
      >
        <List
          dataSource={selected}
          renderItem={item => (<List.Item key={item.id}><Icon name={model.icon}/> {model.display ? model.display(item) : item.name}</List.Item>)}
        />
      </Modal>
    )
  }

  render() {
    const { selected, canDelete, onBatchDelete, ...props } = this.props
    const { _t } = app.context

    return canDelete ? [ (
      <Menu.Item {...props} key={'actions_batch_delete'} 
        onClick={(e)=>{
          props.onClick(e)
          this.setState({ show: true })
        }} disabled={selected.length == 0}>
        {_t('Batch Delete Items')}
      </Menu.Item>
    ),
    selected.length > 0 ? this.renderModel() : null
    ] : null
  }

}

export default BatchDeleteBtn
