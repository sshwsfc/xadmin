import _ from 'lodash'
import React from 'react'
import { Button, Dropdown, Menu, Popover, Checkbox, Row, Col, Input, Space } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { app, use } from 'xadmin'
import { _t } from 'xadmin-i18n'
import { ModelBlock } from 'xadmin-model'

const CountButton = props => {
  const { count } = use('model.count', props)
  return <Button>{_t('{{count}} records', { count })}</Button>
}

const PageSizeButton = props => {
  const { size, sizes, setPageSize } = use('model.pagesize', props)
  const [ visible, setVisible ] = React.useState(false)
  const [ inputSize, setInputSize ] = React.useState('')
  const input = React.createRef()

  const onSetPageSize = (size) => {
    setPageSize(size)
    setVisible(false)
  }

  const onInputSize = (e) => {
    if (e.key == 'Enter') {
      const size = parseInt(inputSize)
      onSetPageSize(size)
      setInputSize('')
    }
    e.persist()
  }

  return (
    <Dropdown key="page-size-dropdown" onVisibleChange={setVisible} visible={visible} overlay={(
      <Menu>
        {sizes.map(size => <Menu.Item key={`size-${size}`} onClick={()=>setPageSize(size)} eventKey={`size-${size}`}>{_t('Set {{size}} per page', { size })}</Menu.Item>)}
        <Menu.Item key="size-custom">
          <Input placeholder={_t('Customize page size')} value={inputSize} onChange={e => setInputSize(e.target.value)} precision={0} onKeyPress={onInputSize} style={{ width: 100 }}/>
        </Menu.Item>
      </Menu>
    )}>
      <Button>
        {_t('{{size}} per page', { size })}
      </Button>
    </Dropdown>
  )
}

const ColsDropdown = props => {
  const { selected, fields, changeFieldDisplay } = use('model.fields', props)

  let items = []
  const showFields = Object.keys(fields).filter(name => fields[name].showInList !== false)
  const menuShow = showFields.length <= 10

  for (let name of showFields) {
    let field = fields[name]
      , fieldName = name
      , title = field.title || name
      , fieldSelected = _.indexOf(selected, name) !== -1
      , onClick = (e) => {
        changeFieldDisplay([ fieldName, e.target.checked ])
      }, onClickBtn = () => {
        changeFieldDisplay([ fieldName, !fieldSelected ])
      }
    if(menuShow) {
      items.push(<Checkbox key={name} onChange={onClick} checked={fieldSelected}>{title}</Checkbox>)
    } else {
      items.push((
        <Col span={3} key={name} style={{ margin: '5px 0' }}>
          <Button type={fieldSelected?'primary':'default'} block onClick={onClickBtn}>{title}</Button>
        </Col>))
    }
  }

  return (
    <Popover placement="bottomRight" overlayStyle={{ maxWidth: '80%' }} content={(
      menuShow ? items :
        <Row gutter={12}>{items}</Row>
    )} trigger="click">
      <Button type="text"><SettingOutlined /></Button>
    </Popover>
  )
}

export default ({ children }) => (
  <Space>
    <CountButton />
    <PageSizeButton />
    <ModelBlock name="model.list.submenu.btngroup" />
    <ColsDropdown />
    {children}
  </Space>
)
