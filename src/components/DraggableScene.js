import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import ItemTypes from '../constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import _ from 'lodash';

import SceneHeader from './SceneHeader';

const sceneSource = {
  beginDrag(props) {
    return {...props.scene};
  }
};

const connectionSource = {
  beginDrag(props) {
    return { scene: props.scene };
  }
}

const connectionTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const sourceInitialOffset = monitor.getInitialClientOffset();
    const sourceScene = monitor.getItem().scene;
    const targetScene = props.scene;

    if (sourceScene.id === targetScene.id) {
      return;
    }

    let x = Math.round(sourceScene.x + delta.x);
    let y = Math.round(sourceScene.y + delta.y);

    props.onDragConnectionEnd(sourceScene, sourceInitialOffset, targetScene);
  }
}

function getStyles(x, y, isDragging) {
  const transform = `translate3d(${x}px, ${y}px, 0)`

  return {
    position: 'absolute',
    transform: transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
  };
}

class DraggableScene extends Component {
  static propTypes = {
    connectConnectionDragPreview: PropTypes.func.isRequired,
    connectConnectionDragSource: PropTypes.func.isRequired,
    connectSceneDragPreview: PropTypes.func.isRequired,
    connectSceneDragSource: PropTypes.func.isRequired,
    isConnectionDragging: PropTypes.bool.isRequired,
    isSceneDragging: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onDragConnectionEnd: PropTypes.func.isRequired,
    onSceneDragChange: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired,
    initialSceneClientOffset: PropTypes.object,
    sceneClientOffset: PropTypes.object,
  };

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectConnectionDragPreview(getEmptyImage());
    this.props.connectSceneDragPreview(getEmptyImage());
  }

  componentWillReceiveProps(nextProps) {
    const {
      isConnectionDragging,
      isSceneDragging,
      onSceneDragChange,
      scene,
      initialSceneClientOffset,
      sceneClientOffset,
    } = this.props;

    if (isSceneDragging !== nextProps.isSceneDragging) {
      onSceneDragChange(scene, nextProps.isSceneDragging);
    }
  }

  render() {
    const {
      connectConnectionDragSource,
      connectSceneDragSource,
      connectDropTarget,
      renderScene,
      scene,
      isSceneDragging,
    } = this.props;
    const styles = getStyles(scene.x, scene.y, isSceneDragging);

    if(isSceneDragging) {
      return null;
    }

    return connectDropTarget(
      <div style={styles}>
        {
          connectSceneDragSource(
            <div>
              <SceneHeader scene={scene}/>
            </div>
          )
        }
        {
          connectConnectionDragSource(
            <div>
              {renderScene(scene)}
            </div>
          )
        }
      </div>
    );
  }
}

export default _.flow(
  DropTarget(ItemTypes.CONNECTION, connectionTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(ItemTypes.CONNECTION, connectionSource, (connect, monitor) => ({
    connectConnectionDragPreview: connect.dragPreview(),
    connectConnectionDragSource: connect.dragSource(),
    isConnectionDragging: monitor.isDragging(),
  })),
  DragSource(ItemTypes.SCENE, sceneSource, (connect, monitor) => ({
    connectSceneDragPreview: connect.dragPreview(),
    connectSceneDragSource: connect.dragSource(),
    isSceneDragging: monitor.isDragging(),
    initialSceneClientOffset: monitor.getInitialClientOffset(),
    sceneClientOffset: monitor.getClientOffset(),
  }))
)(DraggableScene)
