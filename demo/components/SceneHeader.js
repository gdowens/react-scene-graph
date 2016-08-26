import React, { Component, PropTypes } from 'react';

export default class SceneHeader extends Component {
    static propTypes = {
        scene: PropTypes.object.isRequired,
    };

    render() {
        const { scene } = this.props;

        const headerStyle = {
          height: scene.height / 10,
          width: scene.width,
          textAlign: 'center',
          border: '1px solid black',
          borderBottom: '',
        };

        return (
          <div style={headerStyle}>
            {scene.name}
          </div>
        );
    }
}
