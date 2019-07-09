// Style imports
/* eslint-disable import/no-unassigned-import */
import '../scss/reset.scss'
import '../scss/lib.scss'
import '../scss/app.scss'
/* eslint-enable */





// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import NextApp, { Container } from 'next/app'
import React from 'react'
import withRedux from 'next-redux-wrapper'
import LocalForage from 'localforage'





// Component imports
import { initStore } from '../store'
import * as faIcons from '../helpers/faIconLibrary'
import AppLayout from '../components/AppLayout'





// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(faIcons)





@withRedux(initStore)
class App extends NextApp {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'Trezy.com',
      storeName: 'webStore',
    })
  }

  static getInitialProps (appProps) {
    return AppLayout.getInitialProps(appProps)
  }

  render () {
    const {
      store,
      ...layoutProps
    } = this.props

    return (
      <Container>
        <Provider store={store}>
          <AppLayout {...layoutProps} />
        </Provider>
      </Container>
    )
  }
}





export default App
