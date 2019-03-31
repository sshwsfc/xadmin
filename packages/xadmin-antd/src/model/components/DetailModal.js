import React from 'react'
import _ from 'lodash'
import { Modal } from 'antd'
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
          visible={this.state.show}
          onCancel={this.hideModal}
          title={children}
        >
          <C is="Model.DataDetail" id={id} />
        </Modal>
        )}
      </>
    )
  }

}

export default DetailModal
