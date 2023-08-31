import React, { FC } from 'react'
import ListItem from './ListItem'
import classes from './EditableList.module.scss'
import { ListItemField, SaveEvent } from './ListItem'

interface Props {
  items: ListItemField[]
  onDelete: (id: number) => void
  onSave: SaveEvent
  isLoading: boolean
}

const EditableList: FC<Props> = ({ items, onDelete, onSave, isLoading }) => {
  return (
    <div className={classes.container}>
      <table>
        <tbody>
          {items.map((item) => {
            return <ListItem key={item.id} item={{ id: item.id, fields: item.fields }} onDelete={onDelete} onSave={onSave} />
          })}
        </tbody>
      </table>
      {isLoading && (
        <div className={classes.loaderBg}>
          <div className={classes.loader}></div>
        </div>
      )}
    </div>
  )
}

export default EditableList
