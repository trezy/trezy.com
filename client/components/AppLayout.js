// Module imports
import { Transition } from 'react-spring/renderprops.cjs'
import NextHead from 'next/head'
import NextError from 'next/error'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import { connect } from '../store'
import { Router } from '../routes'
import Banner from './Banner'
import httpStatus from '../helpers/httpStatus'





// Local constants
const TransitionContext = React.createContext(null)





// Setup NProgress
NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())





@connect
class AppLayout extends React.Component {
  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  static async getInitialProps ({ Component, ctx }) {
    const {
      res,
      asPath,
      isServer,
      query,
    } = ctx

    let statusCode = httpStatus.OK
    let pageProps = {}
    let layoutProps = {
      renderLayout: true,
    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({
        ...ctx,
      }, state => {
        layoutProps = {
          ...layoutProps,
          ...state,
        }
      })
    }

    if (res) {
      ({ statusCode } = res)
    }

    return {
      ...layoutProps,
      statusCode,
      pageProps: {
        asPath,
        isServer,
        query,
        ...pageProps,
      },
    }
  }

  render () {
    const {
      Component,
      isServer,
      pageProps,
      renderLayout,
      router,
      statusCode,
    } = this.props

    return (
      <div role="application">
        <NextHead>
          <link
            href="https://fonts.googleapis.com/css?family=Source+Code+Pro&amp;display=swap"
            rel="stylesheet" />
        </NextHead>

        {renderLayout && (
          <Banner isServer={isServer} />
        )}

        {statusCode === httpStatus.OK && (
          <Transition
            native
            from={{
              opacity: 0,
            }}
            enter={{
              opacity: 1,
            }}
            leave={{
              opacity: 0,
            }}
            config={{
              tension: 350,
              friction: 12,
              clamp: true,
            }}
            items={{
              Item: Component,
              itemProps: pageProps,
            }}
            keys={router.asPath}>
            {({ Item, itemProps }) => props => (
              <TransitionContext.Provider value={props}>
                <Item {...itemProps} />
              </TransitionContext.Provider>
            )}
          </Transition>
        )}

        {statusCode !== httpStatus.OK && (
          <main
            className="page error-page"
            data-animate
            data-animation="fade-in">
            <div className="page-content">
              <NextError statusCode={statusCode} />
            </div>
          </main>
        )}
      </div>
    )
  }





  /***************************************************************************\
    PropTypes
  \***************************************************************************/

  static propTypes = {
    Component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]).isRequired,
    isServer: PropTypes.bool.isRequired,
    pageProps: PropTypes.object.isRequired,
    renderLayout: PropTypes.bool.isRequired,
    router: PropTypes.object.isRequired,
    statusCode: PropTypes.number.isRequired,
  }





  /***************************************************************************\
    Redux Properties
  \***************************************************************************/

  static mapDispatchToProps = []

  static mapStateToProps = () => ({})
}





const {
  Consumer: TransitionContextConsumer,
} = TransitionContext





export default AppLayout
export { TransitionContextConsumer }
