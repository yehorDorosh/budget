import { FC } from 'react'
import { useAppSelector } from '../../../hooks/useReduxTS'
import CategoryItem from './CategoryItem'
import BaseCard from '../../ui/BaseCard/BaseCard'

type Props = {
  token: string
}

const CategoriesList: FC<Props> = ({ token }) => {
  const categories = useAppSelector((state) => state.categories.categories)

  return (
    <BaseCard>
      <table>
        <tbody>
          {categories.map((item) => {
            return <CategoryItem key={item.id} id={item.id} value={item.name} categoryType={item.categoryType} token={token} />
          })}
        </tbody>
      </table>
    </BaseCard>
  )
}

export default CategoriesList
