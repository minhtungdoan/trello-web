import { Container } from '@mui/material'
import AppBar from '../../AppBar'
import BoardBar from './BoardBar'
import BoardContent from './BoardContent'


function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main' }}>
      <AppBar></AppBar>
      <BoardBar></BoardBar>
      <BoardContent></BoardContent>
    </Container>
  )
}

export default Board