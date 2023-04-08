import { useState } from 'react'

import { Override, useGetOverridesQuery } from '@cgr/codegen'

import AddGenEdDialog from './components/AddGenEdDialog'
import { GenEdList } from './components/GenEdList'
import { GenEdTableHeader } from './components/GenEdTableHeader'
import Topbar from './components/Topbar'

export function GenEdPage() {
  const [openAddGenEdDialog, setOpenAddGenEdDialog] = useState(false)
  const { data, loading, error, refetch: refetchOverrides } = useGetOverridesQuery()
  return (
    <div>
      <Topbar setOpenAddGenEdDialog={setOpenAddGenEdDialog} refetchOverrides={refetchOverrides} />
      <GenEdTableHeader />
      {openAddGenEdDialog && <AddGenEdDialog setOpenAddGenEdDialog={setOpenAddGenEdDialog} />}
      <GenEdList data={data} loading={loading} refetchOverrides={refetchOverrides} />
    </div>
  )
}
