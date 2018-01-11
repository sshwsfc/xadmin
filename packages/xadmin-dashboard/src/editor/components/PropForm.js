import React from 'react'
import _ from 'lodash'
import { Nav, NavItem, Tabs, Tab, Panel, Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { SchemaForm, fieldBuilder } from 'xadmin-form'
import { app, StoreWrap } from 'xadmin-core'
import datasources from '../../datasources'
import CodeModal from './CodeModal'
import DashboardWrap from '../../wrap'
import AntdFormComponent from '../fields/AntdFormComponent'
import StyleModal from './StyleModal'
import CodeEditor from './CodeEditor'
import animations from './animations.json'

const FieldGroup = ({ label, meta, input, field, children }) => {
  const attrs = field.attrs || {}
  const error = meta.touched && meta.error
  const help = field.description || field.help

  const controlComponent = children ? children : (<FormControl {...input} {...attrs} />)
  return (
    <FormGroup controlId={input.name}>
      <ControlLabel>{label}</ControlLabel>
      {controlComponent}
      <FormControl.Feedback />
      {help && <HelpBlock>{help}</HelpBlock>}
      {error && <HelpBlock>{error}</HelpBlock>}
    </FormGroup>
    )
}

const FormLayout = (props) => {
  const { children, invalid, handleSubmit, submitSucceeded, submitting, isCreate } = props
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  return (
    <form>
      {children}
      <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" block>
        <Icon name={icon}/> 保存</Button>
    </form>
  )
}

class CellProps extends React.Component {

  formLayout = (props) => {
    const { params={}, cellKey } = this.props
    const { children, invalid, handleSubmit, submitSucceeded, submitting, isCreate } = props
    const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
    return (
      <form>
        {children}
        <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" block>
          <Icon name={icon}/> 保存</Button>
        <CodeModal params={params} onChange={this.saveParams.bind(this)} />
      </form>
    )
  }

  saveParams(values) {
    this.props.saveParams(values)
    this.props.onClose && this.props.onClose()
  }

  render() {
    const { params, cellKey } = this.props
    let schema

    if(params && params.type) {
      const Widget = app.load_dict('dashboard_widgets')[params.type]
      schema = Widget && Widget.ParamSchema
      if(_.isFunction(schema)) {
        schema = schema(this.props)
      }
    }

    return schema ? (<SchemaForm formKey={`form-params-${cellKey}`}
          schema={{
            ...schema,
            properties: {
              name: { title: '组件名称', type: 'string' },
              ...schema.properties,
              __display__: { title: '显示逻辑', type: 'string' }
            }
          }}
          initialValues={params}
          group={FieldGroup}
          onSubmit={this.saveParams}
          component={this.formLayout}/>) : <div>没有可配置项</div>
  }

}

@DashboardWrap('cell.layout.props', {
  data: ({ dashboard }, { cellKey }) => {
    return {
      parent: dashboard.cells[dashboard.cells[cellKey] ? dashboard.cells[cellKey].parent : null]
    }
  }, 
  method: {
    saveLayoutParam: ({ dispatch, dashboard }, { cellKey }) => (params) => {
      const key = dashboard.cells[cellKey].parent
      dispatch({ dashboard, type: '@@x-dashboard/MERGE_CELL', key, params })
    }
  }
})
class LayoutProps extends React.Component {
  
  formLayout = (props) => {
    const { cellKey, parent } = this.props
    const { children, invalid, handleSubmit, submitSucceeded, submitting, isCreate } = props
    const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
    return (
      <form>
        {children}
        <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" block>
          <Icon name={icon}/> 保存</Button>
      </form>
    )
  }

  saveParams(values) {
    const { params, cellKey, parent } = this.props

    if(parent && parent.type) {
      const Container = app.load_dict('dashboard_widgets')[parent.type]
      if(Container && Container.saveChildLayout) {
        const parentParams = Container.saveChildLayout(parent, cellKey, values)
        this.props.saveLayoutParam(parentParams)
      }
    }

    this.props.onClose && this.props.onClose()
  }

  render() {
    const { params, cellKey, parent } = this.props

    if(parent && parent.type) {
      const Container = app.load_dict('dashboard_widgets')[parent.type]
      let schema = Container && Container.LayoutSchema

      if(_.isFunction(schema)) {
        schema = schema(this.props)
      }
  
      if(schema && Container.getChildLayout && Container.saveChildLayout) {
        const layout = Container.getChildLayout(parent, cellKey)
        return (<SchemaForm formKey={`form-layout-${cellKey}`}
              schema={schema}
              initialValues={_.clone(layout)}
              group={FieldGroup}
              onSubmit={this.saveParams.bind(this)}
              component={this.formLayout}/>)
      }
    }

    return <div>没有可配置项</div>
  }

}

class AnimateProps extends React.Component {

  saveParams = (values) => {
    this.props.mergeParams({ animate: values })
  }

  render() {
    const { params, cellKey } = this.props
    return (<SchemaForm formKey={`form-animate-${cellKey}`}
          schema={AnimateSchema}
          initialValues={_.clone(params.animate)}
          group={FieldGroup}
          onSubmit={this.saveParams}
          component={FormLayout}/>)
  }

}

const inAnimates = _.unionBy(animations.in, animations.foucs, 'value')
const outAnimates = _.unionBy(animations.out, animations.foucs, 'value')

const AnimateSchema = {
  type: 'object',
  properties: {
    active: {
      type: 'boolean',
      title: '启用动画'
    },
    enterAnimation: {
      type: 'string',
      title: '进场动画',
      enum: inAnimates.map(a => a.value),
      enum_title: inAnimates.map(a => a.name)
    },
    enterDuration: {
      type: 'number',
      title: '进场动画时长'
    },
    exitAnimation: {
      type: 'string',
      title: '出场动画',
      enum: outAnimates.map(a => a.value),
      enum_title: outAnimates.map(a => a.name)
    },
    exitDuration: {
      type: 'number',
      title: '出场动画时长'
    }
  },
  form: [ '*' ]
}

class CellEvents extends React.Component {

  formLayout = (props) => {
    const { params={}, cellKey } = this.props
    const { children, invalid, handleSubmit, submitSucceeded, submitting, isCreate } = props
    const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
    return (
      <form>
        {children}
        <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" block>
          <Icon name={icon}/> 保存</Button>
        <CodeModal params={params} onChange={this.save.bind(this)} />
      </form>
    )
  }

  save(values) {
    this.props.saveEvents(values)
    this.props.onClose && this.props.onClose()
  }

  render() {
    const { params, cellKey } = this.props
    let schema

    if(params && params.type) {
      const Widget = app.load_dict('dashboard_widgets')[params.type]
      schema = Widget && Widget.EventSchema
      if(_.isFunction(schema)) {
        schema = schema(this.props)
      }
    }

    return schema ? (<SchemaForm formKey={`form-events-${cellKey}`}
          schema={schema}
          initialValues={params.events}
          group={FieldGroup}
          onSubmit={this.save}
          component={this.formLayout}/>) : <div>没有可配置的事件</div>
  }

}

class CellStyle extends React.Component {
  
  state = { code: this.props.params.style || '' }

  onChange = (newValue) => {
    this.setState({ code: newValue })
    setTimeout(() => {
      this.onSave()
    }, 500)
  }

  onSave = () => {
    this.props.mergeParams({ style: this.state.code })
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.params != nextProps.params) {
      this.setState({ code: nextProps.params.style || '' })
    }
  }

  render() {
    return (
      <div>
        <CodeEditor
          width="100%"
          height={500}
          language="css"
          code={this.state.code}
          onChange={this.onChange}
          editorOptions={{
            lineNumbers: 'off'
          }}
        />
        <Button block bsStyle="primary" disabled={this.state.code==null} onClick={this.onSave}>保存</Button>
      </div>
    )
  }

}

