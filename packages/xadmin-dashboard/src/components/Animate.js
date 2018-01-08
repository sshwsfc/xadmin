import React, { PropTypes } from 'react'
import { Transition } from 'react-transition-group' 

class Animation extends React.Component {
  constructor(props) {
    super(props)
  }
  renderStyle(id, enterAnimation, enterDuration, exitAnimation, exitDuration) {
    return (
      `
        .${id}-entering.${enterAnimation} {
          animation-duration: ${enterDuration / 1000}s;
          animation-fill-mode: both;
        }
        .${id}-exiting.${exitAnimation} {
          animation-duration: ${exitDuration / 1000}s;
          animation-fill-mode: both;
        }
        `
    )
  }
  render() {
    const { 
      id,
      children, 
      enterAnimation,
      enterDuration,
      exitAnimation,
      exitDuration,
      show,
      ...extProps
    } = this.props
    return (
      <div>
        <style dangerouslySetInnerHTML={{ __html: this.renderStyle(
          id, 
          enterAnimation,
          enterDuration,
          exitAnimation,
          exitDuration
          ) }} />
        <Transition appear={true} in={show} timeout={{ enter: enterDuration, exit: exitDuration }} {...extProps} >
          {(state) => {
            let classes = `${id}-${state}`
            if (state == 'entering') {
              classes += ` ${enterAnimation}`
            }
            if (state == 'exiting') {
              classes += ` ${exitAnimation}`
            }
            return (
              <div className={classes}>
                { children }
              </div>
            )
          }}
        </Transition>
      </div>
    )
  }
}
Animation.propTypes = {
  id: PropTypes.string.isRequired,
  enterAnimation: PropTypes.string.isRequired,
  enterDuration: PropTypes.number.isRequired,
  exitAnimation: PropTypes.string.isRequired,
  exitDuration: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired
}
export default Animation
