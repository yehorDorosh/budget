import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { Category } from './category'

export enum LogType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('budget-records')
export class BudgetRecords {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number

  @Column({ type: 'date' })
  userDate: Date

  @Column({ type: 'enum', enum: LogType })
  LogType: LogType

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Category, (category) => category.budgetRecord, { onDelete: 'CASCADE' })
  category: Category

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
