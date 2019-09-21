// Module imports
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import withFirebaseAuth from 'react-with-firebase-auth'





// Component imports
import { actions } from '../store'
import {
  firebaseApp,
  providers,
} from '../helpers/firebase'





// Local constants
let previousUser = null





const withFirebaseWrapper = Component => {
  const ComponentWithFirebase = props => {
    const dispatch = useDispatch()

    const { user: currentUser } = props

    useEffect(() => {
      if (currentUser !== previousUser) {
        dispatch(actions.getCurrentUser())
      }

      return () => {
        previousUser = currentUser
      }
    })

    return (
      <Component
        {...props}
        currentUser={currentUser}
        firebaseApp={firebaseApp} />
    )
  }

  ComponentWithFirebase.defaultProps = {
    user: null,
  }

  ComponentWithFirebase.propTypes = {
    user: PropTypes.object,
  }

  return withFirebaseAuth({
    firebaseAppAuth: firebaseApp.auth(),
    providers,
  })(ComponentWithFirebase)
}

export default withFirebaseWrapper
