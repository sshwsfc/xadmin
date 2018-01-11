import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin-core'
import { Model, ModelWrap } from 'xadmin-model'
import Form from 'xadmin-model/lib/components/Form'

import { UserForgetPassword } from '../models'

export default StoreWrap('auth.forget_password')(({ onSuccess }) => {
  const UserForgetPasswordModel = Model(UserForgetPassword(app))
  const { _t } = app.context
  return (
    <div className="container">
      <UserForgetPasswordModel>
        <Form 
          successMessage={_t('Send reset password email success')}
          onSubmitSuccess={onSuccess} option={{ groupSize : { label: { sm: 3 }, control: { sm: 9 } } }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Panel className="panel-single" style={{ maxWidth: 450 }}>
                  <Panel.Heading>
                    <h1 style={{ fontSize: 24 }}>{_t('Reset Password')}</h1>
                  </Panel.Heading>
                  <Panel.Body>
                    {children}
                    <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                      <Icon name={icon}/> {_t('Send Email to Reset Password')}</Button>
                  </Panel.Body>
                </Panel>
              </form>
            )
          }}
        />
      </UserForgetPasswordModel>
    </div>
  )
})
