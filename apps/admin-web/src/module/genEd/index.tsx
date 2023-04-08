import { useState } from 'react'

import AddGenEdDialog from './components/AddGenEdDialog'
import { GenEdList } from './components/GenEdList'
import { GenEdTableHeader } from './components/GenEdTableHeader'
import Topbar from './components/Topbar'

export function GenEdPage() {
  const [openAddGenEdDialog, setOpenAddGenEdDialog] = useState(false)

  return (
    <div>
      <Topbar setOpenAddGenEdDialog={setOpenAddGenEdDialog} />
      <GenEdTableHeader />
      {openAddGenEdDialog && <AddGenEdDialog setOpenAddGenEdDialog={setOpenAddGenEdDialog} />}
      <GenEdList />
    </div>
  )
}
