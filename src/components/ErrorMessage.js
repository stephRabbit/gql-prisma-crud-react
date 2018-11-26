import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

const ErrorMessage = ({ error }) => {
  return (
    <Fragment>
      <p
        className="alert alert-danger"
        role="alert"
      >
        Oops, something went wrong!
      </p>
      <pre>
        {error.toString()}
      </pre>
    </Fragment>
  )
}

ErrorMessage.defaultProps = {
  error: {}
}

ErrorMessage.protoTypes = {
  error: PropTypes.object.isRequired
}

export default ErrorMessage
