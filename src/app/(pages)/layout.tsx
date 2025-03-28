import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <div>
      <h1>This is the nav bar that will float</h1>
      {children}
    </div>
  )
}

export default layout