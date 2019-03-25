import React from 'react'
import { Card, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
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
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Card>
                  <Card.Body>
                    {children}
                    <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit}>
                      <Icon name={icon}/> {_t('Change Password')}</Button>
                  </Card.Body>
                </Card>
              </form>
            )
          }}
        />
      </Model>
    </Page>
  )
})
