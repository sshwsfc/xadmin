import React from 'react'
import _ from 'lodash'
import { Checkbox } from 'antd'
import app from 'xadmin'

export default class EnumFilter extends React.Component {

  constructor(props, context) {
    super(props, context)
    const value = props.input.value
    // like
    if(value) {
      if(typeof value != 'object') {
        this.state = { checks: [ value ] }
      } else {
        this.state = { checks: [ ...value['inq'] ] }
      }
    } else {
      this.state = { checks: [] }
    }
  }

  getValue(e) {
    const { checks } = this.state
    if(checks.length > 1) {
      return { inq: checks }
    } else if(checks.length > 0) {
      return checks[0]
    } else {
      return null
    }
  }

  onChange = (e, value) => {
    const { onChange } = this.props.input
    const { checks } = this.state
    let newChecks = checks
    if(e.target.checked) {
      if(checks.indexOf(value) == -1) {
        newChecks = [ ...checks, value ]
      }
    } else {
      if(checks.indexOf(value) >= 0) {
        newChecks = [ ..._.pull(checks, value) ]
      }
    }
    if(newChecks != checks) {
      this.setState({ checks: newChecks }, ()=>{
        onChange(this.getValue())
      })
    }
  }

  clear = () => {
    const { onChange } = this.props.input
    this.setState({ checks: [] }, ()=>{
      onChange(this.getValue())
    })
  }

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps
  }

  componentWillReceiveProps(nextProps) {
    if(this.props != nextProps) {
      const value = nextProps.input.value
      // like
      if(value) {
        if(typeof value != 'object') {
          this.setState({ checks: [ value ] })
        } else {
          this.setState({ checks: [ ...value['inq'] ] })
        }
      } else {
        this.setState({ checks: [] })
      }
    }
  }

  render() {
    const { input: { name, value, onBlur, onChange, ...inputProps }, field } = this.props
    const { checks } = this.state
    const { _t } = app.context 
    return (
      <>
        <Checkbox key="check-clear" id="check-clear"
          checked={checks.length==0} 
          onChange={(e)=>{
            if(e.target.checked) {
              this.clear()
            }
          }} {...inputProps} >{_t('All')}</Checkbox>
        {field.titleMap.map(option => { return (
          <Checkbox key={option.name} id={option.name}
            checked={checks.indexOf(option.value) >= 0} 
            onChange={(e)=>this.onChange(e, option.value)}
            {...inputProps} value={option.value} >{option.name}</Checkbox>) })}
      </>
    )
  }

}
