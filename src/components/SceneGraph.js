import React, { Component, PropTypes } from 'react'
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import CustomDragLayer from './CustomDragLayer'
import Container from './Container'
import getUUID from '../utils/getUUID';

class SceneGraph extends Component {
  static propTypes = {
    items: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onConnectionChange: PropTypes.func,
    onDragConnectionStart: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderSceneHeader: PropTypes.func.isRequired,
    showConnections: PropTypes.bool,
  }

  static defaultProps = {
    showConnections: true,
    onConnectionChange: () => {},
  };

  handleDragConnectionEnd = (sourceScene, sourceInitialOffset, targetScene) => {
    let newConnections = {
      ...this.props.data.connections
    };
    const connectionId = getUUID();
    newConnections[connectionId] = {
      from: sourceScene.id,
      id: connectionId,
      label: 'onPress',
      startX: sourceInitialOffset.x,
      startY: sourceInitialOffset.y,
      to: targetScene.id,
    };

    this.props.onConnectionChange('create', {
      [connectionId]: newConnections[connectionId],
    });
    this.props.onChange(update(this.props.data, {
      connections: { $set: newConnections },
    }));
  }

  handleDragSceneEnd = (scene, delta) => {
    const updatedConnections = {}
    const newConnections = _.mapValues(this.props.data.connections, (connection) => {
      if (connection.from === scene.id) {
        const updatedConnection = {
          ...connection,
          startX: connection.startX + delta.x,
          startY: connection.startY + delta.y,
        };
        updatedConnections[connection.id] = updatedConnection
        return updatedConnection;
      } else {
        return connection;
      }
    });

    this.props.onConnectionChange('update', updatedConnections)
    this.props.onChange(update(this.props.data, {
      scenes: {
        [scene.id]: {
          x: { $set: scene.x + delta.x },
          y: { $set: scene.y + delta.y },
        },
      },
      connections: { $set: newConnections },
    }));
  }

  handleUpdateConnectionStart = (id, newLocation, newStartSceneId) => {
    this.props.onConnectionChange('update', {
      [id]: {
        ...this.props.data.connections[id],
        from: newStartSceneId,
        startX: newLocation.x,
        startY: newLocation.y,
      }
    })
    this.props.onChange(update(this.props.data, {
      connections: {
        [id]: {
          from: { $set: newStartSceneId },
          startX: { $set: newLocation.x },
          startY: { $set: newLocation.y },
        },
      }
    }));
  }

  handleUpdateConnectionEnd = (id, newEndSceneId) => {
    this.props.onConnectionChange('update', {
      [id]: {
        ...this.props.data.connections[id],
        to: newEndSceneId,
      }
    });
    this.props.onChange(update(this.props.data, {
      connections: {
        [id]: {
          to: { $set: newEndSceneId },
        },
      }
    }));
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

  handleRemoveConnection = (id) => {
    const { connections } = this.props.data;
    this.props.onConnectionChange('delete', {[id]: connections[id]})
    this.props.onChange(update(this.props.data, {
      connections: {
        $set: _.omit(connections, id),
      },
    }));
  }

  render() {
    const {
      data,
      onDragConnectionStart,
      onDragSceneEnd,
      renderScene,
      renderSceneHeader,
      showConnections,
    } = this.props

    return (
      <div>
        <Container
          connections={data.connections}
          onDragConnectionEnd={this.handleDragConnectionEnd}
          onDragConnectionStart={onDragConnectionStart}
          onDragSceneEnd={this.handleDragSceneEnd}
          onTargetlessConnectionDrop={this.handleRemoveConnection}
          renderScene={renderScene}
          renderSceneHeader={renderSceneHeader}
          scenes={data.scenes}
          showConnections={showConnections}
          updateConnectionStart={this.handleUpdateConnectionStart}
          updateConnectionEnd={this.handleUpdateConnectionEnd}
          updateScene={this.handleUpdateScene}
          viewport={data.viewport}
        />
        <CustomDragLayer
          connections={data.connections}
          renderScene={renderScene}
          renderSceneHeader={renderSceneHeader}
          scenes={data.scenes}
          showConnections={showConnections}
          viewport={data.viewport}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(SceneGraph)
