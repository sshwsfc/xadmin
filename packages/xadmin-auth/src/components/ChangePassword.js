import React from 'react'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { Page, C } from 'xadmin-ui'

import { UserChangePassword } from '../models'

export default StoreWrap('auth.change_password')(({ onChange }) => {
  const { _t } = app.context
  return (
    <Page title={_t('Change Password')}>
      <Model schema={UserChangePassword(app)}>
        <C is="Model.DataForm"
          onSubmit={onChange}
          submitText={_t('Change Password')}
          component={C('Auth.ChangePassword') || C('Auth.Form')}
        />
      </Model>
    </Page>
  )
})
