// Module imports
import React, {
  useEffect,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'





// Local imports
import withFirebase from './withFirebase'





const requireAuthentication = Component => {
  let redirectInProgress = false

  Router.events.on('routeChangeComplete', () => {
    redirectInProgress = false
  })

  const ComponentRequiresAuthentication = props => {
    const { firebaseApp } = props
    const firebaseAppAuth = firebaseApp.auth()

    const [currentUser, setCurrentUser] = useState(firebaseAppAuth.currentUser)
    const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(Boolean(currentUser))

    useEffect(() => {
      firebaseAppAuth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setIsLoadingCurrentUser(false)
      })
    }, [])

    useEffect(() => {
      if ((typeof window !== 'undefined') && !currentUser && !isLoadingCurrentUser && !redirectInProgress) {
        redirectInProgress = true

        Router.replace({
          pathname: '/login',
          query: {
            /* eslint-disable-next-line no-restricted-globals */
            destination: location.href.replace(location.origin, ''),
          },
        })
      }
    }, [currentUser && isLoadingCurrentUser])

    if (!currentUser && isLoadingCurrentUser) {
      return (
        <span>Loading current user...</span>
      )
    }

    if (!currentUser && !isLoadingCurrentUser) {
      return (
        <span>Not logged in; Redirecting...</span>
      )
    }

    return (
      <Component
        {...props}
        currentUser={currentUser} />
    )
  }

  ComponentRequiresAuthentication.defaultProps = {
    // firebase: null,
    firebaseApp: null,
  }

  ComponentRequiresAuthentication.propTypes = {
    // firebase: PropTypes.object,
    firebaseApp: PropTypes.object,
  }

  return withFirebase(ComponentRequiresAuthentication)
}





export default requireAuthentication
