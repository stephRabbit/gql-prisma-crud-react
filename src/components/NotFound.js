import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h2>
        Slow down cowboy!<br />
        <sup>
          <em>You must have taken a wrong turn.</em>
        </sup>
      </h2>
      <Link to="/">Back</Link>
    </div>
  )
}

export default NotFound
