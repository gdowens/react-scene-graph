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
  };

  static defaultProps = {
    connections: {},
    scenes: {},
  };

  state = {
    draggedScene: {},
    currentConnectionOrigin: null,
    currentConnectionBox: null,
  };

  handleDragConnectionStart = (scene, clickAbsolutePosition) => {
    const { onDragConnectionStart } = this.props;
    const clickRelativePosition = {
      x: clickAbsolutePosition.x - scene.x,
      y: clickAbsolutePosition.y - scene.y,
    };

    const currentConnectionBox = onDragConnectionStart(scene, clickRelativePosition);
    this.setState({
      currentConnectionOrigin: currentConnectionBox ? clickAbsolutePosition : null,
    });
  }

  toggleIsSceneDragging = (draggedSceneId, isStartingDrag) => {
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
    const { scenes } = this.props;
    const { draggedScene } = this.state;
    const fromScene = scenes[connection.from];
    const toScene = scenes[connection.to];
    if ([fromScene.id, toScene.id].includes(draggedScene.id)) {
      return null;
    }
    return <Connection
      key={`${key}draggable`}
      startX={connection.startX}
      startY={connection.startY}
      endingScene={toScene}
    />
  }

  renderDraggableScene(scene, key) {
    const {
      onDragConnectionEnd,
      onDragConnectionStart,
      onTargetlessConnectionDrop,
      renderScene,
      renderSceneHeader,
    } = this.props;

    const { draggedScene, currentConnectionOrigin } = this.state;

    return (
      <DraggableScene
        connectionLocation={currentConnectionOrigin}
        draggedScene={draggedScene}
        key={key}
        onDragConnectionEnd={onDragConnectionEnd}
        onDragConnectionStart={this.handleDragConnectionStart}
        onSceneDragChange={this.toggleIsSceneDragging}
        onTargetlessConnectionDrop={onTargetlessConnectionDrop}
        renderScene={renderScene}
        renderSceneHeader={renderSceneHeader}
        scene={scene}
      />
    );
  }

  render() {
    const { connectDropTarget, connections, scenes, viewport } = this.props;

    const styles = {
      position: 'relative',
      width: '100%',
      height: '100%',
    };

    return connectDropTarget(
        <div style={styles}>
          {Object
            .keys(scenes)
            .map(key => this.renderDraggableScene(scenes[key], key))
          }
          <SVGComponent width={viewport.width} height={viewport.height}>
            {Object.keys(connections)
              .map(key => this.renderConnection(connections[key], key))
            }
          </SVGComponent>
        </div>
      );
  }
}

export default DropTarget(ItemTypes.SCENE, sceneTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Container)
