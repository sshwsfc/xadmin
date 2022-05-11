import React from 'react'
import Main from './Main'
import App from './App'
import Dashboard from './Dashboard'
import Page from './Page'
import Loading from './Loading'
import { AlertOutlined } from '@ant-design/icons'

const Icon = ({ name, ...props }) => <AlertOutlined type={name} {...props} />

export { Main, App, Page, Loading, Icon, Dashboard }
