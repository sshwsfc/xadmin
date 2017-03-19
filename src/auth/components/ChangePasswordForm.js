import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, StoreWrap } from '../../index'
import { Model, ModelWrap } from '../../model/base'
import Form from '../../model/components/Form'
import { UserChangePassword } from '../models'
import { app } from '../../index'

export default StoreWrap('auth.change_password')(({ onChange }) => {
  const ChangePasswordModel = Model(UserChangePassword(app))
  const { _t } = app.context
  return (
    <Page title={_t('Change Password')}>
      <ChangePasswordModel>
        <Form 
          onSubmit={onChange}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Panel>{children}</Panel>
                <Well bsSize="small">
                  <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary">
                    <Icon name={icon}/> {_t('Change Password')}</Button>
                </Well>
              </form>
            )
          }}
        />
      </ChangePasswordModel>
    </Page>
  )
})
