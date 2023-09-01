import { FC, useState } from 'react'
import { useAppSelector } from '../../../hooks/useReduxTS'
import useField from '../../../hooks/useField'
import useForm from '../../../hooks/useForm'
import EditableList, { Item } from '../../ui/EditableList/EditableList'
import { updateCategory } from '../../../store/categories/categories-actions'
import { OnEdit } from '../../ui/EditableList/ListItem'
import { notEmpty } from '../../../utils/validators'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const [onSend, setOnSend] = useState(false)
  const categories = useAppSelector((state) => state.categories.categories)
  const { fieldState: categoryState, fieldDispatch: categoryDispatch } = useField()
  const [targetId, setTargetId] = useState<number | null>(null)
  const items: Item[] = categories.map((category) => ({
    id: category.id,
    fields: [{ value: category.name, name: 'name' }]
  }))
  const { formMarkup } = useForm(
    [
      {
        name: 'name',
        type: 'text',
        label: 'Category name',
        placeholder: 'Category name',
        errMsg: 'Field is required.',
        validator: notEmpty,
        state: categoryState,
        dispatch: categoryDispatch,
        defaultValue: categories.find((category) => category.id === targetId)?.name
      }
    ],
    {
      submitBtnText: 'Edit category',
      submitAction: updateCategory,
      submitActionParams: [token, targetId, categoryState.value]
    },
    {
      onSubmit: () => setOnSend(false),
      onGetResponse: () => setOnSend(true)
    }
  )

  const onEdit: OnEdit = (id) => {
    setTargetId(id)
  }

  return <EditableList items={items} onEdit={onEdit} formMarkup={formMarkup} onSend={onSend} />
}

export default CategoriesList
