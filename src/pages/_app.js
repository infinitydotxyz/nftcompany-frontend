import React from "react"
import Systems from "@/systems"
import "@/settings/theme/tailwind/index.css"
import Theme from "@/settings/theme"

const NoSSR = ({ children }) => (
  <>
    <div className="w-full h-full overflow-hidden" suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  </>
)

export const Router = props => {
  /*
    ======================================
      This component is the entry point of
      the application. So if you have any global
      styles or anything else that you want to
      have applied globally, you can modify this
      component to achieve them.
    ======================================
  */
  const { Component, pageProps } = props
  return (
    <Theme>
      <NoSSR>
        <Systems>
          <Component {...pageProps} />
        </Systems>
      </NoSSR>
    </Theme>
  )
}

export default Router
