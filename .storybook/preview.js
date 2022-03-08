import React from "react"
import { addDecorator } from "@storybook/react"
import { addParameters } from "@storybook/client-api"
import { DocsContainer } from "@storybook/addon-docs"
import "../src/settings/theme/tailwind/index.css"

addDecorator(story => <div style={{ width: "100%", height: "100%" }}>{story()} </div>)

export const parameters = {
  layout: "padded",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  options: {
    storySort: {
      order: ["Introduction", "Modifiers", "Atoms", "Molecules", "Organisms", "Universe", "Studies"]
    }
  },
  docs: {
    container: ({ children, context }) => <DocsContainer context={context}>{children}</DocsContainer>
  }
}
