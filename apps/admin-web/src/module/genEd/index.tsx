import { GenEdList } from './components/GenEdList'
import { GenEdTableHeader } from './components/GenEdTableHeader'
import Topbar from './components/Topbar'

export function GenEdPage() {
  return (
    <div>
      <Topbar />
      <GenEdTableHeader />
      <GenEdList />
    </div>
  )
}
