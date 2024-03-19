import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    jismoniy = 'jismoniy',
    yuridik = 'yuridik'
}

@Entity({
    name: 'card',
    database: 'bank'
})

export class Card {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', })
    id: number

    @Column({ type: 'bigint', name: 'bank_id' })
    bank_id: number


    @Column({ name: 'user_id', type: 'bigint' })
    user_id: number

    @Column({ type: 'bigint', name: 'card_number' })
    card_number: number

    @Column({ name: 'expired_time' }) // example: 12/22
    expired_time: string

    @Column({ type: 'bigint', name: 'card_password', nullable: true })
    card_password: number

    @Column({ type: 'enum', name: 'user_role', default: UserRole.jismoniy, enum: UserRole })
    user_role: UserRole

    @Column({ type: "int", name: 'balance', default: 0 })
    balance: number

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @Column({ type: 'boolean', name: 'state', default: true })
    state: boolean
}



