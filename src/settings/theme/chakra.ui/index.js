import elements from "./elements.yaml"
import application from "./application.yaml"
import foundations from "./foundations.yaml"
import { extendTheme } from "@chakra-ui/react"

export default extendTheme({
  ...application,
  ...elements,
  ...foundations
})
