import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { BudgetItem } from './budget-item'
import { CategoryType } from '../types/enums'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @Column({ type: 'enum', enum: CategoryType })
  categoryType: CategoryType

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User

  @OneToMany(() => BudgetItem, (budgetItem) => budgetItem.category)
  budgetItem: BudgetItem[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
