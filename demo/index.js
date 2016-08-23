import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Noodlegraph from '../src';
import Scene from './components/Scene';
import update from 'react/lib/update';

class Demo extends Component {
  state = {
    scenes: {
      '1': {id: '1', y: 50, x: 50, width: 100, height: 200},
      '2': {id: '2', y: 50, x: 450, width: 100, height: 200},
      '3': {id: '3', y: 50, x: 850, width: 100, height: 200},
    },
    connections: {
      '1': {from: '1', to: '2', label: 'onPress'},
      '2': {from: '2', to: '3', label: 'onPress'},
    },
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

  renderScene = (sceneData, isDragging) => {
    const sceneProps = {
      ...sceneData,
      isDragging,
    };

    return (
      <div key={sceneData.id}>
        <Scene {...sceneProps}/>
      </div>
    );
  }

  render() {
    return (
      <Noodlegraph
        containerStyle={{width: 2000, height: 2000}}
        data={this.state}
        onChange={this.handleChange}
        renderScene={this.renderScene}
      />
    )
  }

}

export default connect()(Demo)
