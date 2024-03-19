import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Matches,
} from 'class-validator'



export class CreateUserDto {
    @ApiProperty({
        description: 'The first name of the user',
        type: String,
        required: true,
        example: 'Javohir'

    })
    @IsNotEmpty()
    @IsString()
    first_name: string


    @ApiProperty({
        description: 'The last name of the user',
        type: String,
        required: true,
        example: 'Akbarjonov'


    })
    @IsNotEmpty()
    @IsString()
    last_name: string


    @ApiProperty({
        description: 'The passport number of the user',
        type: String,
        required: true,
        example: 'AA1234567'

    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Z]{2}[0-9]{7}$/, {
        message: 'Passport number must be in the format AA1234567',
    })
    passport_number: string


    @ApiProperty({
        description: 'The date of birth of the user',
        type: Date,
        required: true,
        example: '2021-09-01'

    })
    @IsNotEmpty()
    @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
        message: 'Date of birth must be in the format YYYY-MM-DD',
    })

    date_of_birth: Date


    @ApiProperty({
        description: 'The email of the user',
        type: String,
        required: true,
        example: "Akbar4455@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        description: 'The phone number of the user',
        type: String,
        required: true,
        example: "+998991234567"

    })
    @IsOptional()
    @IsString()
    @IsPhoneNumber('UZ', {
        message: 'Phone number must be in the format +998XXYYYYYYY',
    })
    phone_number: string
}
