import React from 'react'

const ButtonContent = ({ children, icon }) => (
  <span style={{ paddingRight: 10, fontWeight: 500, paddingLeft: icon ? 0 : 10, paddingTop: 10, paddingBottom: 10 }}>
    {children}
  </span>
)

export default ButtonContent
