import React, { Component } from 'react'
import shouldPureComponentUpdate from '../../src/utils/shouldPureComponentUpdate'

const getStyles = (width, height, isDragging) => {
  return {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: 'white',
    border: isDragging ? '1px solid red' : '1px solid black',
  }
}

export default class Scene extends Component {

  render () {
    const { width, height, isDragging } = this.props;
    return (
      <div style={getStyles(width, height, isDragging)}/>
    );
  }
}
