import React from 'react'
import { Card, Button } from 'react-bootstrap'
import Icon from 'react-fontawesome'
import { _t } from 'xadmin-i18n'

export default ({ children, invalid, handleSubmit, submitting }) => {
  const icon = submitting ? 'spinner fa-spin' : 'floppy-o'
  return (
    <form className="form-horizontal" onSubmit={handleSubmit}>
      <Card>
        <Card.Body>
          {children}
          <Button type="submit" disabled={invalid || submitting} onClick={handleSubmit}>
            <Icon name={icon}/> {_t('Change Password')}</Button>
        </Card.Body>
      </Card>
    </form>
  )
}
