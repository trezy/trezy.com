// Module imports
import React, {
  useEffect,
} from 'react'
import {
  isEmpty,
  isLoaded,
} from 'react-redux-firebase'
import { useSelector } from 'react-redux'
import Router from 'next/router'





// Local imports
const RequireAuthentication = ({ children }) => {
  const auth = useSelector(state => state.firebase.auth)
  let redirectInProgress = false

  useEffect(() => {
    if ((typeof window !== 'undefined') && isLoaded(auth) && isEmpty(auth)) {
      redirectInProgress = true

      Router.replace({
        pathname: '/login',
        query: {
          /* eslint-disable-next-line no-restricted-globals */
          destination: location.href.replace(location.origin, ''),
        },
      })
    }
  }, [auth])

  if (!isLoaded(auth)) {
    return (
      <span>Verifying authentication...</span>
    )
  }

  if (redirectInProgress) {
    return (
      <span>Not logged in; Redirecting...</span>
    )
  }

  return children
}





export default RequireAuthentication
