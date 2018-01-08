import React from 'react'
import { Field } from 'redux-form'
import { FormControl, InputGroup, Button, Modal } from 'react-bootstrap'
import Inspector from 'react-json-inspector'
import { Icon } from 'antd'
import DashboardWrap from '../wrap'

@DashboardWrap('dashboard.textinput', {
  data: ({ dashboard }) => {
    return { data: dashboard.data }
  }
})
class TextModal extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      showModal : false,
      jsonPath : '',
      inputValue: ''
    }
  }
  // 获取json对象路径
  InspectorClick = (e) => {
    this.setState({
      jsonPath : 'data:' + e.path
    })
  }

  closeModal = () => {
    this.setState({
      showModal : false
    })
  }

  openModal = () => {
    this.setState({
      showModal : true
    })
  }

  getModalPath = () => {
    this.props.input.onChange(this.state.jsonPath)
    this.setState({
      showModal : false
    })
  }

  render(){
    const { data={}, input, label, meta, field, group: FieldGroup } = this.props

    return(
      <div style={{position:'relative'}}>
        <FieldGroup label={label} meta={meta} input={input} field={field} >
          <FormControl {...input} {...field.attrs}  />
          <Icon type="api" onClick={ this.openModal } style={{position:'absolute',right:'15px',top:'32px',fontSize:'20px'}}/>
        </FieldGroup>
        <Modal show={ this.state.showModal } onHide={ this.closeModal }>
          <Modal.Header closeButton>
            <Modal.Title>选择数据节点</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Inspector 
              className="header-inspector"
              onClick={ this.InspectorClick }
              data={ data } />
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={ this.getModalPath }>确定</Button>
            <Button onClick={ this.closeModal } >关闭</Button>
          </Modal.Footer>
        </Modal>
      </div>  
    )
  }
}

export default TextModal
