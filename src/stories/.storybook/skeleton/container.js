import React from "react"
import { Box } from "theme-ui"
import skeleton from "./skeleton.yaml"

export const Container = ({ children, ...props }) => {
  const options = { ...skeleton.container, ...props }
  return <Box sx={options}>{children}</Box>
}

export default Container
