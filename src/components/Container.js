import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import update from 'react/lib/update';
import ItemTypes from '../constants/ItemTypes';
import Connection from './Connection';
import DraggableScene from './DraggableScene';
import Line from './Line';
import SVGComponent from './SVGComponent';

const styles = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

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
    onDragSceneEnd: PropTypes.func.isRequired,
    updateScene: PropTypes.func.isRequired,
    scenes: PropTypes.object,
  };

  static defaultProps = {
    connections: {},
    scenes: {},
  };

  state = {
    draggedScene: {},
  };

  toggleIsSceneDragging = (draggedScene, isStartingDrag) => {
    const { onDragSceneEnd } = this.props;

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
      key={key}
      startX={connection.startX}
      startY={connection.startY}
      endingScene={toScene}
    />
  }

  renderDraggableScene(scene, key) {
    const { onDragConnectionEnd, renderScene } = this.props
    return (
      <DraggableScene
        key={key}
        id={key}
        onDragConnectionEnd={onDragConnectionEnd}
        onSceneDragChange={this.toggleIsSceneDragging}
        renderScene={renderScene}
        scene={scene}
      />
    );
  }

  render() {
    const { connectDropTarget, connections, scenes, viewport } = this.props;

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
