import React from 'react'
import { NavDropdown } from 'react-bootstrap'

const THEMES = [
  'cerulean',
  'cosmo',
  'cyborg',
  'darkly',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'materia',
  'minty',
  'pulse',
  'sandstone',
  'simplex',
  'sketchy',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'yeti'
]

class ThemeSelect extends React.Component {
  state = { theme: null }

  render() {
    const { theme } = this.state
    return [
      (
        <NavDropdown title="Themes">
          <NavDropdown.Item eventKey="default" onSelect={()=>this.setState({ theme: null })}>Default</NavDropdown.Item>
          {THEMES.map(name => <NavDropdown.Item eventKey={name} onSelect={()=>this.setState({ theme: name })}>{name}</NavDropdown.Item>)}
        </NavDropdown>
      ),
      theme && <link href={`https://bootswatch.com/4/${theme}/bootstrap.min.css`} rel="stylesheet" />
    ]
  }
}

export default {
  name: 'app.themes',
  blocks: {
    'top.right': (props) => <ThemeSelect {...props} />
  }
}