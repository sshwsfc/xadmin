import React from 'react'
import app from 'xadmin'
import { Main, App, Page, Loading, Icon } from './layout'

import components from './components'

export default {
  name: 'xadmin.ui.bootstrap',
  components: {
    Main, App, Page, Loading, Icon,
    ...components
  }
}
