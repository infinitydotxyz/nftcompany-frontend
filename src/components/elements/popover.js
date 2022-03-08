import React from "react"
import { Position } from "evergreen-ui"
import { Popover as Popper } from "evergreen-ui"

/*
  ======================================
    You don't want to make a popover
    again and again. This popover component
    relies on Evergreen's Popover because
    it's easy to position compared to Headless UI's.
  ======================================
*/
export const Popover = ({ children, position, ...props }) => {
  const styles = {
    popover: {
      statelessProps: {
        backgroundColor: "transparent",
        boxShadow: "none"
      },
      animationDuration: 50,
      position: Position?.[position || "BOTTOM_RIGHT"]
    }
  }
  return (
    <Popper {...styles?.popover} {...props}>
      {children}
    </Popper>
  )
}

export default Popover
