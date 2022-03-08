import React from "react"
import { Box } from "theme-ui"
import skeleton from "./skeleton.yaml"

export const Element = React.forwardRef(({ children, styles, ...props }, ref) => {
  const options = { ...skeleton.element, ...styles }
  return (
    <Box ref={ref} {...props} sx={options}>
      {children}
    </Box>
  )
})

export default Element
