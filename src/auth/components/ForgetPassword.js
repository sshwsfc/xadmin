import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, StoreWrap } from '../../index'
import { Model, ModelWrap } from '../../model/base'
import Form from '../../model/components/Form'
import { UserForgetPassword } from '../models'
import { app } from '../../index'

export default StoreWrap('auth.forget_password')(({ onSuccess }) => {
  const UserForgetPasswordModel = Model(UserForgetPassword(app))
  const { _t } = app.context
  return (
    <div className="container">
      <UserForgetPasswordModel>
        <Form 
          onSubmitSuccess={onSuccess} groupSize={{ label: 3, field: 9 }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal">
                <Panel header={<h1 style={{ fontSize: 24 }}>{_t('Reset Password')}</h1>} className="panel-single" style={{ maxWidth: 450 }}>
                  {children}
                  <Button disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                    <Icon name={icon}/> {_t('Send Email to Reset Password')}</Button>
                </Panel>
              </form>
            )
          }}
        />
      </UserForgetPasswordModel>
    </div>
  )
})
