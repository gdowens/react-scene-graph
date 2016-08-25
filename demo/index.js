import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Noodlegraph from '../src';
import Scene from './components/Scene';
import update from 'react/lib/update';

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

  handleDragConnectionStart = (data) => {
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
    newConnections[`${sourceScene.id}${targetScene.id}${counter}`] = {
      startX: sourceInitialOffset.x,
      startY: sourceInitialOffset.y,
      from: sourceScene.id,
      to: targetScene.id,
      label: 'onPress',
    };
    this.setState({
      connections: newConnections,
    });
    counter++;
  }

  renderScene = (sceneData) => {
    return (
      <div key={sceneData.id}>
        <Scene {...sceneData}/>
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
        showConnections={false}
      />
    )
  }

}

export default connect()(Demo)
