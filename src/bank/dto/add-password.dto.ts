import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber } from "class-validator"




export class AddPasswordDto {

 
    card_id: number

    @ApiProperty({
        type: Number,
        description: 'The card password',
        required: true,
        example: 1234
    })
    @IsNumber()
    @IsNotEmpty()
    card_password: number
}