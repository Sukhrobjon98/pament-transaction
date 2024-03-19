import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity({
    name: 'transaction',
    database: 'bank'
})

export class Transaction {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'id'

    })
    id: number


    @Column({
        type: 'bigint',
        name: 'bank_id'

    })

    bank_id: number

    @Column({
        type: 'bigint',
        name: 'from_card_number'

    })
    from_card_id: number

    @Column({
        type: 'bigint',
        name: 'to_card_number'

    })
    to_card_id: number

    @Column({
        type: 'bigint',
        name: 'amount'

    })
    amount: number


    @Column({
        type: 'timestamp',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP'

    })
    created_at: Date
}