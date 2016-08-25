import React, { Component, PropTypes } from 'react';

export default class TextPath extends Component {
    static propTypes = {
        href: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    };

    render() {
        const { href, text } = this.props;

        return (
            <text x={700} y={180} fontFamily="Verdana" fontSize={32}>
                <textPath xlinkHref={`#${href}`}>
                    "hehehehehehehehehehehehe"
                </textPath>
            </text>
        );
    }
}
