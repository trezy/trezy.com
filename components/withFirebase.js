// Module imports
import PropTypes from 'prop-types'
import React from 'react'
import withFirebaseAuth from 'react-with-firebase-auth'





// Component imports
import {
  firebase,
  firebaseApp,
  providers,
} from '../helpers/firebase'





const withFirebaseWrapper = Component => {
  const ComponentWithFirebase = props => (
    <Component
      {...props}
      firebase={firebase}
      firebaseApp={firebaseApp} />
  )

  ComponentWithFirebase.defaultProps = {
    user: null,
  }

  ComponentWithFirebase.propTypes = {
    user: PropTypes.object,
  }

  const WrappedComponent = withFirebaseAuth({
    firebaseAppAuth: firebaseApp.auth(),
    providers,
  })(ComponentWithFirebase)

  if (Component.getInitialProps) {
    WrappedComponent.getInitialProps = Component.getInitialProps
  }

  return WrappedComponent
}

export default withFirebaseWrapper
