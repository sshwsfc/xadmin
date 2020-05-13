import React from 'react'
import { config } from 'xadmin'
import _ from 'lodash'
import { _t } from 'xadmin-i18n'
import { FileSearchOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Tooltip } from 'antd'
const Search = Input.Search

const useTextFilter = ({ input }) => {

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

  const clear = () => onValueChange(null)
  const Icon = like ? FileSearchOutlined : SearchOutlined
  const prefix = <Tooltip title={_t(like ? 'Fuzzy search' : 'Exact Search')}><Icon onClick={()=>onLikeChange(!like)} style={{ color: 'rgba(0,0,0,.25)' }} /></Tooltip>

  return { like, value, onChange, onValueChange, onLikeChange, clear, prefix }
}

const TextFilter = props => {

  const { input: { name, onBlur, onChange, ...inputProps }, label, field } = props
  const { value, prefix, onValueChange } = useTextFilter(props)

  return (
    <Input { ...inputProps} {...field.attrs} value={value} prefix={prefix}
      onChange={e => onValueChange(e.target.value)}
      placeholder={_t('Search {{label}}', { label })}
    />
  )

}


const SearchTextFilter = props => {

  const { input: { name, onBlur, onChange, ...inputProps }, onSubmit, label, field } = props
  const { value, prefix, onValueChange } = useTextFilter(props)
  
  return (
    <Search { ...inputProps} {...field.attrs} value={value} prefix={prefix}
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
