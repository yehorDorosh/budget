import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { Category } from './category'
import { BudgetDataSource } from '../db/data-source'
import { BudgetItemCRUD } from '../db/budget-item-crud'

@Entity('budget')
export class BudgetItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number

  @Column({ type: 'date', name: 'user_date' })
  userDate: Date

  @Column({ type: 'boolean', default: false })
  ignore: boolean

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Category, (category) => category.budgetItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category

  // @RelationId((budgetItem: BudgetItem) => budgetItem.category)
  // @JoinColumn({ name: 'category_id' })
  // categoryId: Category

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export const budgetItemCRUD = new BudgetItemCRUD(BudgetItem, BudgetDataSource)
