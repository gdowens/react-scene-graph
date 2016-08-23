import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import ItemTypes from '../constants/ItemTypes';
import { DragSource, DropTarget } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import shallowDiff from '../utils/shallowDiff';
import deepDiff from '../utils/deepDiff';
import _ from 'lodash';

const sceneSource = {
  beginDrag(props) {
    const {id, x, y, width, height} = props
    return {id, x, y, width, height}
  }
};

const connectionTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    const item = monitor.getItem();

    let x = Math.round(item.x + delta.x);
    let y = Math.round(item.y + delta.y);

    props.updateScene(item.id, {
      x,
      y,
    })
  }
}

function getStyles(props) {
  const { x, y, isDragging } = props;
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
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    scene: PropTypes.object.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  };

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage());
  }

  render() {
    const { connectDragSource, connectDropTarget, currentOffset, renderScene,
      scene, isDragging } = this.props;
    const styles = getStyles(this.props)

    if(isDragging) {
      return null;
    }

    return connectDropTarget(connectDragSource(
      <div style={styles}>
        {renderScene(scene, isDragging)}
      </div>
    ));
  }
}

export default _.flow(
  DropTarget(ItemTypes.CONNECTION, connectionTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource(ItemTypes.SCENE, sceneSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))
)(DraggableScene)
