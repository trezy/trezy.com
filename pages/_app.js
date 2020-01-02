// Style imports
/* eslint-disable import/no-unassigned-import */
import '../scss/reset.scss'
import '../scss/lib.scss'
import '../scss/app.scss'
/* eslint-enable */





// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { createFirestoreInstance } from 'redux-firestore'
import firebase from 'firebase/app'
/* eslint-disable import/no-unassigned-import */
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
/* eslint-enable import/no-unassigned-import */
import { ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { Provider } from 'react-redux'
import NextApp from 'next/app'
import LocalForage from 'localforage'
import marked from 'marked'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Local imports
import { initStore } from '../store'
import * as fasIcons from '../helpers/fasIconLibrary'
import * as fabIcons from '../helpers/fabIconLibrary'
import * as farIcons from '../helpers/farIconLibrary'
import AppLayout from '../components/AppLayout'
import firebaseConfig from '../firebase.config'





// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  firebase.database()
  firebase.firestore()
}

// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(fasIcons)
faLibrary.add(fabIcons)
faLibrary.add(farIcons)





@withRedux(initStore)
class App extends NextApp {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'Trezy.com',
      storeName: 'webStore',
    })

    const markdownRenderer = new marked.Renderer

    markdownRenderer.list = (text, ordered) => {
      const elementType = ordered ? 'ol' : 'ul'

      return `
        <${elementType} class="${ordered ? 'numbered' : 'bulleted'}">
          ${text}
        </${elementType}>`
    }

    markdownRenderer.heading = (text, level) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/gu, '-')

      return `
        <h${level + 1}>
          <a name="${escapedText}" class="anchor" href="#${escapedText}"></a>

          ${text}
        </h${level + 1}>`
    }

    marked.setOptions({ renderer: markdownRenderer })
  }

  static getInitialProps (appProps) {
    return AppLayout.getInitialProps(appProps)
  }

  render () {
    const {
      store,
      ...layoutProps
    } = this.props

    const rrfProps = {
      firebase,
      config: {
        presence: 'presence',
        sessions: 'sessions',
        userProfile: 'users',
      },
      dispatch: store.dispatch,
      createFirestoreInstance,
    }

    return (
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <AppLayout {...layoutProps} />
        </ReactReduxFirebaseProvider>
      </Provider>
    )
  }
}





export default App
