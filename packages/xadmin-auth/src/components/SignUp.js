import React from 'react'
import { Card, Container, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import { C } from 'xadmin-ui'

import { UserSignUp } from '../models'

const SignUpForm = StoreWrap('auth.sign_up')(({ onSuccess }) => {
  const { _t } = app.context
  return (
    <Model schema={UserSignUp(app)}>
      <Container>
        <C is="Model.DataForm"
          successMessage={_t('Register success')}
          onSubmitSuccess={onSuccess}
          componentClass={({ error, children, invalid, handleSubmit, submitting }) => (
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <Card style={{ maxWidth: 450, margin: '5rem auto' }} >
                <Card.Body>
                  <Card.Title className="mb-4">
                    <h4>{_t('Please Signup')}</h4>
                  </Card.Title>
                  {children}
                  {error && <strong>{error}</strong>}
                  <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} block>
                    <Icon name={submitting ? 'spinner fa-spin' : 'sign-in'}/> {_t('Signup')}</Button>
                  <div className="mt-3">{_t('Have account')}? <a href="#" onClick={()=>app.go('/login')}>{_t('please login')}</a></div>
                </Card.Body>
              </Card>
            </form>
          )
          }
        />
      </Container>
    </Model>
  )
})

export default SignUpForm
