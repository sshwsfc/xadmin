import React from 'react'
import { Card, Container, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { _t } from 'xadmin-i18n'
import app from 'xadmin'

export default ({ error, children, invalid, handleSubmit, submitting }) => (
  <Container>
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
  </Container>
)
