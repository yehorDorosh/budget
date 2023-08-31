import React, { FC } from 'react'

export interface ListItemField {
  id: number
  fields: {
    value: string
    name: string
    type: string
    validation?: (value: string) => boolean
  }[]
}

export type SaveEvent = (id: number, data: { name: string; value: string; isValid: boolean }[]) => void

interface ListItemProps {
  item: ListItemField
  onDelete: (id: number) => void
  onSave: SaveEvent
}

const ListItem: FC<ListItemProps> = ({ item, onDelete, onSave }) => {
  const [openForm, setOpenForm] = React.useState(false)

  const openFormHandler = () => {
    setOpenForm((prev) => !prev)
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = item.fields.map((field) => {
      const value = String(formData.get(field.name))
      const isValid = field.validation ? field.validation(value) : true
      return {
        name: field.name,
        value,
        isValid
      }
    })

    onSave(item.id, data)
    setOpenForm(false)
  }

  const formMarkup = (
    <td>
      <form onSubmit={submitHandler}>
        {item.fields.map((field) => {
          return <input key={field.name} type={field.type} name={field.name} defaultValue={field.value} />
        })}
        <button type="submit">Save</button>
      </form>
    </td>
  )

  const dataMarkup = (
    <td>
      {item.fields.map((field) => {
        return <span key={field.name}>{field.value}</span>
      })}
    </td>
  )

  return (
    <tr>
      {openForm ? formMarkup : dataMarkup}

      <td>{openForm ? <button onClick={() => setOpenForm(false)}>Cancel</button> : <button onClick={openFormHandler}>Edit</button>}</td>
      <td>
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </td>
    </tr>
  )
}

export default ListItem
