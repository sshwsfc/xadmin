import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Modal } from 'react-bootstrap'
import app from 'xadmin'
import { Model } from 'xadmin-model'
import Info from 'xadmin-model/lib/components/Info'

class DetailModal extends React.Component {

  state = { show: false }

  showModal() {
    this.setState({ show: true })
  }

  hideModal() {
    this.setState({ show: false })
  }

  render() {
    const { id, children, wrap:WrapComponent } = this.props
    const { _t } = app.context
    
    return (
      <WrapComponent>
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
            <Info id={id} />
          </Modal.Body>
        </Modal>
        )}
      </WrapComponent>
    )
  }

}
DetailModal.propTypes = {
  id: PropTypes.string
}

export default {
  name: 'xadmin.model.reldetail',
  field_render: (SubPrev, schema) => {
    if(schema.type == 'object' && schema.relateTo) {
      return ({ value, wrap }) => {
        
        if(value && value.id !== undefined && schema.showDetail === true && Object.keys(app.get('models')).indexOf(schema.relateTo) >= 0) {
          const newWrap = ({ children }) => (
            <Model name={schema.relateTo}>
              <DetailModal id={value.id} wrap={wrap}>
                {children}
              </DetailModal>
            </Model>
          )
          return <SubPrev value={value} wrap={newWrap} />
        } else {
          return <SubPrev value={value} wrap={wrap} />
        }
      }
    }
    return SubPrev
  }
}
export { DetailModal }
