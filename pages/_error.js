// Module imports
import NextError from 'next/error'
import PropTypes from 'prop-types'
import React from 'react'





// Local imports
import httpStatus from '../helpers/httpStatus'
import PageWrapper from '../components/PageWrapper'





const ErrorPage = ({ statusCode }) => (
  <PageWrapper
    description="An error has occured."
    title="Error">
    <NextError statusCode={statusCode} />
  </PageWrapper>
)

ErrorPage.getInitialProps = props => {
  const {
    res,
    err: error,
  } = props
  let statusCode = httpStatus.NOT_FOUND

  if (res) {
    statusCode = res.statusCode
  } else if (error) {
    statusCode = error.statusCode
  }

  return { statusCode }
}

ErrorPage.propTypes = {
  statusCode: PropTypes.number.isRequired,
}





export default ErrorPage
