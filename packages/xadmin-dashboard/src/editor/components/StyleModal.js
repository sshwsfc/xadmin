import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button, Grid, Row, Col } from 'react-bootstrap'
import { StoreWrap } from 'xadmin-core'
import CodeEditor from './CodeEditor'
import DashboardWrap from '../../wrap'

class StyleModal extends Component {

  state = { show: false, code: this.props.style }

  onClose = () => {
    this.setState({ show: false })
  }

  onChange = (newValue) => {
    this.setState({ code: newValue })
  }

  onSave = () => {
    this.props.onChange(this.state.code)
    this.onClose()
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.style != nextProps.style) {
      this.setState({ code: nextProps.style })
    }
  }

  render() {
    return (
      <Button style={{ marginTop: 5 }} eventKey={10} block href="#" onClick={()=>{this.setState({ show: true })}}><Icon name="retweet" /> 编辑样式
        <Modal show={this.state.show} onHide={this.onClose} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>修改组件属性</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CodeEditor
              height="500"
              language="less"
              code={this.state.code}
              onChange={this.onChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" bsStyle="primary" disabled={this.state.code==null} onClick={this.onSave}>保存</Button>
          </Modal.Footer>
        </Modal>
      </Button>
      )
  }

}

export default StyleModal
