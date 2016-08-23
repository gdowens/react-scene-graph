import React, { Component, PropTypes } from 'react';

const styles = {
  display: 'inline-block',
  padding: '0.5rem 1rem',
  width: '100px',
  height: '100px',
  backgroundColor: 'white',
};

export default class Box extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: 'DEFAULT TITLE',
  }

  constructor(props) {
    super(props)
  }

  getStyles() {
    return {
      ...styles,
      border: this.props.hover ? '1px dashed gray' : 'none'
    }
  }

  render() {
    const { title, onEnter, onLeave } = this.props;

    return (
      <div style={this.getStyles()}
        onMouseEnter={() => {
          onEnter()
        }}
        onMouseOut={() => {
          onLeave()
        }}>
        {title}
      </div>
    );
  }
}
