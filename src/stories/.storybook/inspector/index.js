import React from "react"
import styles from "./styles.yaml"
import { inspect } from "@xstate/inspect"

export const Inspector = React.forwardRef(({ children, ...props }, ref) => {
  const [inspecting, setInspecting] = React.useState(false)
  const vertical = props?.horizontal ? false : true
  const inverted = props?.inverted ? true : false
  const sequence = props?.inverted ? "inverted" : "default"
  const layout = props?.vertical ? "vertical" : props.horizontal ? "horizontal" : "horizontal"
  const style = styles[layout][sequence]

  React.useLayoutEffect(() => {
    const container = document.querySelector("iframe[data-xstate]")
    const i = inspect({ iframe: () => container })
    setInspecting(true)
    return () => i.disconnect()
  }, [])

  return (
    <>
      <div style={style.container} ref={ref}>
        {inverted ? (
          <>
            <iframe style={style.iframe} frameBorder="0" data-xstate></iframe>
            <div style={style.children}>{inspecting && children}</div>
          </>
        ) : (
          <>
            <div style={style.children}>{inspecting && children}</div>
            <iframe style={style.iframe} frameBorder="0" data-xstate></iframe>
          </>
        )}
      </div>
    </>
  )
})

export default Inspector
