import React from "react"
import { Button, Box, Heading, Text } from "theme-ui"
import skeleton from "./skeleton.yaml"

export const Grid = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <>
      <Box sx={{ ...skeleton.grid.container }} {...props}>
        <Box sx={{ ...skeleton.grid.column.container }}>
          <Heading sx={{ ...skeleton.grid.column.heading }}>Lorem Ipsum</Heading>
          <Text sx={{ ...skeleton.grid.column.text }}>
            Lorem, ipsum dolor sit amet consectetur, adipisicing elit. Doloremque quidem molestias, cupiditate magni,
            nihil voluptas quas dignissimos rem sint eius itaque, asperiores sit minima tenetur tempore excepturi at
            consectetur voluptatum.
          </Text>
          <Button sx={{ ...skeleton.grid.column.button }}>A</Button>
        </Box>
        <Box sx={{ ...skeleton.grid.column.container }}>
          <Heading sx={{ ...skeleton.grid.column.heading }}>Lorem Ipsum</Heading>
          <Text sx={{ ...skeleton.grid.column.text }}>
            Lorem, ipsum dolor sit amet consectetur, adipisicing elit. Doloremque quidem molestias, cupiditate magni,
            nihil voluptas quas dignissimos rem sint eius itaque, asperiores sit minima tenetur tempore excepturi at
            consectetur voluptatum.
          </Text>
          <Button sx={{ ...skeleton.grid.column.button }}>B</Button>
        </Box>
        <Box sx={{ ...skeleton.grid.column.container }}>
          <Heading sx={{ ...skeleton.grid.column.heading }}>Lorem Ipsum</Heading>
          <Text sx={{ ...skeleton.grid.column.text }}>
            Lorem, ipsum dolor sit amet consectetur, adipisicing elit. Doloremque quidem molestias, cupiditate magni,
            nihil voluptas quas dignissimos rem sint eius itaque, asperiores sit minima tenetur tempore excepturi at
            consectetur voluptatum.
          </Text>
          <Button sx={{ ...skeleton.grid.column.button }}>C</Button>
        </Box>
      </Box>
    </>
  )
})

export default Grid
