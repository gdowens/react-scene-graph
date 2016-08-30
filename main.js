import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Demo from './demo'

const container = document.getElementById('container')

const renderComponent = (component) => {
  ReactDOM.render(<Demo/>, container);
}

if (module.hot) {
  module.hot.accept()
}

renderComponent(Demo)
