import {
  faExternalLink,
  faPencil,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import { createRef, Fragment, useEffect } from 'react'

import {
  forceRerender,
  setPersist,
  setShowHighscore,
  setShowImpressum,
  setShowPrivacy,
} from '../lib/commands/mode'
import { setOverviewScroll, startQuest } from '../lib/commands/quest'
import { questDeps } from '../lib/data/dependencies'
import { questList } from '../lib/data/overview'
import { questData } from '../lib/data/quests'
import { isQuestDone, isQuestStarted } from '../lib/helper/session'
import { useCore } from '../lib/state/core'
import { FaIcon } from './FaIcon'
import { Highscore } from './Highscore'
import { ImpressumModal } from './ImpressumModal'
import { PrivacyModal } from './PrivacyModal'
import { View } from './View'

export function Overview() {
  const core = useCore()

  const overviewContainer = createRef<HTMLDivElement>()

  const name = (
    localStorage.getItem('robot_karol_online_name') ??
    sessionStorage.getItem('robot_karol_online_name') ??
    ''
  ).trim()

  useEffect(() => {
    if (overviewContainer.current && core.ws.ui.overviewScroll > 0) {
      overviewContainer.current.scrollTop = core.ws.ui.overviewScroll
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="h-full overflow-auto" ref={overviewContainer}>
        {core.ws.ui.showHighscore && (
          <div className="absolute inset-0 bg-white z-50">
            <div className="absolute right-2 top-2">
              <button
                className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 rounded"
                onClick={() => {
                  setShowHighscore(core, false)
                }}
              >
                Schließen
              </button>
            </div>
            <div className="mt-12 mb-12">
              <Highscore />
            </div>
          </div>
        )}
        <div className="flex flex-col relative main-bg min-h-full">
          <div className="flex justify-center">
            <div
              className={clsx(
                'flex mt-6 items-center rounded-xl',
                'p-4 px-12 bg-white/10'
              )}
            >
              <img
                src="/robotE.png"
                alt="Bild von Robot Karol"
                className="mr-8"
                height={71}
                width={40}
              />
              <h1 className="text-5xl whitespace-nowrap">Robot Karol Online</h1>
            </div>
          </div>
          <div className="absolute right-3 top-3">
            {name && (
              <span className="text-center mr-4">
                {name}&nbsp;&nbsp;&nbsp;|
              </span>
            )}
            <button
              className="mr-4 font-bold"
              onClick={() => {
                setShowHighscore(core, true)
              }}
            >
              Highscore
            </button>
            <a
              href="/#editor"
              className="px-2 py-0.5 bg-blue-300 hover:bg-blue-400 rounded"
            >
              <FaIcon icon={faPenToSquare} className="mr-1" />
              Aufgaben-Editor
            </a>
          </div>
          {core.ws.ui.isAnalyze && (
            <div className="bg-white px-16 pb-8 mt-4">
              <p className="my-6">
                Daten ab {core.ws.analyze.cutoff}, insgesamt{' '}
                {core.ws.analyze.count} Einträge
              </p>
              <h2 className="mt-6 mb-4 text-lg">Freigegebene Aufgaben</h2>
              {core.ws.analyze.published.map((entry, i) => (
                <p key={i} className="my-2">
                  <a
                    href={`/#${entry.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {entry.id}
                  </a>{' '}
                  - {entry.date}
                </p>
              ))}
              <p className="mt-6 mb-4">
                {core.ws.analyze.showEditor} mal Editor angezeigt,{' '}
                {core.ws.analyze.showPlayground} mal Spielwiese,{' '}
                {core.ws.analyze.showDemo} mal Demo,{' '}
                {core.ws.analyze.showStructogram} mal Struktogramm,{' '}
                {core.ws.analyze.usePersist} mal Fortschritt gespeichert
              </p>
              <h2 className="mt-6 mb-4 text-lg">Bearbeitungen</h2>
              {Object.entries(core.ws.analyze.customQuests).map((entry, i) => (
                <p key={i} className="my-2">
                  <a
                    href={`/#${entry[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {entry[0]}
                  </a>{' '}
                  - {entry[1].start} mal gestartet, {entry[1].complete} mal
                  abgeschlossen
                </p>
              ))}
              <h2 className="mt-6 mb-4 text-lg">Legacy</h2>{' '}
              {Object.entries(core.ws.analyze.legacy).map((entry, i) => (
                <p key={i} className="my-2">
                  <a
                    href={`/?id=${entry[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {entry[0]}
                  </a>{' '}
                  - {entry[1].count} mal gestartet
                </p>
              ))}
              <h2 className="mt-6 mb-4 text-lg">Zeiten</h2>
              <p className="mb-2">
                Median: {format(median(core.ws.analyze.userTimes))}
              </p>
              <p>{core.ws.analyze.userTimes.map(format).join(', ')}</p>
              {/*<h2 className="mt-6 mb-4 text-lg">Anzahl gelöste Aufgaben</h2>
              <p className="mb-2">
                Median: {median(core.ws.analyze.solvedCount)}
              </p>
              <p>{core.ws.analyze.solvedCount.join(', ')}</p>*/}
            </div>
          )}
          <div className="w-[1240px] h-[1900px] mx-auto mt-8 relative">
            {questList.map(renderQuest)}
          </div>
          <div className="flex-auto"></div>
          {!core.ws.ui.isAnalyze && (
            <div className="text-sm text-right mr-4 mt-36 mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={!!localStorage.getItem('karol_quest_beta_persist')}
                  onChange={(e) => {
                    setPersist(core, e.target.checked)
                    forceRerender(core)
                  }}
                />{' '}
                Fortschritt dauerhaft speichern
              </label>{' '}
              |{' '}
              <button
                className="hover:underline"
                onClick={() => {
                  const res = confirm('Fortschritt jetzt zurücksetzen?')
                  if (res) {
                    setPersist(core, false)
                    sessionStorage.clear()
                    forceRerender(core)
                  }
                }}
              >
                zurücksetzen
              </button>
            </div>
          )}

          <div className="text-center mb-2">
            Version: Februar 2023 |{' '}
            <a
              className="hover:underline cursor-pointer"
              href={
                window.location.protocol +
                '//' +
                window.location.host +
                '/?id=Z9xO1rVGj'
              }
            >
              Spielwiese
            </a>{' '}
            |{' '}
            <button
              className="hover:underline"
              onClick={() => {
                setShowImpressum(core, true)
              }}
            >
              Impressum
            </button>{' '}
            |{' '}
            <button
              className="hover:underline"
              onClick={() => {
                setShowPrivacy(core, true)
              }}
            >
              Datenschutz
            </button>{' '}
            |{' '}
            {renderExternalLink(
              'Infos',
              'https://github.com/Entkenntnis/robot-karol-online#readme'
            )}
          </div>
          {core.ws.ui.showImpressum && <ImpressumModal />}
          {core.ws.ui.showPrivacy && <PrivacyModal />}
        </div>
      </div>
      <style jsx>{`
        .main-bg {
          background-color: #4158d0;
          background-image: linear-gradient(
            43deg,
            #4158d0 0%,
            #c850c0 46%,
            #ffcc70 100%
          );
        }
      `}</style>
    </>
  )

  function renderExternalLink(title: string, href: string) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        <span className="hover:underline">{title}</span>{' '}
        <FaIcon icon={faExternalLink} className="text-xs" />
      </a>
    )
  }

  function isQuestVisible(id: number) {
    const previous = questList.indexOf(id)

    return (
      core.ws.ui.isDemo ||
      core.ws.ui.isAnalyze ||
      questDeps[id].some(isQuestDone) ||
      previous <= 0 ||
      isQuestDone(questList[previous - 1])
    )
  }

  function renderQuest(index: number, i: number) {
    const row = Math.floor(i / 4) // zig zag
    const col = (i % 4) + [0.5, 0, 0.5, 1][row % 4]
    const top = `${row * 210 + (row + 1) * 50}px`
    const left = `${(col + 1) * 35 + col * 200}px`

    // check for deps, empty deps -> always visible
    if (!isQuestVisible(index)) {
      let hasSolvedForward = false
      for (let j = i + 1; j < questList.length; j++) {
        if (isQuestVisible(questList[j])) {
          hasSolvedForward = true
          break
        }
      }
      if (!hasSolvedForward) return null
      return (
        <div
          key={index}
          className="absolute w-[200px] h-[210px] border-2 rounded-md border-dashed"
          style={{ top, left }}
        ></div>
      )
    }

    const data = questData[index]

    const questDone = core.ws.ui.isAnalyze ? false : isQuestDone(index)

    //const reachableCount = core.ws.analyze.reachable[index]

    const task = questData[index].tasks[0]

    //const times = quartiles(core.ws.analyze.questTimes[index] ?? [0])

    return (
      <Fragment key={index}>
        <div className="absolute" style={{ top, left }}>
          <div
            className={clsx(
              'p-3 bg-white rounded-md relative z-10',
              'w-[200px] h-[210px] cursor-pointer rainbow',
              questDone && 'quest-done'
            )}
            tabIndex={0}
            onClick={() => {
              setOverviewScroll(
                core,
                overviewContainer.current?.scrollTop ?? -1
              )
              startQuest(core, index)
            }}
          >
            <div>
              <div>
                <span
                  className={clsx(
                    'py-1 inline-block',
                    questDone ? 'text-gray-600' : 'font-bold'
                  )}
                >
                  {data.title}
                  {core.ws.ui.isAnalyze && <small>&nbsp;({index})</small>}
                </span>
              </div>
            </div>
            <div className="">
              <div className="absolute right-3 top-3">
                {isQuestStarted(index) && (
                  <span className="text-yellow-600">
                    <FaIcon icon={faPencil} />
                  </span>
                )}
              </div>
              {core.ws.ui.isAnalyze &&
                (() => {
                  const entry = core.ws.analyze.quests[index]
                  if (index == 1 && entry) {
                    return <span>{entry.complete} Spieler*innen</span>
                  }
                  if (entry) {
                    return (
                      <span>
                        {entry.reachable} / {entry.complete} /{' '}
                        <strong>
                          {Math.round((entry.complete / entry.reachable) * 100)}
                          %
                        </strong>
                      </span>
                    )
                  }
                  return null
                })()}{' '}
              {core.ws.ui.isAnalyze && (
                <div className="text-sm text-gray-400">
                  Deps: [{questDeps[index].join(', ')}]
                </div>
              )}
              <div className="overflow-hidden -mt-6 h-[144px]">
                <View
                  world={questDone ? task.target! : task.start}
                  preview={
                    task.target === null
                      ? undefined
                      : { track: [], world: task.target }
                  }
                  hideKarol={questDone}
                  wireframe={false}
                  className={clsx(
                    'block mx-auto max-h-full',
                    questDone && 'opacity-30'
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .quest-done:before {
            filter: grayscale(60%) blur(5px) !important;
          }

          .rainbow:before {
            content: '';
            background: linear-gradient(
              46deg,
              #ff0000,
              #ff7300,
              #fffb00,
              #48ff00,
              #00ffd5,
              #002bff,
              #7a00ff,
              #ff00c8,
              #ff0000,
              #ff7300,
              #fffb00
            );
            position: absolute;
            top: -2px;
            left: -2px;
            background-size: 400%;
            z-index: -1;
            filter: blur(5px);
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            animation: glowing 20s linear infinite;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            border-radius: 8px;
          }

          .rainbow:active {
            color: #000;
          }

          .rainbow:hover:before {
            opacity: 1;
          }

          .rainbow:after {
            z-index: -1;
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: white;
            border-radius: 8px;
            left: 0;
            top: 0;
          }

          @keyframes glowing {
            0% {
              background-position: 0 0;
            }
            50% {
              background-position: 400% 0;
            }
            100% {
              background-position: 0 0;
            }
          }
        `}</style>
      </Fragment>
    )
  }
}

function median(arr: number[]) {
  const middle = Math.floor(arr.length / 2)
  if (arr.length % 2 === 0) {
    return (arr[middle - 1] + arr[middle]) / 2
  } else {
    return arr[middle]
  }
}

function quartiles(arr: number[]) {
  var max = arr[0]
  var min = arr[arr.length - 1]
  var q3 = arr[Math.floor((arr.length - 1) / 4)]
  var q2 = arr[Math.floor((arr.length - 1) / 2)]
  var q1 = arr[Math.floor(((arr.length - 1) * 3) / 4)]
  return { min: min, q1: q1, q2: q2, q3: q3, max: max }
}

function format(t: number) {
  const s = Math.round(t / 1000)
  if (s < 60) {
    return `${s}s`
  }
  const m = Math.round(s / 60)
  if (m < 120) {
    return `${m}min`
  }
  const h = Math.round(m / 60)
  if (h < 48) {
    return `${h}h`
  }
  const d = Math.round(h / 24)
  return `${d}days`
}
