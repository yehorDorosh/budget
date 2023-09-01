import React, { FC } from 'react'
import ListItem from './ListItem'
import { ListItemField, OnEdit } from './ListItem'

export interface Item {
  id: number
  fields: ListItemField[]
}

interface Props {
  items: Item[]
  onEdit: OnEdit
  formMarkup: JSX.Element
  onSend: boolean
}

const EditableList: FC<Props> = ({ items, onEdit, formMarkup, onSend }) => {
  return (
    <table>
      <tbody>
        {items.map((item) => {
          return <ListItem key={item.id} itemId={item.id} fields={item.fields} onEdit={onEdit} formMarkup={formMarkup} onSend={onSend} />
        })}
      </tbody>
    </table>
  )
}

export default EditableList
