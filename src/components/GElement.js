import React, { Component } from 'react';

export default class GElement extends Component {
    render() {
        return <g {...this.props}>{this.props.children}</g>;
    }
}
