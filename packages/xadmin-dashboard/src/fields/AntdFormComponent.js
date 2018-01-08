import React from 'react'
import { InputNumber, Input, Radio, Select, Checkbox, Switch, Icon } from 'antd'
import ComponentDataModal from './ComponentDataModal'
const RadioGroup = Radio.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

export default class AntdFormComponent extends React.Component {
  state = {
    InputValue: 'Basic usage',
    RadioValue: 1,

    ComponentDataModalVisible: false,
    DataJson: 'data:',
    InspectorData:''
  }
  InputNumberChange = (value) => {
    console.log('InputNumberonChange', value)
  }
  InputChange = (e) => {
    console.log('InputonChange', e.target.value)
    this.setState({
      InputValue: e.target.value
    })
  }
  RadioChange = (e) => {
    console.log('radio checked', e.target.value)
    this.setState({
      RadioValue: e.target.value
    })
  }
  CheckboxChange = (checkedValues) => {
    console.log('Checkbox checked',checkedValues)
  }
  SelectChange = (Selectvalue) => {
    console.log('Select',Selectvalue)
  }
  SwitchChange = (checked) => {
    console.log('Switch',checked)
  }
  // ComponentDataModal fn
  ComponentDataModalOk = () =>{
    this.setState({
      DataJson: 'data:'+this.state.InspectorData,
      ComponentDataModalVisible: false
    })
  }
  ComponentDataModalInspector = (e) => {
    this.setState({
      InspectorData: e.path
    })
  }
  DataModalChange = () => {
    // 绑定数据节点onChange
  }
  DataModalClick = () => {
    this.setState({
      ComponentDataModalVisible: true
    })
  }
  render() {
    const CheckboxOptions = ['Apple', 'Pear', 'Orange']
    const RadioOptions = [
      { name:'A', value:1 },
      { name:'B', value:2 },
      { name:'C', value:3 },
      { name:'D', value:4 }
    ]
    const SelectOptions =[
      { name:'jack', value:'jack' },
      { name:'tom', value:'tom' },
      { name:'lucy', value:'lucy' },
      { name:'Yiminghe', value:'Yiminghe' }
    ]
    return (
      <div className="form-wrap">
        <p>InputNumber数字输入框</p>
        <InputNumber min={1} max={10} defaultValue={3} onChange={this.InputNumberChange} />

        <p>Input输入框</p>
        <Input placeholder="Basic usage" value={this.state.InputValue} onChange={this.InputChange} />
        
        <p>Radio单选框</p>
        <RadioGroup onChange={this.RadioChange} value={this.state.RadioValue}>
          { RadioOptions.map((elm,index)=><Radio key={index} value={elm.value}>{elm.name}</Radio>) }
        </RadioGroup>
        
        <p>Checkbox多选框</p>
        <CheckboxGroup options={CheckboxOptions} onChange={this.CheckboxChange} />
        
        <p>Select下拉框</p>
        <Select defaultValue="lucy" style={{ width: 120 }} onChange={this.SelectChange}>
          { SelectOptions.map((elm,index)=><Option key={index} value={elm.value}>{elm.name}</Option>) }
        </Select>

        <p>开关</p>
        <Switch 
          checkedChildren={<Icon type="check" />} 
          unCheckedChildren={<Icon type="cross" />} 
          defaultChecked={false} 
          onChange={this.SwitchChange} />
        
        <p>选择数据节点</p>
        <Input 
          onChange={this.DataModalChange}
          addonAfter={<Icon onClick={this.DataModalClick} type="setting" />} 
          value={this.state.DataJson} />
        <ComponentDataModal
          visible={this.state.ComponentDataModalVisible}
          onOk={this.ComponentDataModalOk} 
          onCancel={()=>this.setState({ComponentDataModalVisible:false})} 
          InspectorClick={this.ComponentDataModalInspector}/>
      </div>
    )
  }

}