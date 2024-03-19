import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"



export class TransactionDto {

    @ApiProperty({
        type: Number,
        description: 'The card number from which the money is transferred',
        required: true,
        example: 1234567890123456
    })
    @IsNotEmpty()
    from_card_number: number

    @ApiProperty({
        type: Number,
        description: 'The card number to which the money is transferred',
        required: true,
        example: 1234567890123456
    })
    @IsNotEmpty()
    to_card_number: number


    @ApiProperty({
        type: Number,
        description: 'The amount of money transferred',
        required: true,
        example: 1000
    })
    @IsNotEmpty()
    amount: number

}




