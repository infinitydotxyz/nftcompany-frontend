import React from "react"
import styles from "./interface/styles"
import events from "./interface/events"
import settings from "./interface/settings"
import { useMachine } from "@xstate/react"
import { machine, service } from "./definition"

/*
  ======================================
    'create' hook creates a localized
    version of the state chart of this system.
    If you wish to create a shared service
    of this system, then you need to use the `.use`
    function, after you've wrapped the tree
    in the provider.
  ======================================
*/
export const create = () => {
  const [state, send, service] = useMachine(machine, { devTools: true })
  const data = {
    settings: settings(state, send),
    styles: styles(state, send, settings(state, send)),
    events: events(state, send, settings(state, send))
  }
  return { state, ...data }
}
/*
  ======================================
    Code below is just the framework-glue
    required to run the state machine
    (described within definition) within react.
  ======================================
*/
export const Context = React.createContext()
export const Consumer = Context.Consumer
export const Provider = p => <Context.Provider value={create()} {...p} />
export const use = () => React.useContext(Context)
export default { machine, service, Context, Provider, Consumer, use, create }
