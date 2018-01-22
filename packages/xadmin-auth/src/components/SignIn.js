import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin'
import { Model, ModelWrap } from 'xadmin-model'
import Form from 'xadmin-model/lib/components/Form'

import { UserSignIn } from '../models'

const SignInForm = StoreWrap('auth.sign_in')(({ onSignIn }) => {
  const UserSignInModel = Model(UserSignIn(app))
  const { _t } = app.context
  const { auth } = app.load_dict('config')
  return (
    <div className="container">
      <UserSignInModel>
        <Form 
          onSubmit={onSignIn} option={{ groupSize : { label: { sm: 3 }, control: { sm: 9 } } }}
          componentClass={({ error, children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'sign-in'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Panel className="panel-single" style={{ maxWidth: 450 }}>
                  <Panel.Heading>
                    <h1 style={{ fontSize: 24 }}>{_t('Please Login')}</h1>
                  </Panel.Heading>
                  <Panel.Body>
                    {children}
                    {error && <strong>{error}</strong>}
                    <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                      <Icon name={icon}/> {_t('Login')}</Button>
                    { auth.can_signup && (<div style={{ marginTop: 20 }}>{_t('Not registed')}? <Link to="/signup">{_t('please signup')}</Link></div>) }
                    { auth.can_reset_password && (<div style={{ marginTop: 10 }}>{_t('Forgot password')}? <Link to="/forget_password">{_t('reset password')}</Link></div>) }
                  </Panel.Body>
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
