import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react/lib/update';
import _ from 'lodash';
import Noodlegraph from '../src';
import Scene from './components/Scene';
import SceneHeader from './components/SceneHeader';

let counter = 0;

class Demo extends Component {
  state = {
    scenes: {
      '1': {id: '1', name: 'Scene1', y: 50, x: 50, width: 100, height: 200},
      '2': {id: '2', name: 'Scene2', y: 50, x: 450, width: 100, height: 200},
      '3': {id: '3', name: 'Scene3', y: 50, x: 850, width: 100, height: 200},
    },
    connections: {},
    viewport: {
      x: 500,
      y: 500,
      width: 1500,
      height: 1500,
    },
  };

  handleChange = (data) => {
    this.setState({...data});
  }

  handleDragConnectionStart = (sourceScene, relativeClickLoc) => {
    return {
      x: sourceScene.x + sourceScene.width,
      y: sourceScene.y,
    };
  }

  handleDragSceneStart = (data) => {
  }

  handleDragSceneEnd = (scene, delta) => {
    const newConnections = _.mapValues(this.state.connections, (connection) => {
      if (connection.from === scene.id) {
        return {
          ...connection,
          startX: connection.startX + delta.x,
          startY: connection.startY + delta.y,
        };
      } else {
        return connection;
      }
    });

    this.setState({connections: newConnections});
  }

  handleDragConnectionEnd = (sourceScene, sourceInitialOffset, targetScene) => {
    let newConnections = {
      ...this.state.connections
    };
    const connectionId = `${sourceScene.id}${targetScene.id}${counter}`;
    newConnections[connectionId] = {
      from: sourceScene.id,
      id: connectionId,
      label: 'onPress',
      startX: sourceInitialOffset.x,
      startY: sourceInitialOffset.y,
      to: targetScene.id,
    };
    this.setState({
      connections: newConnections,
    });
    counter++;
  }

  renderScene = (scene) => {
    return (
      <div key={scene.id}>
        <Scene {...scene}/>
      </div>
    );
  }

  renderSceneHeader = (scene) => {
    return (
      <div key={`${scene.id}header`}>
        <SceneHeader scene={scene}/>
      </div>
    );
  }

  render() {
    return (
      <Noodlegraph
        containerStyle={{width: 2000, height: 2000}}
        data={this.state}
        onChange={this.handleChange}
        onDragConnectionEnd={this.handleDragConnectionEnd}
        onDragConnectionStart={this.handleDragConnectionStart}
        onDragSceneStart={this.handleDragSceneStart}
        onDragSceneEnd={this.handleDragSceneEnd}
        renderScene={this.renderScene}
        renderSceneHeader={this.renderSceneHeader}
        showConnections={false}
      />
    )
  }

}

export default connect()(Demo)
