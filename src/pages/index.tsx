import SampleComponent from '@/components/SampleComponent'
import { mockData } from '@/components/ShoppingPanel/mockData'
import { useShoppingCartContext } from '@/contexts/shoppingCart'
import { sortCourses } from '@/utils/course'
import { Box, Button } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useState } from 'react'

const Home = observer(() => {
  const shoppingCart = useShoppingCartContext()

  const [index, setIndex] = useState(0)
  const getMockCourse = () => {
    setIndex((value) => value + 1)
    return mockData[index]
  }
  const onAddItem = () => {
    if (index < 4) {
      const mockCourse = getMockCourse()
      shoppingCart.addItem(mockCourse, mockCourse.sections[0].sectionNo)
    }
  }

  const onSelectItem = (courseNo: string) => {
    shoppingCart.toggleSelectedItem(courseNo)
  }

  const onClearItems = () => {
    shoppingCart.removeItems()
  }

  return (
    <>
      <SampleComponent />
      <Box display="flex" flexDirection="column">
        {sortCourses(shoppingCart.courses, 'genEdType').map(({ courseNo, abbrName }, index) => (
          <Box mt={1} key={index}>
            <Button
              onClick={() => onSelectItem(courseNo)}
              style={{ background: shoppingCart.item(courseNo)?.isSelected ? 'red' : 'transparent' }}
            >{`course: ${courseNo} ${abbrName}`}</Button>
          </Box>
        ))}
      </Box>
      {`shopping Cart State = ${shoppingCart.state}`}
      <br />
      <Button variant="outlined" onClick={onAddItem}>
        Add Item
      </Button>
      <Button variant="outlined" onClick={onClearItems}>
        Remove Selected Item
      </Button>
    </>
  )
})

export default Home
