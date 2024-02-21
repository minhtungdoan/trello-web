import { Box } from '@mui/material'
import ModeSelect from '../ModeSelect'

function AppBar() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'primary.light',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight
    }}>
      <ModeSelect />
    </Box>
  )
}

export default AppBar
