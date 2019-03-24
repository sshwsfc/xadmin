import React from 'react'
import _ from 'lodash'
import Icon from 'react-fontawesome'
import app from 'xadmin'
import { Nav, ButtonGroup, Card, Modal, Form, OverlayTrigger, Popover, Badge, Button, Col, Row, FormGroup, ControlLabel } from 'react-bootstrap'
import { C } from 'xadmin-ui'

const FilterForm = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      {children}
      {options && options.submitOnChange ? null : (
        <div style={{ textAlign: 'center' }}>
          <Button disabled={invalid || submitting} variant="primary" onClick={handleSubmit}>{_t('Search')}</Button>
          {' '}
          <Button disabled={submitting} onClick={resetFilter}>{_t('Clear')}</Button>
        </div>
      )}
    </Form>
  )
}

const NavForm = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form inline className="mr-3" onSubmit={handleSubmit}>
      {children}
      {options && options.submitOnChange ? null : (
        <>
          <Button className="ml-1" disabled={invalid || submitting} onClick={handleSubmit}>{_t('Search')}</Button>
          <Button className="ml-1" disabled={submitting} variant="light" onClick={resetFilter}>{_t('Clear')}</Button>
        </>
      )}
    </Form>
  )
}

const Submenu = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const { _t } = app.context
  return (
    <Form onSubmit={handleSubmit}>
      <Card className="mb-3">
        <Card.Body>
          <Row>
            {children}
          </Row>
          {options && options.submitOnChange ? null : (
            <Row>
              <Col style={{ textAlign: 'center' }} sm={12}>
                <Button disabled={invalid || submitting} size="sm" onClick={handleSubmit}>{_t('Search')}</Button>
                {' '}
                <Button disabled={submitting} onClick={resetFilter} size="sm" variant="light">{_t('Clear')}</Button>
              </Col>
            </Row> 
          )}
        </Card.Body>
      </Card>
    </Form>
  )
}

const FilterModal = ({ children, invalid, handleSubmit, submitting, options, resetFilter }) => {
  const [ show, setShow ] = React.useState(false) 
  const { _t } = app.context
  const close = () => setShow(false)

  return [
    (
      <Button key="filter.model" onClick={()=>setShow(true)} className="mr-1">
        <Icon name="filter" /> {_t('Filter')}
      </Button>
    ), (
      <Modal
        show={show} size="lg"
        onHide={close}
      >
        <Modal.Header closeButton>{_t('Filter Form')}</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>{children}</Form>
        </Modal.Body>
        {options && options.submitOnChange ? null : (
          <Modal.Footer>
            <Button key={1} disabled={invalid || submitting} onClick={()=>{
              handleSubmit()
              close()
            }}><Icon name="search" /> {_t('Search')}</Button>  
            <Button key={0} disabled={submitting} onClick={()=>{
              resetFilter()
              close()
            }} variant="light">{_t('Clear')}</Button>
          </Modal.Footer>
        )}
      </Modal>
    )
  ]
}

export {
  FilterForm, NavForm, Submenu, FilterModal
}
