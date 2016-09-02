import React, { Component } from 'react'

export default class Scene extends Component {

  render () {
    const { width, height, isDragging } = this.props;
    const containerStyle = {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: 'white',
      border: isDragging ? '1px solid red' : '1px solid black',
    };

    const buttonDivStyle = {
      width: width / 2,
      height: height / 2,
      border: '1px solid red',
      margin: 'auto',
      marginTop: height/5,
    };

    return (
      <div style={containerStyle}>
        <div style={buttonDivStyle}/>
      </div>
    );
  }
}
