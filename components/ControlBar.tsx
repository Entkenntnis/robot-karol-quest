import {
  faCaretLeft,
  faCircleCheck,
  faExclamationTriangle,
  faGenderless,
  faPersonWalking,
  faPlay,
  faRotateRight,
  faStop,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons'

import { setSpeedSliderValue, showErrorModal } from '../lib/commands/mode'
import { closeOutput, finishTask, restartProgram } from '../lib/commands/quest'
import { abort } from '../lib/commands/vm'
import { sliderToDelay } from '../lib/helper/speedSlider'
import { useCore } from '../lib/state/core'
import { FaIcon } from './FaIcon'

export function ControlBar() {
  const core = useCore()
  if (
    core.ws.quest.progress == 100 &&
    core.ws.ui.state != 'running' &&
    !core.ws.ui.karolCrashMessage &&
    !core.ws.quest.completed.includes(core.ws.quest.lastStartedTask!)
  ) {
    return (
      <div className="flex items-center justify-center p-2">
        <p className="text-center">
          Gut gemacht! Dein Programm hat den Auftrag erfüllt.
          <br />
          <button
            onClick={() => {
              finishTask(core)
            }}
            className="px-2 py-0.5 rounded bg-green-200 ml-3 mt-3 mb-2"
          >
            <FaIcon icon={faCircleCheck} className="mr-1" />
            Ok
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="ml-7 font-bold">{renderStatus()}</p>
        <p className="ml-2 mb-1">
          {core.ws.ui.state != 'running' && (
            <button
              onClick={() => {
                closeOutput(core)
              }}
              className="px-2 py-0.5 rounded bg-gray-200 ml-3 mt-2"
            >
              <FaIcon icon={faCaretLeft} className="mr-1" />
              zurück
            </button>
          )}
          {core.ws.ui.state == 'error' && (
            <button
              onClick={() => {
                showErrorModal(core)
              }}
              className="px-2 py-0.5 rounded bg-red-200 ml-3"
            >
              Probleme anzeigen
            </button>
          )}
          {core.ws.ui.state == 'ready' && (
            <>
              <button
                onClick={() => {
                  restartProgram(core)
                }}
                className="px-2 py-0.5 rounded bg-green-300 ml-3 mt-2"
              >
                <FaIcon
                  icon={core.ws.ui.isEndOfRun ? faRotateRight : faPlay}
                  className="mr-1"
                />
                Programm starten
              </button>
            </>
          )}
          {core.ws.ui.state == 'running' && (
            <button
              onClick={() => {
                abort(core)
              }}
              className="px-2 py-0.5 rounded bg-amber-400 ml-3 mt-2"
            >
              <FaIcon icon={faStop} className="mr-1" />
              Abbrechen
            </button>
          )}
        </p>
      </div>

      <div className="max-w-[230px] mr-3 my-3">
        {(
          Math.round((1000 / sliderToDelay(core.ws.ui.speedSliderValue)) * 10) /
          10
        )
          .toFixed(1)
          .replace('.', ',')}{' '}
        Schritte/s
        <input
          type="range"
          value={core.ws.ui.speedSliderValue}
          onChange={(val) => {
            setSpeedSliderValue(core, parseFloat(val.target.value))
          }}
          min="0"
          max="20"
          step="1"
          className="w-full h-3 cursor-pointer mt-4"
        />
      </div>
    </div>
  )

  function renderStatus() {
    const state = core.ws.ui.state
    if (state == 'error') {
      return (
        <>
          <FaIcon icon={faExclamationTriangle} className="mr-1" /> Programm
          unvollständig
        </>
      )
    }
    if (state == 'loading' && !core.ws.ui.isEndOfRun) {
      return <span className="text-gray-400">Programm wird eingelesen ...</span>
    }
    if (state == 'running') {
      return (
        <>
          <FaIcon icon={faPersonWalking} className="mr-1" /> Programm wird
          ausgeführt
        </>
      )
    } else {
      if (core.ws.ui.karolCrashMessage) {
        return (
          <span className="text-red-600">
            {' '}
            <FaIcon
              icon={faExclamationTriangle}
              className="mr-1"
            /> Fehler: {core.ws.ui.karolCrashMessage}
          </span>
        )
      }
      if (core.ws.ui.isEndOfRun) {
        return (
          <>
            <FaIcon icon={faGenderless} className="mr-1" /> Ausführung beendet{' '}
            {core.ws.ui.isManualAbort ? ' (abgebrochen)' : ''}
          </>
        )
      }
      return (
        <>
          <FaIcon icon={faThumbsUp} className="mr-1" /> bereit
        </>
      )
    }
  }
}
