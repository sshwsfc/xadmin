import React from 'react'
import { Menu, Icon, Col, Row, Button, Popover, Progress , Modal, Tabs, Input, Select } from 'antd'
import Inspector from 'react-json-inspector'
import DashboardWrap from '../../wrap'
import CodeEditor from './CodeEditor'

@DashboardWrap('dashboard.cell')
class DataEditor extends React.Component {
  
  constructor(props, context) {
    super(props, context)
    this.state = {
      code: JSON.stringify(props.data, null, 2)
    }
  }

  onChange = (newValue) => {
    this.setState({ code: newValue })
  }

  onSave = () => {
    this.props.updateData(JSON.parse(this.state.code))
  }

  componentWillReceiveProps(props) {
    if(props.data) {
      this.setState({
        code: JSON.stringify(props.data, null, 2)
      })
    }
  }

  render() {
    return (
      <div>
        <h3 className="modal-title">编辑源码 <Button onClick={this.onSave}>保存</Button></h3>
        <CodeEditor
          height="680"
          language="json"
          code={this.state.code}
          onChange={this.onChange}
        />
      </div>
      )
  }

}

@DashboardWrap('dashboard.cell')
export default class DataModal extends React.Component {

  state = {
    codeShow: true
  }

  // modal
  handleOk = (e) => {
    this.props.onClose()
  }
  handleCancel = (e) => {
    this.props.onClose()
  }

  // InspectorClick
  InspectorClick = (e) => {
    console.log(e)
  }

  // code editor
  codeClick = () => {
    this.setState({
      codeShow: !this.state.codeShow
    })
  }

  render() {
    const selectBefore = (
      <Select defaultValue="Http://" style={{ width: 80 }}>
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
      </Select>
    )
    const { show, data, dispatchData } = this.props
    return (
      <Modal
        width={'80%'}
        title="数据源配置"
        closable={true}
        visible={show}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <Row>
          <Col span={6} className="modal-left">
            <h3 className="modal-title">data.json
              <Button 
                type="dashed" 
                onClick={this.codeClick}
                style={{ margin: 5, float: 'right' }} >{this.state.codeShow? '数据绑定' : '编辑源码'}</Button>
            </h3>
            <Inspector 
              className="header-inspector"
              onClick={ this.InspectorClick }
              data={ data } />
          </Col>
          { this.state.codeShow == false ?
            <Col span={18} className="modal-right">
            <h3 className="modal-title">数据绑定</h3>
            <p className="http">动态数据绑定：</p>
            <Input addonBefore={selectBefore}  defaultValue="mysite" />
          </Col>
          :
          <Col span={18} className="modal-right">
            <DataEditor />
          </Col>}
        </Row>
      </Modal>
    )
  }
}
