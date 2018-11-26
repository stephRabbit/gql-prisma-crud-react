import React from 'react'

import spinnerGif from './spinner.gif'

const Spinner = () => {
  return (
    <div>
      <img
        alt="Load..."
        src={spinnerGif}
        style={{
          display: 'block',
          margin: 'auto',
          width: '200px',
        }}
      />
    </div>
  )
}

export default Spinner
