import React from 'react'
import { MenuItem } from 'react-bootstrap'

export default {
  blocks: {
    'model.list.header.menu': [ 
      () => <MenuItem divider />, 
      () => <MenuItem>Test</MenuItem>
    ]
  }
}
