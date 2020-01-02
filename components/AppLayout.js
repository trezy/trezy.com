// Module imports
import { connect } from 'react-redux'
import NextHead from 'next/head'
import NextError from 'next/error'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import React from 'react'
import Router from 'next/router'





// Local imports
import Banner from './Banner'
import httpStatus from '../helpers/httpStatus'





// Setup NProgress
NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeError', () => NProgress.done())
Router.events.on('routeChangeComplete', () => NProgress.done())





const AppLayout = props => {
  const {
    Component,
    isServer,
    pageProps,
    renderLayout,
    statusCode,
  } = props

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

      {(statusCode === httpStatus.OK) && (
        <Component {...pageProps} />
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

AppLayout.getInitialProps = async ({ Component, ctx }) => {
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

AppLayout.propTypes = {
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





export default connect()(AppLayout)
