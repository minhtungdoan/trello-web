import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'

import { mapOrder } from '~/utils/sorts'

// import { mockData } from '~/apis/mock-data'
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'


function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '65ef90c6453ec3f6e89a4d78'

    fetchBoardDetailsAPI(boardId).then(board => {
      // Sap xep thu tu column truoc khi dua du lieu xuong component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns .forEach(column => {
      // Xử lý kéo thả vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards.push(generatePlaceholderCard(column))
          column.cardOrderIds.push(generatePlaceholderCard(column)._id)
        } else {
          // Sap xep thu tu card truoc khi dua du lieu xuong component con
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Xử lý kéo thả vào một column rỗng
    createdColumn.cards.push(generatePlaceholderCard(createdColumn))
    createdColumn.cardOrderIds.push(generatePlaceholderCard(createdColumn)._id)

    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Neu column rong thi xoa placeholder card di
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    // console.log("🚀 ~ createNewCard ~ columnToUpdate:", columnToUpdate)
    setBoard(newBoard)
  }

  // call API when dnd column finish
  const moveColumns = (dndOrderedCollumns) => {
    // update state board
    const dndOrderedColumnsIds = dndOrderedCollumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedCollumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })

  }

  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedCollumns) => {
    // update state board
    const dndOrderedColumnsIds = dndOrderedCollumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedCollumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // call API
    let prevCardOrderIds = dndOrderedCollumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // xu li van de khi keo card cuoi cung ra khoi column
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedCollumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Delete column
  const deleteColumnDetails = (columnId) => {
    // update state board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(columnId => columnId !== columnId)
    setBoard(newBoard)

    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar></AppBar>
      <BoardBar board={board}></BoardBar>
      <BoardContent
        board={board}

        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      ></BoardContent>
    </Container>
  )
}

export default Board