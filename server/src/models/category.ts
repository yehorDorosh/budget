import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './user'
import { BudgetRecords } from './budget-record'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 128 })
  name: string

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user: User

  @OneToMany(() => BudgetRecords, (budgetRecord) => budgetRecord.category)
  budgetRecord: BudgetRecords[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
