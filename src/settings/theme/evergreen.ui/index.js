import { defaultTheme as defaults } from "evergreen-ui"
import foundations from "./foundations.yaml"
import components from "./components.yaml"

export default {
  ...defaults,
  ...foundations,
  components: {
    ...defaults.components,
    ...components
  }
}
