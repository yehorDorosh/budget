import React, { FC, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../hooks/useReduxTS'
import { deleteCategory, updateCategory } from '../../../store/categories/categories-actions'
import EditableList from '../../ui/EditableList/EditableList'
import { notEmpty } from '../../../utils/validators'
import { SaveEvent } from '../../ui/EditableList/ListItem'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.categories.categories)
  const [isLoading, setIsLoading] = useState(false)
  const items = categories.map((category) => {
    return {
      id: category.id,
      fields: [
        {
          value: category.name,
          name: 'name',
          type: 'text',
          validation: notEmpty
        }
      ]
    }
  })

  const onDeleteHandler = async (id: number) => {
    setIsLoading(true)
    await dispatch(deleteCategory(token, id))
    setIsLoading(false)
  }

  const onSaveHandler: SaveEvent = async (id, data) => {
    const fieldCategoryName = data.find((item) => item.name === 'name')
    if (!fieldCategoryName || !fieldCategoryName.isValid) {
      return
    }
    setIsLoading(true)
    await dispatch(updateCategory(token, id, fieldCategoryName.value))
    setIsLoading(false)
  }

  return <EditableList items={items} onDelete={onDeleteHandler} onSave={onSaveHandler} isLoading={isLoading} />
}

export default CategoriesList
