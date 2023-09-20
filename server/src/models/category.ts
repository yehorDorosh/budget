import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { BudgetItem } from './budget-item'
import { CategoryType } from '../types/enums'
import { BudgetDataSource } from '../db/data-source'
import { ModelCRUD } from '../db/model-crud'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @Column({ type: 'enum', enum: CategoryType, name: 'category_type' })
  categoryType: CategoryType

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.category)
  budgetItem: BudgetItem[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export const categoryCRUD = new ModelCRUD(Category, BudgetDataSource)
