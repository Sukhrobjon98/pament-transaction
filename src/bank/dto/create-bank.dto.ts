import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBankDto {
    @ApiProperty({
        type: String,
        description: 'The bank name',
        required: true,
        example: 'Qishloq Qurilish Bank'

    })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({
        type: String,
        description: 'The bank short name',
        required: true,
        example: 'QQB'
    })
    @IsString()
    @IsNotEmpty()
    short_name: string

    @ApiProperty({
        type: String,
        description: 'The bank address',
        required: true,
        example: 'Tashkent, Yunusabad district, 11th block'
    })
    @IsString()
    @IsNotEmpty()
    address: string

    @ApiProperty({
        type: String,
        description: 'card begin number',
        required: true,
        example: '8600'
    })
    @IsNotEmpty()
    begin_card_number: number

    @ApiProperty({
        type: String,
        description: 'card expired time in years and months',
        required: true,
        example: '03/25'
    })
    @IsNotEmpty()
    expired_time: number

    @ApiProperty({
        type: String,
        description: 'is main bank or not',
        required: true,
        example: 'true or false'
    })
    @IsOptional()
    is_main?: boolean

    @ApiProperty({
        type: String,
        description: 'bank unique code',
        required: true,
        example: '546232'
    })
    @IsNotEmpty()
    bank_account_number: number


}