class CellDatasource extends React.Component {

  render() {
    return (
      <select>
      {Object.keys(datasources).map(key => <option>{datasources[key].name}</option>)}
      </select>
    )
  }

}

@DashboardWrap('dashboard.form')
export default class PropForm extends React.Component {

  state = { activeKey: 'base' }

  handleSelect = (eventKey) => {
    this.setState({ activeKey: eventKey })
  }

  render() {
    const { cellKey, removeCell, params } = this.props
    if(!cellKey || !params) {
      return <div>请选择组件</div>
    }
    const key = this.state.activeKey

    return (
      <div>
        <Nav bsStyle="tabs" activeKey={key} onSelect={this.handleSelect}>
          <NavItem eventKey="base" title="基本">基本</NavItem>
          <NavItem eventKey="layout" title="布局">布局</NavItem>
          <NavItem eventKey="animate" title="样式">动画</NavItem>
          <NavItem eventKey="style" title="样式">样式</NavItem>
          <NavItem eventKey="event" title="事件">事件</NavItem>
        </Nav>
        <div style={{ paddingTop: 10 }}>
          {key == 'base' ? <CellProps {...this.props} /> : null}
          {key == 'layout' ? <LayoutProps {...this.props} /> : null}
          {key == 'animate' ? <AnimateProps {...this.props} /> : null}
          {key == 'style' ? <CellStyle {...this.props} /> : null}
          {key == 'event' ? <CellEvents {...this.props} /> : null}
        </div>
      </div>
    )
  }

}
