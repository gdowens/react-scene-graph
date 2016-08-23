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
import 'whatwg-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Demo from './demo'
import configureStore from './demo/configureStore'

const container = document.getElementById('container')
const initialState = {}
const store = configureStore(initialState)

const renderComponent = (component) => {

  ReactDOM.render(
    <Provider store={store}>
      <Demo/>
    </Provider>
    , container)
}

if (module.hot) {
  module.hot.accept()
  module.hot.accept('./demo/reducers', () => {
    const nextRootReducer = require('./demo/reducers/index');
    store.replaceReducer(nextRootReducer);
  })
}

renderComponent(Demo)
