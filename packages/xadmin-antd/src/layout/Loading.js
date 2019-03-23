import { Spin, Card } from 'antd'
import React from 'react'

export default (props) => props.children ? <Spin {...props} /> : <Card style={{ width: '100%', textAlign: 'center' }}><Spin {...props} /></Card>
