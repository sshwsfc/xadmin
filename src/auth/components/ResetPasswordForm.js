import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, StoreWrap } from '../../index'
import { Model, ModelWrap } from '../../model/base'
import Form from '../../model/components/Form'
import { UserResetPassword } from '../models'
import { app } from '../../index'

export default StoreWrap('auth.reset_password')(({ onSuccess, location: { query } }) => {
  const ResetPasswordModel = Model(UserResetPassword(app))
  const { _t } = app.context
  return (
    <div className="container">
      <ResetPasswordModel>
        <Form 
          initialValues={query}
          successMessage={_t('Reset password success')}
          onSubmitSuccess={onSuccess} groupSize={{ label: 3, field: 9 }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Panel header={<h1 style={{ fontSize: 24 }}>{_t('Reset Password')}</h1>} className="panel-single" style={{ maxWidth: 450 }}>
                  {children}
                  <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                    <Icon name={icon}/> {_t('Reset Password')}</Button>
                </Panel>
              </form>
            )
          }}
        />
      </ResetPasswordModel>
    </div>
  )
})
