import React from 'react'
import { Modal, ButtonGroup, OverlayTrigger, Popover, Panel, Button, Label, Well, MenuItem, ListGroup, ListGroupItem } from 'react-bootstrap'
import { app } from 'xadmin'
import { ModelWrap, Model } from '../index'
import { BaseRow, List } from '../components/Items'

import Icon from 'react-fontawesome'

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
      <Modal show={this.state.show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{_t('Confirm to delete selected items')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
          {selected.map(item=>(<ListGroupItem><Icon name={model.icon}/> {model.display ? model.display(item) : item.name}</ListGroupItem>))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.onClose}>{_t('Close')}</Button>
          <Button bsStyle="success" onClick={this.onBatchDelete.bind(this)}>{_t('Delete')}</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { selected, onSelect, canDelete } = this.props
    const { _t } = app.context

    return canDelete ? (
      <MenuItem eventKey={'actions_batch_delete'} onSelect={(e)=>{onSelect(e); this.setState({ show: true })}} disabled={selected.length == 0}>
      {_t('Batch Delete Items')}
      {(this.state.show && selected.length > 0) ? this.renderModel() : null}
      </MenuItem>
    ) : null
  }

}

export default BatchDeleteBtn
