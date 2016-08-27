import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';

class SceneBase extends Component {
  static propTypes = {
    canDrag: PropTypes.bool.isRequired,
    connectConnectionDragPreview: PropTypes.func.isRequired,
    connectConnectionDragSource: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.connectConnectionDragPreview(getEmptyImage());
  }

  render() {
    const { connectConnectionDragSource, renderScene, scene } = this.props;

    return connectConnectionDragSource(
      <div>
        {renderScene(scene)}
      </div>
    )
  }
}

const connectionSource = {
  beginDrag(props, monitor) {
    return {...props.scene};
  },
  canDrag(props, monitor) {
    return props.canDrag;
  },
};

const dragConnectionCollect = (connect, monitor) => ({
  connectConnectionDragPreview: connect.dragPreview(),
  connectConnectionDragSource: connect.dragSource(),
});

export default DragSource(ItemTypes.CONNECTION, connectionSource, dragConnectionCollect)(SceneBase);
