import { mockData } from '@/components/ShoppingPanel/mockData'
import { courseCartStore } from '@/store/shoppingCart'
import { Box, Button } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { CR11 } from '@/components/CR11'

const Home = observer(() => {
  const shoppingCart = courseCartStore

  useEffect(() => {
    // get mock data
    const getMockCourse = (i: number) => {
      return mockData[i]
    }
    for (let i = 0; i < 4; i++) {
      const mockCourse = getMockCourse(i)
      shoppingCart.addItem(mockCourse, mockCourse.sections[0].sectionNo)
    }
  }, [shoppingCart])

  return (
    <>
      {/* <Box display="flex" flexDirection="column">
        {shoppingCart.courses.map(({ courseNo, abbrName }, index) => (
          <Box mt={1} key={index}>
            <Button
              style={{ background: shoppingCart.item(courseNo)?.isSelected ? 'red' : 'transparent' }}
            >{`course: ${courseNo} ${abbrName}`}</Button>
          </Box>
        ))}
      </Box> */}
      <CR11 courses={shoppingCart.courses} />
      <br />
    </>
  )
})

export default Home
