import React from 'react'
import { NavItem, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Modal } from 'react-bootstrap'
import { Page, Icon } from 'xadmin/lib/components'
import { SchemaForm, fieldBuilder } from 'xadmin/lib/form'
import { app, StoreWrap } from 'xadmin'
import DashboardWrap from '../wrap'

export default DashboardWrap('dashboard.view')(React.createClass({

  onClose() {
    this.props.onClose()
  },

  onSubmit(values) {
    this.props.saveParams(values)
    this.onClose()
  },

  render() {
    const { cellKey, removeCell } = this.props

    const schema = {
      type: 'object',
      properties: {
        title: {
          title: '标题',
          type: 'string'
        },
        background: {
          title: '背景',
          type: 'string'
        },
        width: {
          title: '宽',
          type: 'string'
        },
        height: {
          title: '高',
          type: 'string'
        },
        layers: {
          title: '层',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mode: {
                title: '布局形式',
                type: 'string',
                enum: [ '栅格布局', '绝对布局' ]
              },
              cols: {
                title: '列数',
                type: 'number'
              },
              yheight: {
                title: '行高度',
                type: 'number'
              },
              margin: {
                title: '间距',
                type: 'number'
              },
              verticalFree: {
                title: '自由摆放',
                type: 'boolean'
              }
            }
          }
        }
      }
    }

    const FormLayout = (props) => {
      const { children, invalid, handleSubmit, submitting, onClose, isCreate } = props
      const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
      return (
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onClose}>关闭</Button>
            <Button type="submit" disabled={invalid || submitting}  bsStyle="primary" onClick={handleSubmit}>保存</Button>
          </Modal.Footer>
        </form>
      )
    }

    return (
      <Modal show={this.props.show} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Dashboard属性设置</Modal.Title>
        </Modal.Header>
        <SchemaForm formKey="dashboard.params"
          schema={schema}
          initialValues={this.props.params}
          onSubmit={this.onSubmit}
          onClose={this.onClose}
          component={FormLayout}/>
      </Modal>
    )
  }

}))
