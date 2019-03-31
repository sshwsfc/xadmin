import React from 'react'
import _ from 'lodash'
import { Modal } from 'react-bootstrap'
import app from 'xadmin'
import { C } from 'xadmin-ui'

class DetailModal extends React.Component {

  state = { show: false }

  showModal() {
    this.setState({ show: true })
  }

  hideModal() {
    this.setState({ show: false })
  }

  render() {
    const { id, children } = this.props
    
    return (
      <>
        <a style={{ cursor: 'pointer' }} onClick={this.showModal}>
          {children}
        </a>
        { this.state.show && (<Modal
          show={this.state.show}
          onHide={this.hideModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{children}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <C is="Model.DataDetail" id={id} />
          </Modal.Body>
        </Modal>
        )}
      </>
    )
  }

}

export default DetailModal
