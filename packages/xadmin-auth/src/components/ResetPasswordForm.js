import React from 'react'
import { Card, Container, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { StoreWrap, app } from 'xadmin'
import { Model } from 'xadmin-model'
import ModelForm from 'xadmin-model/lib/components/Form'

import { UserResetPassword } from '../models'

export default StoreWrap('auth.reset_password')(({ onSuccess, location: { query } }) => {
  const { _t } = app.context
  return (
    <Model schema={UserResetPassword(app)}>
      <Container>
        <ModelForm 
          initialValues={query}
          successMessage={_t('Reset password success')}
          onSubmitSuccess={onSuccess} option={{ groupSize : { label: { sm: 3 }, control: { sm: 9 } } }}
          componentClass={({ error, children, invalid, handleSubmit, submitting }) => (
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <Card style={{ maxWidth: 450, margin: '5rem auto' }} >
                <Card.Body>
                  <Card.Title className="mb-4">
                    <h4>{_t('Reset Password')}</h4>
                  </Card.Title>
                  {children}
                  {error && <strong>{error}</strong>}
                  <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit} block>
                    <Icon name={submitting ? 'spinner fa-spin' : 'sign-in'}/> {_t('Reset Password')}</Button>
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
