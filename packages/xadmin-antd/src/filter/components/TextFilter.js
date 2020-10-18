import React from 'react'
import { config, use } from 'xadmin'
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { AimOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Tooltip, Typography } from 'antd'
const Search = Input.Search

const useTextFilter = ({ input }) => {
  const { form } = use('form')
  let value = input.value
  let like = null
  
  if(value == null || value == undefined || value == '') {
    value = ''
    like = config('filter') && config('filter').textDefaultSearch == true
  } else if(value && value.like !== undefined) {
    value = value.like
    like = true
  } else {
    like = false
  }

  const onChange = ({ value, like }) => {
    if(like) {
      input.onChange({ like: value })
    } else {
      input.onChange(value)
    }
  }

  const onValueChange = value => {
    if(like) {
      input.onChange({ like: value })
    } else {
      input.onChange(value)
    }
  }

  const onLikeChange = (like) => {
    if(like) {
      input.onChange({ like: value })
    } else {
      input.onChange(value)
    }
  }

  const onKeyPress = (e) => {
    if(value && e.key === 'Enter') {
      form.submit()
    }
  }

  const clear = () => onValueChange(null)
  const changeModeBtn = (<Tooltip title={_t('Exact search')}>
    <Typography.Text type={!like ? 'success' : 'secondary'} onClick={()=>onLikeChange(!like)} style={{ cursor: 'pointer' }}>
      { (value == null || value == undefined || value == '') ? null : <AimOutlined /> }
    </Typography.Text>
  </Tooltip>)

  return { like, value, onChange, onValueChange, onLikeChange, onKeyPress, clear, changeModeBtn }
}

const TextFilter = props => {

  const { input: { name, onBlur, onChange, ...inputProps }, label, field } = props
  const { value, changeModeBtn, onValueChange, onKeyPress } = useTextFilter(props)

  return (
    <Input { ...inputProps} {...field.attrs} value={value} suffix={changeModeBtn}
      onChange={e => onValueChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={_t('Search {{label}}', { label })}
    />
  )

}


const SearchTextFilter = props => {

  const { input: { name, onBlur, onChange, ...inputProps }, onSubmit, label, field } = props
  const { value, changeModeBtn, onValueChange } = useTextFilter(props)
  
  return (
    <Search { ...inputProps} {...field.attrs} value={value} suffix={changeModeBtn}
      onChange={e => onValueChange(e.target.value)}
      onSearch={value => { onValueChange(value); onSubmit && onSubmit() }}
      placeholder={_t('Search {{label}}', { label })}
    />
  )
}

const SubmitOnChangeWrap = ({ input, ...props }) => {
  const [ state, setState ] = React.useState({ value: null, typing: false })

  React.useEffect(() => {
    if(!state.typing) {
      setState({ value: input.value, typing: false })
    }
  }, [ input.value ])


  const onSubmit = () => {
    input.onChange(state.value)
    setState({ ...state, typing: false })
  }

  const onChange = value => setState({ value, typing: true })

  return <SearchTextFilter input={{ ...input, onChange: onChange, value: state.value }} {...props} onSubmit={onSubmit} />
}

export default ({ option, ...props }) => {
  const submitOnChange = option && option.options && option.options.submitOnChange
  return submitOnChange ? <SubmitOnChangeWrap {...props} option={option} /> : <TextFilter {...props} option={option}/>
}
