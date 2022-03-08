import React from "react"

import chakra from "./chakra.ui"
import themeui from "./theme.ui"
import evergreen from "./evergreen.ui"

import { ChakraProvider as Chakra } from "@chakra-ui/react"
import { ThemeProvider as ThemeUI } from "theme-ui"
import { ThemeProvider as Evergreen } from "evergreen-ui"

export const Theme = ({ children, ...props }) => {
  return (
    <Chakra theme={chakra}>
      <ThemeUI theme={themeui}>
        <Evergreen value={evergreen}>{children}</Evergreen>
      </ThemeUI>
    </Chakra>
  )
}

export default Theme
