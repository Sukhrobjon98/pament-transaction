import { IsNotEmpty, IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
    name: 'bank',
    database: 'bank',
})
export class Bank {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', })
    id: number

    @Column({ length: 50, name: 'name', })
    name: string


    @Column({ type: "bigint", name: 'bank_account_number', })
    bank_account_number: number

    @Column({ length: 50, name: 'short_name', })
    short_name: string

    @Column({ length: 50, name: 'address' })
    address: string

    @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date

    @Column({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deleted_at: Date

    @Column({ type: 'bigint', name: 'begin_card_number' })
    begin_card_number: number

    @Column({ type: 'int', name: 'expired_time' })
    expired_time: number

    @Column({ type: 'boolean', name: 'is_main', default: false })
    is_main: boolean


}

// let use=
// {
//     name:'National Bank of Uzbeksitan',
//     short_name:'NBU',
//     address:'Tashkent, Uzbekistan',
//     begin_card_number: 4455,
//     expired_time: 4,
//     is_main: true
// }
