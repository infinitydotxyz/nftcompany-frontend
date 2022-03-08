import React from "react"
import Rive from "rive-react"
import System from "@/systems/application"

export const Loading = ({ src, ...props }) => {
  const styles = {
    container: {
      className: `
        w-full h-full overflow-hidden
        grid items-center
        bg-linear-900 grainy
      `
    },
    animation: { src: src || "animations/loading.riv", ...props }
  }
  return (
    <div {...styles?.container}>
      <Rive {...styles?.animation} />
    </div>
  )
}

export default Loading
