import React from 'react'
import { connect } from 'react-redux'
import { Icon } from '../../components'
import { Link } from 'react-router'
import { Pagination } from 'react-bootstrap'
import { block } from '../../plugin'
import { ModelMixin } from '../base'
import _ from 'lodash'
import { fetchItems } from '../../model/actions'

const ModelPagination = React.createClass({

  propTypes: {
    items: React.PropTypes.number.isRequired,
    activePage: React.PropTypes.number.isRequired,
    bsSize: React.PropTypes.string,
    onChangePage: React.PropTypes.func.isRequired
  },

  render() {
    if(this.props.items > 1) {
      return <Pagination
            style={{marginTop: 0}}
            bsSize={this.props.bsSize}
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={this.props.items}
            activePage={this.props.activePage}
            onSelect={this.props.onChangePage}
            maxButtons={5} />
    } else {
      return (
        <ul style={{marginTop:0}} className='pagination pagination-sm'>
          <li className='disabled'><a>无分页</a></li>
        </ul>
        )
    }
  }

})

const stateMap = (state) => {
  const count = state.count
  const { limit, skip } = state.filter
  
  return {
    items: Math.ceil(count / limit),
    activePage: Math.floor(skip / limit) + 1
  }
}

const dispatchMap = (dispatch) => {
  return { 
    onChangePage: (e, selectedEvent) => {
      e.preventDefault()
      const page = selectedEvent.eventKey

      return dispatch((dispatch, getState) => {
        const pageSize = getState().filter.limit
        return dispatch(fetchItems({skip: pageSize * (page - 1)}))
      })
    }
  }
}

module.exports = connect(stateMap, dispatchMap)(ModelPagination)
