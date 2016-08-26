import React, { Component, PropTypes } from 'react';
import ItemTypes from '../constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import _ from 'lodash';

const sceneSource = {
  beginDrag(props) {
    return {...props.scene};
  }
};

const connectionSource = {
  beginDrag(props) {
    return {...props.scene};
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  }
  // canDrag(props, monitor) {
  //   const {
  //     initialConnectionClientOffset,
  //     onDragConnectionStart,
  //     scene,
  //   } = props;

  //   if (!initialConnectionClientOffset) {
  //     return true;
  //   }

  //   const clickSourceRelativePosition = {
  //     x: initialConnectionClientOffset.x - scene.x,
  //     y: initialConnectionClientOffset.y - scene.y,
  //   };
  //   const canDrag = onDragConnectionStart(scene, clickSourceRelativePosition);
  //   console.log("canDrag", canDrag);
  // }
}

const connectionTarget = {
  drop(props, monitor, component) {
    console.log(component);
    const { connectionLocation } = component.state;
    const delta = monitor.getDifferenceFromInitialOffset();
    const sourceInitialOffset = monitor.getInitialClientOffset();
    const sourceScene = monitor.getItem();
    const targetScene = props.scene;

    if (sourceScene.id === targetScene.id) {
      return;
    }

    let x = Math.round(sourceScene.x + delta.x);
    let y = Math.round(sourceScene.y + delta.y);

    props.onDragConnectionEnd(sourceScene, connectionLocation, targetScene);
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
    id: PropTypes.string.isRequired,
    initialSceneClientOffset: PropTypes.object,
    isConnectionDragging: PropTypes.bool.isRequired,
    isSceneDragging: PropTypes.bool.isRequired,
    onDragConnectionStart: PropTypes.func.isRequired,
    onDragConnectionEnd: PropTypes.func.isRequired,
    onSceneDragChange: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderSceneHeader: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired,
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
      onDragConnectionStart,
      onSceneDragChange,
      scene,
      initialConnectionClientOffset,
      initialSceneClientOffset,
      sceneClientOffset,
    } = this.props;

    if (isSceneDragging !== nextProps.isSceneDragging) {
      onSceneDragChange(scene, nextProps.isSceneDragging);
    }

    if (!isConnectionDragging && nextProps.isConnectionDragging) {
      const clickSourceRelativePosition = {
        x: initialConnectionClientOffset.x - scene.x,
        y: initialConnectionClientOffset.y - scene.y,
      };
      const connectionLocation = onDragConnectionStart(scene, clickSourceRelativePosition);
      this.setState({connectionLocation});
    }
  }

  state = {
    connectionLocation: null,
  };

  render() {
    const {
      connectConnectionDragSource,
      connectSceneDragSource,
      connectDropTarget,
      renderScene,
      renderSceneHeader,
      scene,
      isSceneDragging,
    } = this.props;
    const styles = getStyles(scene.x, scene.y, isSceneDragging);

    if(isSceneDragging) {
      return null;
    }

    return connectDropTarget(
      <div style={styles}>
        {connectSceneDragSource(
          <div>
            {renderSceneHeader(scene)}
          </div>
        )}
        {connectConnectionDragSource(
          <div>
            {renderScene(scene)}
          </div>
        )}
      </div>
    );
  }
}

const dropConnectionCollect = (connect) => ({
  connectDropTarget: connect.dropTarget(),
});

const dragConnectionCollect = (connect, monitor) => ({
  connectConnectionDragPreview: connect.dragPreview(),
  connectConnectionDragSource: connect.dragSource(),
  initialConnectionClientOffset: monitor.getInitialClientOffset(),
  isConnectionDragging: monitor.isDragging(),
});

const dragSceneCollect = (connect, monitor) => ({
  connectSceneDragPreview: connect.dragPreview(),
  connectSceneDragSource: connect.dragSource(),
  isSceneDragging: monitor.isDragging(),
  initialSceneClientOffset: monitor.getInitialClientOffset(),
  sceneClientOffset: monitor.getClientOffset(),
});

export default _.flow(
  DropTarget(ItemTypes.CONNECTION, connectionTarget, dropConnectionCollect),
  DragSource(ItemTypes.CONNECTION, connectionSource, dragConnectionCollect),
  DragSource(ItemTypes.SCENE, sceneSource, dragSceneCollect)
)(DraggableScene)
