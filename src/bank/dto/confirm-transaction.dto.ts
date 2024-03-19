import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ConfirmTransactionDto {
    @ApiProperty({
        type: Number,
        description: 'The transaction id',
        required: true,
        example: 1
    })
    @IsNotEmpty()
    card_password: number
}