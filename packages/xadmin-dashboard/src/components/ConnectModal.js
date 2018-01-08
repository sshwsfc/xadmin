import React from 'react'
import { NavItem, Panel, Button, FormGroup, ControlLabel, FormControl, HelpBlock, Modal } from 'react-bootstrap'
import { SchemaForm, fieldBuilder } from 'xadmin/lib/form'
import DashboardWrap from '../wrap'
import CodeEditor from './CodeEditor'

const FuncEditorField = ({ input, label, meta, field, group: FieldGroup }) => {
  return (
    <FieldGroup label={label} meta={meta} input={input} field={field}>
      <Panel><CodeEditor
        height="200"
        language="javascript"
        code={input.value}
        onChange={input.onChange}
      /></Panel>
    </FieldGroup>
  )
}

export default DashboardWrap('dashboard.endpoint')(React.createClass({

  onClose() {
    this.props.onClose()
  },

  onSubmit(values) {
    this.props.saveEndpoint(values)
    this.onClose()
  },

  render() {
    const schema = {
      type: 'object',
      properties: {
        url: {
          title: 'API URL',
          type: 'string'
        },
        method: {
          title: '请求方式',
          type: 'string',
          enum: [ 'GET', 'POST' ]
        },
        dataType: {
          title: '数据格式',
          type: 'string',
          enum: [ 'form-urlencode', 'json', 'xml' ]
        },
        resultType: {
          title: '返回格式',
          type: 'string',
          enum: [ 'text', 'json', 'xml' ]
        },
        period: {
          title: '请求周期',
          type: 'number',
          description: '秒数'
        },
        params: {
          title: '请求参数',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                title: '参数名称',
                type: 'string'
              },
              value: {
                title: '参数值',
                type: 'string'
              }
            }
          }
        },
        dataPath: {
          title: '绑定数据点',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                title: '数据路径',
                type: 'string'
              },
              value: {
                title: '绑定路径',
                type: 'string'
              }
            }
          }
        },
        dataFunc: {
          title: '数据处理',
          type: 'string',
          format: 'code'
        }
      },
      form: [ '*', { key: 'dataFunc', component: FuncEditorField } ]
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
          <Modal.Title>数据接口管理</Modal.Title>
        </Modal.Header>
        <SchemaForm formKey="dashboard.endpoints"
          schema={schema}
          initialValues={this.props.endpoints}
          onSubmit={this.onSubmit}
          onClose={this.onClose}
          component={FormLayout}/>
      </Modal>
    )
  }

}))
