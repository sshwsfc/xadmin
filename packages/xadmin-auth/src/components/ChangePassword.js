import React from 'react'
import { use, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { Page, C } from 'xadmin-ui'

import { UserChangePassword } from '../models'

const ChangePassword = props => {
  const { _t } = app.context
  const { onChange } = use('auth.change_password', props)
  return (
    <C is="Model.DataForm"
      onSubmit={onChange}
      submitText={_t('Change Password')}
      component={C('Auth.ChangePassword') || C('Auth.Form')}
    />
  )
}

export default props => {
  const { _t } = app.context
  return (
    <Page title={_t('Change Password')}>
      <Model schema={UserChangePassword(app)}>
        <ChangePassword {...props} />
      </Model>
    </Page>
  )
}
