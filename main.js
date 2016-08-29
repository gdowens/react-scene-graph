/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Demo from './demo'

const container = document.getElementById('container')

const renderComponent = (component) => {

  ReactDOM.render(
    <Demo/>
    , container)
}

if (module.hot) {
  module.hot.accept()
}

renderComponent(Demo)
