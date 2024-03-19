import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'user', database: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    id: number

    @Column({ length: 9, unique: true, name: 'passport_number' })
    passport_number: string

    // @Column({ unique: true, name: 'pnfl' })
    // pnfl: number

    @Column({ length: 50, name: 'first_name' })
    first_name: string

    @Column({ length: 50, name: 'last_name' })
    last_name: string

    @Column({ type: 'date', name: 'date_of_birth' })
    date_of_birth: Date

    @Column({ length: 50, name: 'email' })
    email: string

    @Column({ length: 50, name: 'phone_number', nullable: true })
    phone_number: string
}
