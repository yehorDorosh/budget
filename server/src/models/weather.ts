import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BudgetDataSource } from '../db/data-source'
import { WeatherCRUD } from '../db/weather-crud'

@Entity('weather')
export class Weather {
  @PrimaryGeneratedColumn({ name: 'db_id' })
  dbId: number

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date

  @Column({ type: 'varchar', length: 32 })
  id: string

  @Column({ type: 'numeric', precision: 4, scale: 1 })
  t: number

  @Column({ type: 'int' })
  p: number

  @Column({ type: 'numeric', precision: 4, scale: 2, nullable: true })
  v: number | null
}

export const weatherCRUD = new WeatherCRUD(Weather, BudgetDataSource)
