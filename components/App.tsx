import Head from 'next/head'
import { useEffect, useState } from 'react'

import { loadProject } from '../lib/commands/load'
import { useCore } from '../lib/state/core'
import { submit_event } from '../lib/helper/submit'
import { Quest } from './Quest'
import { Overview } from './Overview'

export function App() {
  const core = useCore()

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void loadProject(core)
    setLoaded(true)
  }, [core])

  return (
    <>
      <Head>
        <title>Robot Karol Online</title>
        <meta
          name="description"
          content="Online Version von Robot Karol, blockbasiert oder textbasiert, inklusive Tutorial und vielen Aufgaben - der zeitlose Klassiker für den spielerischen Einstieg in die Programmierung. "
        />
      </Head>
      <div className="w-full h-full min-w-[900px] relative overflow-hidden">
        {loaded && (core.ws.ui.showQuestOverview ? <Overview /> : <Quest />)}
      </div>
    </>
  )
}
