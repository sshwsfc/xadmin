import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, StoreWrap } from '../../index'
import { Model, ModelWrap } from '../../model/base'
import Form from '../../model/components/Form'
import { UserSignIn } from '../models'
import { app } from '../../index'

const SignInForm = StoreWrap('auth.sign_in')(({ onSignIn }) => {
  const UserSignInModel = Model(UserSignIn(app))
  const { _t } = app.context
  return (
    <div className="container">
      <UserSignInModel>
        <Form 
          onSubmit={onSignIn} groupSize={{ label: 3, field: 9 }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal">
                <Panel header={<h1 style={{ fontSize: 24 }}>{_t('Please Login')}</h1>} className="panel-single" style={{ maxWidth: 450 }}>
                  {children}
                  <Button disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                    <Icon name={icon}/> {_t('Login')}</Button>
                  <div style={{ marginTop: 20 }}>{_t('Not registed')}? <Link to="/signup">{_t('please signup')}</Link></div>
                  <div style={{ marginTop: 10 }}>{_t('Forgot password')}? <Link to="/forget_password">{_t('reset password')}</Link></div>
                </Panel>
              </form>
            )
          }}
        />
      </UserSignInModel>
    </div>
  )
})

export default SignInForm
