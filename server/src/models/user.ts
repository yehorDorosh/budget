import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Category } from './category'
import { ModelCRUD } from '../db/model-crud'
import { BudgetDataSource } from '../db/data-source'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 64, unique: true })
  email: string

  @Column('varchar', { length: 128 })
  password: string

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export const UserCRUD = new ModelCRUD(User, BudgetDataSource)
