import React, { Component, PropTypes } from 'react';

export default class CurvedLine extends Component {
  static propTypes = {
    startX: PropTypes.number.isRequired,
    startY: PropTypes.number.isRequired,
    endX: PropTypes.number.isRequired,
    endY: PropTypes.number.isRequired,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    reverseOrientation: PropTypes.bool,
  };

  static defaultProps = {
    strokeColor: 'black',
    strokeWidth: 2,
    reverseOrientation: false,
  }

  createPath = () => {
    const { startX, startY, endX, endY, reverseOrientation } = this.props;
    const xRange = endX - startX;
    const yRange = endY - startY;
    const startControlCoords = `${startX - (xRange / 2)}${endY}`
    const endControlCoords = `${endX + (xRange / 2)}${startY}`
    // start point, start control point, end control point, end point
    // return `M${startX},${startY} C${startX},${endY - (xRange / 4)} ${endX},${startY + (xRange / 4)} ${endX},${endY}`;
    const curveMultiplier = reverseOrientation ? 1 : -1;
    const controlOffset = xRange / 4 * curveMultiplier;
    return `M${startX},${startY} C${startX},${endY + controlOffset} ${endX},${startY - controlOffset} ${endX},${endY}`;
  }

  render() {
    const curveStyle = {
      strokeWidth: this.props.strokeWidth,
      stroke: this.props.strokeColor,
      strokeLinecap: 'round',
      fill: 'none',
    };

    return <path style={curveStyle} d={this.createPath()}/>;
  }
}
