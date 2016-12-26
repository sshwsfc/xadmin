import React from 'react'
import { Link } from 'react-router'
import { Panel, Well, Button } from 'react-bootstrap'

import { Page, Icon } from '../../components'
import { Block, StoreWrap } from '../../index'
import { Model, ModelWrap } from '../../model/base'
import Form from '../../model/components/Form'
import { UserSignUp } from '../models'
import { app } from '../../index'

const SignUpForm = StoreWrap('auth.sign_up')(({ onSuccess }) => {
  const UserSignUpModel = Model(UserSignUp(app))
  const { _t } = app.context
  return (
    <div className="container">
      <UserSignUpModel>
        <Form 
          onSubmitSuccess={onSuccess} groupSize={{ label: 3, field: 9 }}
          componentClass={({ children, invalid, handleSubmit, submitting }) => {
            const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
            return (
              <form className="form-horizontal">
                <Panel header={<h1 style={{ fontSize: 24 }}>{_t('Please Signup')}</h1>} className="panel-single" style={{ maxWidth: 550 }}>
                  {children}
                  <Button disabled={invalid || submitting} onClick={handleSubmit} bsStyle="primary" bsSize="large" block>
                    <Icon name={icon}/> {_t('Signup')}</Button>
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
