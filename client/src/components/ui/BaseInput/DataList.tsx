import React, { FC } from 'react'

interface Props {
  id: string
  dataList: string[]
}

const DataList: FC<Props> = ({ id, dataList }) => {
  return (
    <datalist id={id} data-testid="data-list">
      {dataList.map((item) => (
        <option key={item} value={item} data-testid="data-list-option" />
      ))}
    </datalist>
  )
}

export default DataList
