import React, { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxTS'
import { deleteCategory } from '../../../store/categories/categories-actions'

export interface ListItemField {
  value: string
  name: string
}

export type OnEdit = (id: number) => void

interface ListItemProps {
  itemId: number
  fields: ListItemField[]
  onEdit: OnEdit
  onSend: boolean
  formMarkup: JSX.Element
}

const ListItem: FC<ListItemProps> = ({ fields, itemId, onEdit, formMarkup, onSend }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.user.token)
  const [isEditing, setIsEditing] = useState(false)

  const deleteHandler = () => {
    dispatch(deleteCategory(token, itemId))
  }

  const fieldsMarkup = fields.map((field, i) => {
    return <td key={i}>{field.value}</td>
  })

  const editBtnHandler = () => {
    setIsEditing(true)
    onEdit(itemId)
  }

  useEffect(() => {
    if (onSend) {
      setIsEditing(false)
    }
  }, [onSend])

  return (
    <tr>
      {!isEditing && fieldsMarkup}
      {isEditing && <td>{formMarkup}</td>}
      <td>
        {!isEditing && <button onClick={editBtnHandler}>Edit</button>}
        {isEditing && <button onClick={() => setIsEditing(false)}>Cancel</button>}
        <button onClick={deleteHandler}>Delete</button>
      </td>
    </tr>
  )
}

export default ListItem
