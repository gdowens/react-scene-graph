import React, { Component, PropTypes } from 'react';
import ItemTypes from '../constants/ItemTypes';
import { DragLayer } from 'react-dnd';

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

function getItemStyles(props) {
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none'
    };
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform,
    position: 'absolute',
  };
}


class CustomDragLayer extends Component {
  static propTypes = {
    item: PropTypes.object,
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { item, isDragging, renderScene } = this.props;

    if (this.props.initialOffset === null) {
      return null;
    }

    const itemStyle = getItemStyles(this.props)
    return (
      <div style={layerStyles}>
        <div style={itemStyle}>
          {renderScene(item, true)}
        </div>
      </div>
    );
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(CustomDragLayer)
