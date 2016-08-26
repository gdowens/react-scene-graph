import React, { Component, PropTypes } from 'react'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import CustomDragLayer from './CustomDragLayer'
import Container from './Container'
import update from 'react/lib/update';

class Noodlegraph extends Component {
  static propTypes = {
    items: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onDragConnectionStart: PropTypes.func.isRequired,
    onDragConnectionEnd: PropTypes.func.isRequired,
    onDragSceneStart: PropTypes.func.isRequired,
    onDragSceneEnd: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderSceneHeader: PropTypes.func.isRequired,
    style: PropTypes.object,
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
    const {
      containerStyle,
      data,
      onDragConnectionEnd,
      onDragConnectionStart,
      onDragSceneEnd,
      renderScene,
      renderSceneHeader,
    } = this.props

    return (
      <div style={containerStyle}>
        <Container
          connections={data.connections}
          onDragConnectionEnd={onDragConnectionEnd}
          onDragConnectionStart={onDragConnectionStart}
          onDragSceneEnd={onDragSceneEnd}
          renderScene={renderScene}
          renderSceneHeader={renderSceneHeader}
          scenes={data.scenes}
          updateScene={this.handleUpdateScene}
          viewport={data.viewport}
        />
        <CustomDragLayer
          connections={data.connections}
          renderScene={renderScene}
          renderSceneHeader={renderSceneHeader}
          scenes={data.scenes}
          viewport={data.viewport}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(Noodlegraph)
