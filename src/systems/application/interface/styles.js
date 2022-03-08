export const styles = (state, send, settings) => {
  const { theme, layout } = settings
  return {
    container: {
      as: "div",
      show: true,
      className: `w-full h-full overflow-auto`
    },
    authentication: {
      disconnected: {
        container: {
          as: "div",
          appear: true,
          show: settings?.user?.state?.disconnected,
          enter: "transition duration-200",
          enterFrom: "z-0 opacity-0",
          enterTo: "z-10 opacity-100",
          leave: "transition duration-200",
          leaveFrom: "z-10 opacity-300",
          leaveTo: "z-0 opacity-0",
          className: "w-full h-full overflow-auto"
        },
        element: {
          className: `w-full h-full overflow-auto`
        }
      },
      connecting: {
        container: {
          as: "div",
          appear: true,
          show: settings?.user?.state?.connecting,
          enter: "transition duration-200",
          enterFrom: "z-0 opacity-0",
          enterTo: "z-10 opacity-100",
          leave: "transition duration-200",
          leaveFrom: "z-10 opacity-300",
          leaveTo: "z-0 opacity-0",
          className: "w-full h-full overflow-auto"
        },
        element: {
          className: `w-full h-full overflow-auto`
        }
      },
      connected: {
        container: {
          as: "div",
          appear: true,
          show: settings?.user?.state?.connected,
          enter: "transition duration-200",
          enterFrom: "z-0 opacity-0",
          enterTo: "z-10 opacity-100",
          leave: "transition duration-200",
          leaveFrom: "z-10 opacity-300",
          leaveTo: "z-0 opacity-0",
          className: "w-full h-full overflow-auto"
        },
        element: {
          className: `w-full h-full overflow-auto`
        }
      },
      disconnecting: {
        container: {
          as: "div",
          appear: true,
          show: settings?.user?.state?.disconnecting,
          enter: "transition duration-200",
          enterFrom: "z-0 opacity-0",
          enterTo: "z-10 opacity-100",
          leave: "transition duration-200",
          leaveFrom: "z-10 opacity-300",
          leaveTo: "z-0 opacity-0",
          className: "w-full h-full overflow-auto"
        },
        element: {
          className: `w-full h-full overflow-auto`
        }
      }
    }
  }
}

export default styles
