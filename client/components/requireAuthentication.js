// Module imports
import { useSelector } from 'react-redux'
import React from 'react'





// Component imports
import { Router } from '../routes'
import getCurrentUserSelector from '../store/selectors/getCurrentUser'





const requireAuthentication = Component => {
  let redirectInProgress = false

  return props => {
    const currentUser = useSelector(getCurrentUserSelector)

    if (!redirectInProgress && !currentUser) {
      redirectInProgress = true

      Router.replace({
        as: '/login',
        pathname: '/login',
        query: {
          destination: location.href.replace(location.origin, ''), // eslint-disable-line no-restricted-globals
        },
      })

      return null
    }

    return (
      <Component {...props} />
    )
  }
}





export default requireAuthentication
