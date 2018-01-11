import React from 'react'
import MonacoEditor from 'react-monaco-editor'

class CodeEditor extends React.Component {

  render() {
    const { code, onChange, editorOptions, ...props } = this.props

    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false,
      ...editorOptions
    }

    return (
        <MonacoEditor
          language="json"
          value={code}
          options={options}
          requireConfig={{
            url: '/vs/loader.js',
            paths: {
              'vs': '/vs'
            }
          }}
          {...props}
          onChange={onChange}
        />
      )
  }

}

export default CodeEditor
