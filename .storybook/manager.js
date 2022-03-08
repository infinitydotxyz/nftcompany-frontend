import { addons } from "@storybook/addons"
import themes from "./themes"

addons.setConfig({
  theme: themes.initial,
  isFullscreen: false,
  showNav: true,
  showPanel: true,
  panelPosition: "bottom",
  sidebarAnimations: true,
  enableShortcuts: true,
  isToolshown: true,
  initialActive: "sidebar",
  showRoots: false
})
