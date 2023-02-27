import { Override, useGetOverridesQuery } from '@cgr/codegen'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import SingleGenEd from './singleGenEd'

export default function GenEdList() {
  const overridesQuery = useGetOverridesQuery()
  console.log(overridesQuery)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">Academic Year</TableCell>
            <TableCell align="center">Course No.</TableCell>
            <TableCell align="center">GenEd Type</TableCell>
            <TableCell align="center">Semester</TableCell>
            <TableCell align="center">Study Program</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {overridesQuery.data?.overrides?.map((data: Override) => (
            <SingleGenEd key={data.courseNo + data.studyProgram} data={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    // <section>
    //   {overridesQuery.data?.overrides?.map((data: Override) => <SingleGenEd data={data} />)}
    // </section>
  )
}