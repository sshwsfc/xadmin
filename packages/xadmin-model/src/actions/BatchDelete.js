import React from 'react'
import { Modal, Dropdown, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { app } from 'xadmin'
import { ModelWrap } from '../index'

import { Icon } from 'xadmin-ui'

@ModelWrap('actons.batch_delete')
@ModelWrap('model.list.actions')
class BatchDeleteBtn extends React.Component {

  state = { show: false }

  onClose = () => {
    this.setState({ show: false })
  }

  onBatchDelete() {
    this.props.onBatchDelete()
    this.onClose()
  }

  renderModel() {
    const { selected, model } = this.props
    const { _t } = app.context

    return (
      <Modal key="actions_batch_delete_modal" show={this.state.show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{_t('Confirm to delete selected items')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {selected.map(item=>(<ListGroupItem key={item.id}><Icon name={model.icon}/> {model.display ? model.display(item) : item.name}</ListGroupItem>))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button key={0} variant="light" onClick={this.onClose}>{_t('Close')}</Button>
          <Button key={1} variant="danger" onClick={this.onBatchDelete.bind(this)}>{_t('Delete')}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { selected, canDelete } = this.props
    const { _t } = app.context

    return canDelete ? [ (
      <Dropdown.Item key={'actions_batch_delete'} onSelect={(e)=>{this.setState({ show: true })}} disabled={selected.length == 0}>
        {_t('Batch Delete Items')}
      </Dropdown.Item>
    ),
    selected.length > 0 ? this.renderModel() : null
    ] : null
  }

}

export default BatchDeleteBtn
