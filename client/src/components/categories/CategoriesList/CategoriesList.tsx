import { FC } from 'react'
import { useAppSelector } from '../../../hooks/useReduxTS'
import CategoryItem from './CategoryItem'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const categories = useAppSelector((state) => state.categories.categories)

  return (
    <table>
      <tbody>
        {categories.map((item) => {
          return <CategoryItem key={item.id} id={item.id} value={item.name} />
        })}
      </tbody>
    </table>
  )
}

export default CategoriesList
