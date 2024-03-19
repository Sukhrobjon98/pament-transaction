import { ApiProperty } from '@nestjs/swagger';
import { CreateCardDto } from '../dto/create-card.dto';
import { UserRole } from '../entities/card.entity';

export class CreateCardResponse implements CreateCardDto {
    @ApiProperty({
        type: Number,
        description: 'The bank id',
        required: true,
        example: 1

    })
    bank_id: number;
    @ApiProperty({
        type: Number,
        description: 'The card number',
        required: true,
        example: 8600550055005500

    })
    card_number: number;

    @ApiProperty({
        type: String,
        description: 'The card expired time',
        required: true,
        example: '2023-12-12'

    })
    expired_time: string;

    @ApiProperty({
        type: Number,
        description: 'The card password',
        required: true,
        example: 1234

    })

    card_password: number;
    @ApiProperty({
        type: String,
        description: 'The user role  Jismoniy, Yuridik',
        required: true,
        enum: UserRole,
        example: 'Jismoniy'
    })
    user_role: UserRole;

    @ApiProperty({
        type: Number,
        description: 'The card balance',
        required: true,
        example: 1000

    })
    balance: number;

    @ApiProperty({
        type: String,
        description: 'User passport number',
        required: true,
        example: 'AA1234567'
    })
    passport_number: string;

 
    company_number: number;

    @ApiProperty({
        type: Date,
        description: 'User date of birth',
        required: true,
        example: '2023-12-12'

    })
    date_of_birth: Date;

}