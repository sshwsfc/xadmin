import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin'
import { Model, ModelWrap } from 'xadmin-model'
import Form from 'xadmin-model/lib/components/Form'
import { Page } from 'xadmin-layout'
import { UserChangePassword } from '../models'

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
                <Panel><Panel.Body>{children}</Panel.Body></Panel>
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
