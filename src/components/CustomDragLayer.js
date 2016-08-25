import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { DragLayer } from 'react-dnd';
import ItemTypes from '../constants/ItemTypes';
import Connection from './Connection';
import SceneHeader from './SceneHeader';
import SVGComponent from './SVGComponent';

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

function getModifiedScene(props, id) {
  const { currentOffset, initialOffset, item, scenes } = props;

  if (!initialOffset || !currentOffset) {
    return item;
  }

  if (id === item.id) {
    return {
      ...item,
      x: currentOffset.x,
      y: currentOffset.y,
    };
  } else {
    return {
      ...scenes[id]
    }
  }
}

class CustomDragLayer extends Component {
  static propTypes = {
    connections: PropTypes.object,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.object,
    itemType: PropTypes.string,
    renderScene: PropTypes.func.isRequired,
    scenes: PropTypes.object,
    viewport: PropTypes.object.isRequired,
  };

  static defaultProps = {
    connections: {},
    item: {},
    itemType: "",
    scenes: {},
  };

  renderConnection(connection, key) {
    const { currentOffset, initialOffset, item } = this.props;
    if (!initialOffset || !currentOffset) {
      return null;
    }

    const fromScene = getModifiedScene(this.props, connection.from);
    const toScene = getModifiedScene(this.props, connection.to);
    const startX = item.id === toScene.id ? connection.startX : connection.startX + currentOffset.x - initialOffset.x;
    const startY = item.id === toScene.id ? connection.startY : connection.startY + currentOffset.y - initialOffset.y;
    return <Connection
      key={key}
      startX={startX}
      startY={startY}
      endingScene={toScene}
    />
  }

  render() {
    const {
      connections,
      isDragging,
      item,
      itemType,
      renderScene,
      viewport
    } = this.props;

    if (!isDragging || itemType !== ItemTypes.SCENE) {
      return null;
    }

    const connectionsInMotion = _.filter(connections, (connection) => {
      return [connection.from, connection.to].includes(item.id);
    });

    const itemStyle = getItemStyles(this.props);
    return (
      <div style={layerStyles}>
        <div style={itemStyle}>
          <SceneHeader scene={item}/>
          {renderScene(item)}
        </div>
        <SVGComponent width={viewport.width} height={viewport.height}>
          {Object.keys(connectionsInMotion)
            .map(key => this.renderConnection(connectionsInMotion[key], key))
          }
        </SVGComponent>
      </div>
    );
  }
}

export default DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(CustomDragLayer)
