import React, { Component, PropTypes } from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import CustomDragLayer from './CustomDragLayer'
import Container from './Container'
import update from 'react/lib/update';
import Perf from 'react-addons-perf';
window.Perf = Perf;

class Noodlegraph extends Component {
  static propTypes = {
    style: PropTypes.object,
    items: PropTypes.object,
  }

  static defaultProps = {
    containerStyle: {
      width: 500,
      height: 500,
    }
  }

  handleUpdateScene = (id, pos) => {
    this.props.onChange(update(this.props.data, {
      scenes: {
        [id]: {
          x: { $set: pos.x },
          y: { $set: pos.y },
        },
      }
    }));
  }

  render() {
    const {onChange, renderScene, data, canvasDimensions} = this.props
    return (
      <div style={this.props.containerStyle}>
        <Container
          connections={data.connections}
          renderScene={this.props.renderScene}
          scenes={data.scenes}
          updateScene={this.handleUpdateScene}
          viewport={data.viewport}
        />
        {
          <CustomDragLayer renderScene={this.props.renderScene} />
        }
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Noodlegraph)
