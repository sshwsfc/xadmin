import React from 'react'
import _ from 'lodash'
import app from 'xadmin'
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { SchemaForm } from 'xadmin-form'
import { Model, ModelWrap } from 'xadmin-model'
import Pagination from './Pagination'
import { Grid } from './Items'
import SubMenu from './SubMenu'
import ActionBar from './ActionBar'

class ChildrenModelBtn extends React.Component {

  state = { show: false }

  handleCancel = () => {
    this.setState({ show: false })
    this.props.onClose && this.props.onClose()
  }

  render() {
    const { parent, model, refFilter, refData, refField, modelProps, children, header, ...props } = this.props
    const { _t } = app.context

    const cmodel = _.isString(model) ? app.get('models')[model] : model
    const schema = {
      ...cmodel,
      parent,
      item_actions: [
        ...(cmodel.item_actions || []),
        item => <EditChildrenModelBtn id={item.id}>{_t('Edit')}</EditChildrenModelBtn>
      ],
      permission: {
        ...cmodel.permission,
        edit: false,
        childEdit: cmodel.permission && cmodel.permission.edit
      },
      ...modelProps
    }
    const initialValues = {
      wheres: { filters: refFilter || { [refField]: parent.id } }
    }

    return [
      <Button size="sm" key={0} className="model-list-action" {...props} onClick={() => this.setState({ show: true })}>{children}</Button>,
      this.state.show ? (
        <Modal key={1}
          show={this.state.show} 
          dialogClassName="mw-100 mx-5"
          onHide={this.handleCancel}
        >
          <Modal.Header closeButton>
            <Modal.Title>{header || children}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Model schema={schema} 
              modelKey={`${_.isString(model) ? model : model.name}_${parent.id}`} 
              initialValues={initialValues} >
              <ChildrenModelPage parent={parent} refData={refData || { [refField]: parent.id }} refField={refField} />
            </Model>
          </Modal.Body>
        </Modal>
      ) : null
    ]
  }
}

class ChildrenModelPage extends React.Component {

  render() {
    return (
      <>
        <div key="model-list-subnav" style={{ display: 'flex', justifyContent: 'space-between' }} className="mb-3">
          <Pagination size="sm" className="my-0"/>
          <SubMenu><AddChildrenModelBtn {...this.props} /></SubMenu>
        </div>,
        <Grid key="model-list-grid" />,
        <ActionBar key="model-list-action" />,
        <Pagination key="model-list-pagination" />
      </>
    )
  }
}

@ModelWrap('model.page.list', {
  method: {
    onSuccess: ({ dispatch, model }) => () => dispatch({ model, type: 'GET_ITEMS' })
  }
})
class AddChildrenModelBtn extends React.Component {

  state = { show: false }

  render() {
    const { canAdd, model, onSuccess, refData } = this.props
    const { _t } = app.context
    return [
      <Button key={0} size="sm" className="ml-2" style={{ float: 'right' }} onClick={() => this.setState({ show: true })}>{_t('Add {{object}}', { object: model.title })}</Button>,
      <ChildrenFormModel key={1} onSuccess={onSuccess} refData={refData} show={this.state.show} onClose={() => this.setState({ show: false })} />
    ]
  }
}


@ModelWrap('model.list.row', {
  compute: ({ model }, { item }) => ({ canChildEdit: !!model.permission && !!model.permission.childEdit && item && item._canEdit !== false }),
  method: {
    onSuccess: ({ dispatch, model }) => () => dispatch({ model, type: 'GET_ITEMS' })
  }
})
class EditChildrenModelBtn extends React.Component {

  state = { show: false }

  render() {
    const { canChildEdit, model, onSuccess, id, refData } = this.props
    const { _t } = app.context
    return canChildEdit && [
      <Button key={0} size="sm" className="model-list-action" onClick={() => this.setState({ show: true })}>{_t('Edit')}</Button>,
      <ChildrenFormModel key={1} onSuccess={onSuccess} id={id} refData={refData} show={this.state.show} onClose={() => {
        this.setState({ show: false })
      }} />
    ]
  }
}

@ModelWrap('model.item')
class ChildrenFormModel extends React.Component {

  onSubmitSuccess = (item) => {
    this.props.onClose()
    this.props.onSuccess(item)
  }

  onSaveItem = (values) => {
    this.props.saveItem({ ...values, ...this.props.refData })
  }

  render() {
    const { show, data, loading, model, title, onClose, modalProps } = this.props
    const { _t } = app.context

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting, onClose } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <Modal
          {...modalProps}
          show={show} size="lg"
          className="xadmin-modal-form"
          onHide={onClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal">{children}</form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose} variant="light">{_t('Close')}</Button>
            {invalid ? (
              <OverlayTrigger placement="top" overlay={<Tooltip>{_t('Please be sure to complete all field.')}</Tooltip>}>
                <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit}>
                  <Icon name="ban"/> {_t('Save')}</Button>
              </OverlayTrigger>
            ) : (
              <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit}>
                <Icon name={icon}/> {_t('Save')}</Button>
            )}
          </Modal.Footer>
        </Modal>
      )
    }

    return show && !loading ? (
      <SchemaForm
        formKey={`model.modalform.${model.key}`}
        schema={model}
        initialValues={data}
        onSubmit={this.onSaveItem}
        onClose={onClose}
        component={FormLayout}
        onSubmitSuccess={this.onSubmitSuccess}
      />
    ) : null
  }

}

export default ChildrenModelBtn
