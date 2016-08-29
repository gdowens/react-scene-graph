import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import update from 'react/lib/update';
import ItemTypes from '../constants/ItemTypes';
import Connection from './Connection';
import DraggableScene from './DraggableScene';
import Line from './Line';
import SVGComponent from './SVGComponent';

const sceneTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();

    let x = Math.round(item.x + delta.x);
    let y = Math.round(item.y + delta.y);

    props.updateScene(item.id, { x, y })
  }
};

class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connections: PropTypes.object,
    onDragConnectionEnd: PropTypes.func.isRequired,
    onDragConnectionStart: PropTypes.func.isRequired,
    onDragSceneEnd: PropTypes.func.isRequired,
    onTargetlessConnectionDrop: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderSceneHeader: PropTypes.func.isRequired,
    scenes: PropTypes.object,
    updateScene: PropTypes.func.isRequired,
    updateConnectionEnd: PropTypes.func.isRequired,
    updateConnectionStart: PropTypes.func.isRequired,
  };

  static defaultProps = {
    connections: {},
    scenes: {},
  };

  state = {
    draggedConnection: {},
    draggedScene: {},
    currentConnectionOrigin: null,
    currentConnectionBox: null,
  };

  handleConnectionDragChange = (draggedConnection, isStartingDrag) => {
    this.setState({
      draggedConnection: isStartingDrag ? draggedConnection : {},
    });
  }

  handleDragConnectionStart = (scene, clickAbsolutePosition) => {
    const { onDragConnectionStart } = this.props;
    const clickRelativePosition = {
      x: clickAbsolutePosition.x - scene.x,
      y: clickAbsolutePosition.y - scene.y,
    };

    const connectionOrigin = {
      x: scene.x + scene.width + 6,
      y: clickAbsolutePosition.y,
    };

    const currentConnectionBox = onDragConnectionStart(scene, clickRelativePosition);
    this.setState({
      currentConnectionOrigin: currentConnectionBox ? connectionOrigin : null,
    });
  }

  handleSceneDragChange = (draggedSceneId, isStartingDrag) => {
    const { onDragSceneEnd, scenes } = this.props;
    const draggedScene = scenes[draggedSceneId];

    if (!isStartingDrag) {
      const sceneDelta = {
        x: draggedScene.x - this.state.draggedScene.x,
        y: draggedScene.y - this.state.draggedScene.y,
      };
      onDragSceneEnd(draggedScene, sceneDelta);
    }

    this.setState({
      draggedScene: isStartingDrag ? draggedScene : {},
    });
  }

  renderConnection(connection, key) {
    const { onTargetedConnectionDrop, onTargetlessConnectionDrop, scenes } = this.props;
    const { draggedConnection, draggedScene } = this.state;
    const fromScene = scenes[connection.from];
    const toScene = scenes[connection.to];
    if ([fromScene.id, toScene.id].includes(draggedScene.id) ||
        connection.id === draggedConnection.id) {
      return null;
    }
    return <Connection
      connection={connection}
      endingScene={toScene}
      key={`${key}draggable`}
      onConnectionDragChange={this.handleConnectionDragChange}
      onTargetlessConnectionDrop={onTargetlessConnectionDrop}
    />
  }

  renderDraggableScene(scene, key) {
    const {
      onDragConnectionEnd,
      onDragConnectionStart,
      onTargetlessConnectionDrop,
      renderScene,
      renderSceneHeader,
      updateConnectionEnd,
      updateConnectionStart,
    } = this.props;

    const { draggedScene, currentConnectionOrigin } = this.state;

    return (
      <DraggableScene
        connectionLocation={currentConnectionOrigin}
        draggedScene={draggedScene}
        key={key}
        onDragConnectionEnd={onDragConnectionEnd}
        onDragConnectionStart={this.handleDragConnectionStart}
        onSceneDragChange={this.handleSceneDragChange}
        onTargetlessConnectionDrop={onTargetlessConnectionDrop}
        renderScene={renderScene}
        renderSceneHeader={renderSceneHeader}
        scene={scene}
        updateConnectionEnd={updateConnectionEnd}
        updateConnectionStart={updateConnectionStart}
      />
    );
  }

  render() {
    const { connectDropTarget, connections, scenes, viewport } = this.props;

    return connectDropTarget(
        <div>
          {Object.keys(scenes)
            .map(key => this.renderDraggableScene(scenes[key], key))
          }
          {Object.keys(connections)
            .map(key => this.renderConnection(connections[key], key))
          }
        </div>
      );
  }
}

export default DropTarget(ItemTypes.SCENE, sceneTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Container)
