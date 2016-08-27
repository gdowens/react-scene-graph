import React, { Component, PropTypes } from 'react';
import ItemTypes from '../constants/ItemTypes';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import Scene from './Scene';
import SceneHeader from './SceneHeader';

class DraggableScene extends Component {
  static propTypes = {
    connectionLocation: PropTypes.object,
    draggedScene: PropTypes.object.isRequired,
    onDragConnectionStart: PropTypes.func.isRequired,
    onDragConnectionEnd: PropTypes.func.isRequired,
    onSceneDragChange: PropTypes.func.isRequired,
    onTargetlessConnectionDrop: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderSceneHeader: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired,
  };

  handleSceneMouseDown = (event) => {
    const { onDragConnectionStart, scene } = this.props;
    const {pageX: x, pageY: y} = event;

    onDragConnectionStart(scene, {x, y});
  }

  render() {
    const {
      connectDropTarget,
      connectionLocation,
      draggedScene,
      onSceneDragChange,
      onTargetlessConnectionDrop,
      renderScene,
      renderSceneHeader,
      scene,
    } = this.props;

    if(draggedScene.id === scene.id) {
      return null;
    }

    const transform = `translate3d(${scene.x}px, ${scene.y}px, 0)`;
    const styles = {
      position: 'absolute',
      transform: transform,
      WebkitTransform: transform,
    };

    return connectDropTarget(
      <div style={styles}>
        <SceneHeader
          key={`${scene.id}header`}
          renderSceneHeader={renderSceneHeader}
          scene={scene}
          onSceneDragChange={onSceneDragChange}
        />
        <div onMouseDown={this.handleSceneMouseDown}>
          <Scene
            canDrag={!_.isEmpty(connectionLocation)}
            key={scene.id}
            renderScene={renderScene}
            scene={scene} 
            onTargetlessConnectionDrop={onTargetlessConnectionDrop}
          />
        </div>
      </div>
    );
  }
}

const connectionTarget = {
  drop(props, monitor) {
    props.onDragConnectionEnd(monitor.getItem(), props.connectionLocation, props.scene);
  }
}

const dropConnectionCollect = (connect) => ({
  connectDropTarget: connect.dropTarget(),
});

export default DropTarget(ItemTypes.CONNECTION, connectionTarget, dropConnectionCollect)(DraggableScene)
