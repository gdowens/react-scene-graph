import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from '../utils/shouldPureComponentUpdate';
import update from 'react/lib/update';
import ItemTypes from '../constants/ItemTypes';
import DraggableScene from './DraggableScene';
import Line from './Line';
import SVGComponent from './SVGComponent';
import { DropTarget } from 'react-dnd';

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

    props.updateScene(item.id, {x, y})
  }
};

class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    connections: PropTypes.object,
    scenes: PropTypes.object,
  };

  defaultProps = {
    scenes: {},
    connections: {},
  };

  renderConnections(connection, key) {
    const { scenes } = this.props;
    const startingScene = scenes[connection.from];
    const endingScene = scenes[connection.to];
    const x1 = startingScene.x + startingScene.width / 2;
    const y1 = startingScene.y + startingScene.height / 2;
    const x2 = endingScene.x + endingScene.width / 2;
    const y2 = endingScene.y + endingScene.height / 2;

    return (
      <Line key={key} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="3" stroke="blue"/>
    );
  }

  renderDraggableScene(scene, key) {
    const { renderScene } = this.props
    return (
      <DraggableScene
        key={key}
        id={key}
        renderScene={renderScene}
        scene={scene}
        {...scene}
      />
    );
  }

  render() {
    const { connectDropTarget, connections, scenes } = this.props;

    return connectDropTarget(
      <div style={styles}>
        {Object
          .keys(scenes)
          .map(key => this.renderDraggableScene(scenes[key], key))
        }
        <SVGComponent width={this.props.viewport.width} height={this.props.viewport.height}>
          {Object.keys(connections)
            .map(key => this.renderConnections(connections[key], key))
          }
        </SVGComponent>
      </div>
    );
  }
}

export default DropTarget(ItemTypes.SCENE, sceneTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Container)
