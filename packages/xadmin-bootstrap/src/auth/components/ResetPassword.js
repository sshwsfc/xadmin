import React from 'react'
import { Card, Container, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { _t } from 'xadmin-i18n'

export default ({ error, children, invalid, handleSubmit, submitting }) => (
  <Container>
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
  </Container>
)
