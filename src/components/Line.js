import React, { Component } from 'react';

export default class Line extends Component {
    render() {
        return <line {...this.props}>{this.props.children}</line>;
    }
}
