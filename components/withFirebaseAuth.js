// Module imports
import React, {
  useEffect,
} from 'react'
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





const withFirebaseAuthWrapper = Component => {
  const ComponentWithFirebaseAuth = props => {
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
        firebaseApp={firebaseApp} />
    )
  }

  ComponentWithFirebaseAuth.defaultProps = {
    user: null,
  }

  ComponentWithFirebaseAuth.propTypes = {
    user: PropTypes.object,
  }

  return withFirebaseAuth({
    firebaseAppAuth: firebaseApp.auth(),
    providers,
  })(ComponentWithFirebaseAuth)
}

export default withFirebaseAuthWrapper
