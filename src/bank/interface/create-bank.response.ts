import { ApiProperty } from "@nestjs/swagger";
import { CreateBankDto } from "../dto/create-bank.dto";


export class CreateBankResponse implements CreateBankDto {
    @ApiProperty({
        type: Number,
        description: 'The bank id',
        required: true,
        example: 1
    })
    id: number;
    @ApiProperty({
        type: String,
        description: 'The bank name',
        required: true,
        example: 'Aloqa'
    })
    name: string;
    @ApiProperty({
        type: String,
        description: 'The bank short name',
        required: true,
        example: 'Aloqa'
    })
    short_name: string;
    @ApiProperty({
        type: String,
        description: 'The bank address',
        required: true,
        example: 'Tashkent'
    })
    address: string;
    @ApiProperty({
        type: String,
        description: 'The bank phone number',
        required: true,
        example: '+998971234567'
    })
    begin_card_number: number;
    @ApiProperty({
        type: Number,
        description: 'The bank begin card number',
        required: true,
        example: 8600550055005500
    })
    expired_time: number;
    @ApiProperty({
        type: Boolean,
        description: 'The bank is main',
        required: true,
        example: true
    })
    is_main?: boolean;
    @ApiProperty({
        type: Number,
        description: 'The bank account number',
        required: true,
        example: 1234567890
    })
    bank_account_number: number;

}
