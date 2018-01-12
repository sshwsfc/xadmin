import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin'
import { Model, ModelWrap } from 'xadmin-model'
import Form from 'xadmin-model/lib/components/Form'

import { UserSignUp } from '../models'

const SignUpForm = StoreWrap('auth.sign_up')(({ onSuccess }) => {
  const UserSignUpModel = Model(UserSignUp(app))
  const { _t } = app.context
  return (
    <div className="container">
      <UserSignUpModel>
        <Form 
          successMessage={_t('Register success')}
          onSubmitSuccess={onSuccess} option={{ groupSize : { label: { sm: 3 }, control: { sm: 9 } } }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal" onSubmit={handleSubmit}>
                <Panel className="panel-single" style={{ maxWidth: 550 }}>
                  <Panel.Heading>
                    <h1 style={{ fontSize: 24 }}>{_t('Please Signup')}</h1>
                  </Panel.Heading>
                  <Panel.Body>
                    {children}
                    <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                      <Icon name={icon}/> {_t('Signup')}</Button>
                    <div style={{ marginTop: 20 }}>{_t('Have account')}? <Link to="/login">{_t('please login')}</Link></div>
                  </Panel.Body>
                </Panel>
              </form>
            )
          }}
        />
      </UserSignUpModel>
    </div>
  )
})

export default SignUpForm
