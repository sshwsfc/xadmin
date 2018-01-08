import React from 'react'
import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'
import { FormControl, InputGroup } from 'react-bootstrap'

const ColorPickerField = React.createClass({

  render() {
    const { input, label, meta, field, group: FieldGroup } = this.props
    return (
      <FieldGroup label={label} meta={meta} input={input} field={field}>
        <FormControl.Static>
        <ColorPicker {...field.attrs} 
          animation="slide-up"
          color={input.value}
          defaultColor="#000"
          onChange={(colors) => {
            input.onChange(colors.color)
          }} 
        />
        </FormControl.Static>
      </FieldGroup>
    )
  }

})

export default ColorPickerField
