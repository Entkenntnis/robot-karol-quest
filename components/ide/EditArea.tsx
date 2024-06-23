import { EditorView } from '@codemirror/view'
import { useEffect, useRef } from 'react'
import {
  faArrowsSpin,
  faArrowsSplitUpAndLeft,
  faArrowsTurnToDots,
  faCircleExclamation,
  faDiagramSuccessor,
  faLock,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons'
import { forceLinting } from '@codemirror/lint'

import { setEditable } from '../../lib/codemirror/basicSetup'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'
import { Editor } from './Editor'
import { textRefreshDone } from '../../lib/commands/json'
import dynamic from 'next/dynamic'
import { setLanguage, showJavaInfo } from '../../lib/commands/language'
import { Settings } from '../../lib/state/types'
import { JavaEditor } from './JavaEditor'
import clsx from 'clsx'
import { PythonEditor } from './PythonEditor'
import {
  cursorLineEnd,
  insertNewlineAndIndent,
  simplifySelection,
} from '@codemirror/commands'

const BlockEditor = dynamic(
  () => import('./BlockEditor').then((mod) => mod.BlockEditor),
  {
    ssr: false,
  }
)

export function EditArea() {
  const core = useCore()

  const codeState = core.ws.ui.state

  const view = useRef<EditorView>()

  core.view = view

  useEffect(() => {
    if (core.ws.ui.needsTextRefresh && view.current) {
      view.current.dispatch({
        changes: {
          from: 0,
          to: view.current.state.doc.length,
          insert:
            core.ws.settings.language == 'robot karol'
              ? core.ws.code
              : core.ws.settings.language == 'python'
              ? core.ws.pythonCode
              : core.ws.javaCode,
        },
      })
      forceLinting(view.current)
      textRefreshDone(core)
    }

    // yeah, I don't know how to do this with react so here is my own logic
    if (!document.getElementById('my-execution-marker')) {
      const gutter = document.getElementsByClassName('my-gutter')[0]
      if (gutter) {
        const innerDiv = document.createElement('div')
        innerDiv.className = clsx(`absolute h-5 w-5 left-3 text-blue-500`)
        innerDiv.id = 'my-execution-marker'
        innerDiv.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 448 512" aria-hidden="true"' +
          ' focusable="false" class="jsx-151747aa6e04d21e fa-icon"><path fill="currentColor" ' +
          'd="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5' +
          ' 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5' +
          ' 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" class="jsx-151747aa6e04d21e"></path></svg>'
        gutter.appendChild(innerDiv)
      }
    }
    const marker = document.getElementById('my-execution-marker')
    if (marker) {
      marker.style.top = `${4 + (core.ws.ui.gutter - 1) * 22.4}px`
      marker.style.display =
        (codeState == 'running' || core.ws.ui.karolCrashMessage) &&
        core.ws.ui.gutter > 0
          ? 'block'
          : 'none'

      marker.style.color = core.ws.ui.karolCrashMessage ? 'rgb(220 38 38)' : ''
    }
  })

  useEffect(() => {
    if (codeState == 'ready' && !core.ws.quest.testerHandler) {
      setEditable(view.current, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeState])

  function insertCodeSnippet(insert: string[], cursorOffset: number) {
    if (view.current) {
      simplifySelection(view.current)
      cursorLineEnd(view.current)
      const { from, to } = view.current.state.doc.lineAt(
        view.current.state.selection.main.anchor
      )
      let lineText = view.current.state.sliceDoc(from, to)

      if (lineText.trim().length > 0) {
        // start snippet on new line
        insertNewlineAndIndent(view.current)
        const { from, to } = view.current.state.doc.lineAt(
          view.current.state.selection.main.anchor
        )
        lineText = view.current.state.sliceDoc(from, to)
      }

      const range = view.current.state.selection.main
      view.current.dispatch({
        changes: {
          from: range.to,
          to: range.to,
          insert: insert.join('\n' + lineText),
        },
        selection: { anchor: range.to + cursorOffset },
      })
      view.current.focus()
    }
  }

  if (core.ws.settings.mode == 'code') {
    return (
      <div className="h-full flex flex-col overflow-y-auto relative">
        {core.ws.settings.language === 'python' && (
          <div className="bg-gray-100 pr-32 py-2 flex items-baseline">
            <div className="mr-4 ml-3">Einfügen:</div>
            <div>
              <button
                onClick={() => {
                  let safeLoopVar = 'i'
                  const candidates =
                    'ijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZi'
                  for (let i = 0; i < candidates.length; i++) {
                    safeLoopVar = candidates[i]
                    if (
                      !view.current?.state.doc
                        .toString()
                        .includes('for ' + safeLoopVar)
                    ) {
                      break // found it
                    }
                  }
                  insertCodeSnippet(
                    [
                      'for ' + safeLoopVar + ' in range():',
                      '    # Aktion(en)',
                      '',
                    ],
                    15
                  )
                }}
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 inline-block mr-3 my-1 rounded"
              >
                <FaIcon icon={faArrowsSpin} /> for-Anweisung
              </button>
              <button
                onClick={() => {
                  insertCodeSnippet(
                    ['while : # Bedingung', '    # Aktion(en)', ''],
                    6
                  )
                }}
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 inline-block mr-3 my-1 rounded"
              >
                <FaIcon icon={faArrowsTurnToDots} /> while-Anweisung
              </button>
              <button
                onClick={() => {
                  insertCodeSnippet(
                    ['if : # Bedingung', '    # JA-Aktion(en)', ''],
                    3
                  )
                }}
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 inline-block mr-3 my-1 rounded"
              >
                <FaIcon icon={faArrowsSplitUpAndLeft} /> if-Anweisung
              </button>
              <button
                onClick={() => {
                  insertCodeSnippet(
                    [
                      'if : # Bedingung',
                      '    # JA-Aktion(en)',
                      'else:',
                      '    # NEIN-Aktion(en)',
                      '',
                    ],
                    3
                  )
                }}
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 inline-block mr-3 my-1 rounded"
              >
                <FaIcon icon={faArrowsSplitUpAndLeft} />
                <FaIcon icon={faArrowsSplitUpAndLeft} /> if-else-Anweisung
              </button>
              <button
                onClick={() => {
                  insertCodeSnippet(['def ():', '    # Aktion(en)', ''], 4)
                }}
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 inline-block mr-3 my-1 rounded"
              >
                <FaIcon icon={faDiagramSuccessor} /> eigene Methode
              </button>
            </div>
          </div>
        )}
        {renderEditor()}
        {core.ws.ui.state == 'error' && (
          <div className="w-full overflow-auto min-h-[47px] max-h-[200px] flex-grow flex-shrink-0 bg-red-50">
            <div className="flex justify-between mt-[9px]">
              <div className="px-3 pb-1 pt-0">
                <p className="mb-2">
                  <FaIcon
                    icon={faCircleExclamation}
                    className="text-red-600 mr-2"
                  />
                  {core.strings.ide.problems}:
                </p>
                {core.ws.ui.errorMessages.map((err, i) => (
                  <p className="mb-2" key={err + i.toString()}>
                    {err}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
        {core.ws.settings.lng == 'de' && (
          <div className="absolute right-4 bottom-1">
            {core.ws.ui.proMode ? (
              <div
                className={clsx(
                  'px-2 py-1 bg-yellow-200 rounded pl-2',
                  core.ws.ui.state !== 'ready' && 'pointer-events-none',
                  core.ws.ui.state == 'error' && 'invisible',
                  core.ws.ui.state == 'running' && 'invisible'
                )}
              >
                {core.ws.ui.lockLanguage ? (
                  <FaIcon icon={faLock} />
                ) : (
                  <button
                    onClick={() => {
                      showJavaInfo(core)
                    }}
                  >
                    <FaIcon icon={faQuestionCircle} />
                  </button>
                )}{' '}
                Java Profi-Modus (im Aufbau)
              </div>
            ) : (
              <div
                className={clsx(
                  'p-1 bg-gray-200 rounded pl-2',
                  core.ws.ui.state !== 'ready' && 'pointer-events-none',
                  core.ws.ui.state == 'error' && 'invisible',
                  core.ws.ui.state == 'running' && 'invisible'
                )}
              >
                {core.ws.ui.lockLanguage ? (
                  <FaIcon icon={faLock} />
                ) : (
                  <button
                    onClick={() => {
                      showJavaInfo(core)
                    }}
                  >
                    <FaIcon icon={faQuestionCircle} />
                  </button>
                )}{' '}
                {core.strings.ide.language}:
                <select
                  className="px-1 py-0.5 inline-block ml-2 bg-white rounded hover:bg-gray-100 cursor-pointer"
                  value={core.ws.settings.language}
                  onChange={(e) => {
                    setLanguage(core, e.target.value as Settings['language'])
                  }}
                  disabled={
                    core.ws.ui.state !== 'ready' || !!core.ws.ui.lockLanguage
                  }
                >
                  <option value="robot karol">Robot Karol</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>{' '}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return <BlockEditor />

  function renderEditor() {
    return (
      <div className="flex h-full overflow-y-auto relative flex-shrink">
        <div className="w-full overflow-auto h-full flex">
          <div className="w-full h-full flex flex-col relative">
            {core.ws.settings.language == 'robot karol' ? (
              <Editor innerRef={view} />
            ) : core.ws.settings.language == 'java' ? (
              <JavaEditor innerRef={view} />
            ) : (
              <PythonEditor innerRef={view} />
            )}
          </div>
        </div>
      </div>
    )
  }
}
