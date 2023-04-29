import {
  faCheckCircle,
  faExternalLink,
  faPencil,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import { Fragment, useEffect } from 'react'

import {
  forceRerender,
  hideSaveHint,
  setPersist,
} from '../../lib/commands/mode'
import { setOverviewScroll, startQuest } from '../../lib/commands/quest'
import { questDeps } from '../../lib/data/dependencies'
import { questList } from '../../lib/data/overview'
import { questData } from '../../lib/data/quests'
import { isQuestDone, isQuestStarted } from '../../lib/helper/session'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'
import { View } from '../helper/View'
import { switchToPage } from '../../lib/commands/page'
import { showModal } from '../../lib/commands/modal'
import {
  getUserName,
  isPersisted,
  resetStorage,
} from '../../lib/storage/storage'
import { HFullStyles } from '../helper/HFullStyles'

export function Overview() {
  const core = useCore()

  const name = getUserName()

  useEffect(() => {
    if (core.ws.overview.overviewScroll > 0) {
      document.getElementById('scroll-container')!.scrollTop =
        core.ws.overview.overviewScroll
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <div className="h-full overflow-auto" id="scroll-container">
        <div className="flex flex-col relative main-bg min-h-full min-w-fit">
          <div className="flex justify-center">
            <div
              className={clsx(
                'flex mt-12 items-center rounded-xl',
                'p-2 px-6 bg-white/10'
              )}
            >
              <h1 className="text-2xl whitespace-nowrap">Robot Karol Online</h1>
            </div>
          </div>
          <div className="fixed xl:absolute right-6 xl:right-3 top-3">
            {name && (
              <span className="text-center mr-4">
                {name}&nbsp;&nbsp;&nbsp;|
              </span>
            )}
            <button
              className="mr-4 font-bold"
              onClick={() => {
                core.mutateWs((ws) => {
                  ws.page = 'highscore'
                })
              }}
            >
              Highscore
            </button>
            <button
              onClick={() => {
                switchToPage(core, 'editor')
              }}
              className="px-2 py-0.5 bg-blue-300 hover:bg-blue-400 rounded"
            >
              <FaIcon icon={faPenToSquare} className="mr-1" />
              Aufgaben-Editor
            </button>
          </div>
          {core.ws.page == 'analyze' && (
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
          <div className="w-[1240px] h-[2600px] mx-auto relative">
            {questList.map(renderQuest)}
          </div>
          <div className="flex-auto"></div>
          {core.ws.page != 'analyze' && (
            <div className="text-sm text-right mr-4 mt-36 mb-4">
              <label>
                <input
                  type="checkbox"
                  checked={isPersisted()}
                  onChange={(e) => {
                    setPersist(core, e.target.checked)
                    hideSaveHint(core)
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
                    resetStorage()
                    forceRerender(core)
                  }
                }}
              >
                zurücksetzen
              </button>
            </div>
          )}

          {core.ws.page == 'analyze' && (
            <div className="bg-white p-4">
              {questList.map((id) =>
                core.ws.analyze.solutions[id] ? (
                  <div key={id}>
                    <p className="my-4 ml-6 font-bold">{questData[id].title}</p>
                    <div className="flex flex-wrap items-start">
                      {core.ws.analyze.solutions[id].map((entry, i) => (
                        <div
                          key={i}
                          className="m-3 border rounded p-2 min-w-[200px]"
                        >
                          <p className="text-right text-sm text-gray-600 mb-2">
                            {entry.isCode && <span className="mr-2">CODE</span>}
                            {entry.count}x
                          </p>
                          <pre>{entry.solution}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          <div className="text-center mb-12">
            Version: Mai 2023 |{' '}
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
                showModal(core, 'impressum')
              }}
            >
              Impressum
            </button>{' '}
            |{' '}
            <button
              className="hover:underline"
              onClick={() => {
                showModal(core, 'privacy')
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
          {!isPersisted() &&
            isQuestDone(1) &&
            core.ws.overview.showSaveHint &&
            core.ws.page != 'analyze' && (
              <div className="fixed left-0 right-0 bottom-0 h-10 bg-yellow-100 text-center pt-1.5 z-20">
                Fortschritt auf diesem Gerät speichern?{' '}
                <button
                  className="px-2 py-0.5 bg-yellow-300 hover:bg-yellow-400 ml-6 rounded"
                  onClick={() => {
                    setPersist(core, true)
                    hideSaveHint(core)
                    forceRerender(core)
                  }}
                >
                  Speichern
                </button>{' '}
                <button
                  className="text-gray-500 underline ml-6"
                  onClick={() => {
                    hideSaveHint(core)
                  }}
                >
                  später
                </button>
              </div>
            )}
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
      {(core.ws.page == 'overview' || core.ws.page == 'demo') && (
        <HFullStyles />
      )}
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
    const position = questList.indexOf(id)

    return (
      core.ws.page == 'demo' ||
      core.ws.page == 'analyze' ||
      position == 0 ||
      isQuestDone(id) ||
      questDeps[id]?.some(isQuestDone)
    )
  }

  function renderQuest(index: number, i: number) {
    const row = Math.floor(i / 4) // zig zag
    const col = (i % 4) + [0.5, 0, 0.5, 1][row % 4]
    const top = `${row * 210 + (row + 1) * 50}px`
    const left = `${(col + 1) * 35 + col * 200}px`

    if (!isQuestVisible(index)) {
      if (questDeps[index].some(isQuestVisible)) {
        return (
          <div
            key={index}
            className="absolute w-[200px] h-[210px] border-2 rounded-md border-dashed"
            style={{ top, left }}
          ></div>
        )
      } else {
        return null
      }
    }

    const data = questData[index]

    const questDone = core.ws.page == 'analyze' ? false : isQuestDone(index)

    //const reachableCount = core.ws.analyze.reachable[index]

    const task = questData[index].tasks[0]

    //const times = quartiles(core.ws.analyze.questTimes[index] ?? [0])

    return (
      <Fragment key={index}>
        <div className="absolute" style={{ top, left }}>
          <div
            className={clsx(
              'p-3 bg-white rounded-md relative z-10',
              'w-[200px] h-[210px] cursor-pointer',
              !questDone && 'rainbow'
            )}
            tabIndex={0}
            onClick={() => {
              setOverviewScroll(
                core,
                document.getElementById('scroll-container')?.scrollTop ?? -1
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
                  {core.ws.page == 'analyze' && <small>&nbsp;({index})</small>}
                </span>
              </div>
            </div>
            <div className="">
              {!questDone && (
                <div className="absolute right-3 top-3">
                  {isQuestStarted(index) && (
                    <span className="text-yellow-600">
                      <FaIcon icon={faPencil} />
                    </span>
                  )}
                </div>
              )}
              {core.ws.page == 'analyze' &&
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
                })()}
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
                />{' '}
                {questDone && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <FaIcon
                      icon={faCheckCircle}
                      className="text-green-300/40 text-[72px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
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
            animation: glowing 60s linear infinite;
            opacity: 0;
            transition: opacity 0.1s ease-in-out;
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
              background-position: 2400% 0;
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
