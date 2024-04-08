import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { produce, Draft } from 'immer'
import { EditorView } from '@codemirror/view'

import { CoreRefs, CoreState, WorkspaceState, World } from './types'
import { createDefaultCoreState } from './create'
import { deStrings } from '../strings/de'
import { enStrings } from '../strings/en'

// set up core within app
export function useCreateCore() {
  const [coreState, setCoreState] = useState<CoreState>(() =>
    createDefaultCoreState()
  )
  const coreRef = useRef<CoreRefs>({ state: coreState })
  return useMemo(() => new Core(setCoreState, coreRef), [])
}

export const CoreContext = createContext<Core | null>(null)

// access to core
export function useCore() {
  const val = useContext(CoreContext)
  if (val) {
    return val
  }
  throw new Error('Bad usage of core state')
}

// wrap App
export const CoreProvider = CoreContext.Provider

export class Core {
  _setCoreState: Dispatch<SetStateAction<CoreState>>
  _coreRef: MutableRefObject<CoreRefs>
  _workspaceStorage: { [key: string]: { world: World; code: string } }

  blockyResize: undefined | (() => void)

  view?: MutableRefObject<EditorView | undefined> // WOW, this is bad

  executionEndCallback: undefined | (() => void)

  constructor(
    setCoreState: Dispatch<SetStateAction<CoreState>>,
    coreRef: MutableRefObject<CoreRefs>
  ) {
    this._setCoreState = setCoreState
    this._coreRef = coreRef
    this._workspaceStorage = {}
  }

  // async-safe way to access core state
  get state() {
    return this._coreRef.current.state
  }

  get ws() {
    return this.state.workspace
  }

  get strings() {
    return this.state.workspace.settings.lng == 'de' ? deStrings : enStrings
  }

  // always mutate core state with this function
  mutateCore(updater: (draft: Draft<CoreState>) => void) {
    const newState = produce(this.state, updater)
    this._coreRef.current.state = newState
    this._setCoreState(newState)
  }

  // proxy call to core, workspace aware
  mutateWs(updater: (draft: Draft<WorkspaceState>) => void) {
    this.mutateCore((state) => {
      updater(state.workspace)
    })
  }
}
