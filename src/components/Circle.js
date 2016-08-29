import React, { Component } from 'react';

export default class Circle extends Component {
    render() {
        return <circle {...this.props}>{this.props.children}</circle>;
    }
}
