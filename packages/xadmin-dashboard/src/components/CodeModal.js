import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Page, Icon } from 'xadmin/lib/components'
import { Modal, Navbar, Nav, NavItem, NavDropdown, MenuItem, Panel, Well, Button, Grid, Row, Col } from 'react-bootstrap'
import { StoreWrap } from 'xadmin/lib/index'
import CodeEditor from './CodeEditor'

const CodeModal = React.createClass({

  getInitialState() {
    return { show: false, code: JSON.stringify(this.props.params, null, 2) }
  },

  onClose() {
    this.setState({ show: false })
  },

  onChange(newValue) {
    this.setState({ code: newValue })
  },

  onSave() {
    this.props.onChange(JSON.parse(this.state.code))
    this.onClose()
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.params != nextProps.params) {
      this.setState({ code: JSON.stringify(nextProps.params, null, 2) })
    }
  },

  render() {
    return (
      <Button style={{ marginTop: 5 }} eventKey={10} block href="#" onClick={()=>{this.setState({ show: true })}}><Icon name="retweet" /> 编辑代码
        <Modal show={this.state.show} onHide={this.onClose} bsSize="large">
          <Modal.Header closeButton>
            <Modal.Title>修改组件属性</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CodeEditor
              height="500"
              language="json"
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

})

export default CodeModal
