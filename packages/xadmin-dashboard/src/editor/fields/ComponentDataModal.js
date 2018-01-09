import React from 'react'
import { Modal, Row, Col } from 'antd'
import Inspector from 'react-json-inspector'
import DashboardWrap from '../../wrap'

@DashboardWrap('dashboard.cell')
export default class ComponentDataModal extends React.Component {
  render() {
    const { data, visible } = this.props
    return (
      <Modal
        title="选择数据节点"
        closable={true}
        visible={visible}
        onOk={this.props.onOk}
        okText={'保存'}
        onCancel={this.props.onCancel}>
        <Row>
          <Col span={24} className="modal-left">
            <h3 className="modal-title">data.json</h3>
            <Inspector 
              className="sider-inspector"
              onClick={ this.props.InspectorClick }
              data={ data } />
          </Col>
        </Row>
      </Modal>
    )
  }

}
