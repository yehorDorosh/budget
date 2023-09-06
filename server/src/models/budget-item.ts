import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { Category } from './category'
import { CategoryType } from '../types/enums'

@Entity('budget')
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number

  @Column({ type: 'date' })
  userDate: Date

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Category, (category) => category.budgetRecord, { onDelete: 'CASCADE' })
  category: Category

  @RelationId((budgetRecord: BudgetItem) => budgetRecord.category)
  categoryType: CategoryType

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
