import React from 'react'
import { PropTypes, createElement } from 'react'
import _ from 'lodash'
import { ButtonToolbar, Button, Modal, Panel } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { Block, StoreWrap, app } from 'xadmin-core'
import { ModelWrap, Model } from 'xadmin-model'
import { SchemaForm } from 'xadmin-form'


const DetailView = ModelWrap('model.item')(({ id, data, loading, model }) => {
  return loading ? 
    (<Panel><div className="text-center"><Icon name="spinner fa-spin fa-4x"/></div></Panel>) : 
    (data ? <SchemaForm 
        formKey={`model.${model.key}`}
        schema={model}
        initialValues={_.omitBy(data, _.isNil)}
      /> : null
    )
})

const DetailModal = React.createClass({

  propTypes: {
    id: PropTypes.string
  },

  getInitialState() {
    return { show: false }
  },

  showModal() {
    this.setState({ show: true })
  },

  hideModal() {
    this.setState({ show: false })
  },

  render() {
    const { id, children, wrap:WrapComponent } = this.props
    const { _t } = app.context
    
    return (
      <WrapComponent>
        <a onClick={this.showModal}>
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
            <DetailView id={id} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideModal}>{_t('Close')}</Button>
          </Modal.Footer>
        </Modal>
        )}
      </WrapComponent>
    )
  }

})

export default {
  name: 'xadmin.model.reldetail',
  field_render: (SubPrev, schema) => {
    if(schema.type == 'object') {
      return ({ value, wrap }) => {
        const displayField = schema.display_field || 'name'
        
        if(value && value.id !== undefined && schema.name && schema.show_detail === true && Object.keys(app.load_dict('models')).indexOf(schema.name) >= 0) {
          const RelModel = Model(schema.name)
          const newWrap = ({ children }) => {
            return (
              <RelModel>
                <DetailModal id={value.id} wrap={wrap}>
                  {children}
                </DetailModal>
              </RelModel>
            )
          }
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
