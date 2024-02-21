import { Box } from '@mui/material'

function BoardBar() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight
    }}>
      Board Content
    </Box>
  )
}

export default BoardBar
