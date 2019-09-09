// Module imports
import React from 'react'
import Router from 'next/router'





const requireAuthentication = Component => {
  let redirectInProgress = false

  return class WrappedComponent extends React.Component {
    static displayName = `requireAuthentication(${Component.displayName || Component.name || 'Component'})`

    static async getInitialProps (componentContext) {
      if (!componentContext) {
        throw new Error('No app context')
      }

      const {
        currentUserID,
        users,
      } = componentContext.store.getState()
      const currentUser = users[currentUserID]

      console.log(currentUser)

      if ((typeof window !== 'undefined') && !redirectInProgress && !currentUser) {
        redirectInProgress = true

        Router.replace({
          pathname: '/login',
          query: {
            /* eslint-disable-next-line no-restricted-globals */
            destination: location.href.replace(location.origin, ''),
          },
        })
      }

      let initialProps = {}

      /* eslint-disable-next-line no-restricted-syntax */
      if ('getInitialProps' in Component) {
        initialProps = await Component.getInitialProps(componentContext)
      }

      return initialProps
    }

    render () {
      return (
        <Component {...this.props} />
      )
    }
  }
}





export default requireAuthentication
