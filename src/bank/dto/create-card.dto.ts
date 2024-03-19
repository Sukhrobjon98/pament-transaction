import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, matches } from "class-validator"
import { UserRole } from "../entities/card.entity"
import { ApiProperty } from "@nestjs/swagger"




export class CreateCardDto {

    @ApiProperty({
        type: Number,
        description: 'The bank id',
        required: true,
        example: 1

    })
    @IsNotEmpty()
    bank_id: number

 
    @IsOptional()
    card_number: number


 
    @IsOptional()
    expired_time: string


   
    @IsOptional()
    card_password: number


    @ApiProperty({
        type: String,
        description: 'The user role  Jismoniy, Yuridik',
        required: true,
        enum: UserRole,
        example: 'Jismoniy'
    })
    @IsEnum(UserRole)
    user_role: UserRole

    @IsOptional()
    balance: number


    @ApiProperty({
        type: String,
        description: 'User passport number',
        required: true,
        example: 'AA1234567'
    })
    @IsString()
    @Matches(/^[A-Z]{2}[0-9]{7}$/, {
        message: 'Passport number must be in the format AA1234567',
    })
    passport_number: string



  
    @IsOptional()
    company_number: number

    @ApiProperty({
        type: String,
        description: 'User date of birth',
        required: true,
        example: '1999-12-12'
    })
    @IsString()
    @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
        message: 'Date of birth must be in the format YYYY-MM-DD',
    })

    date_of_birth: Date
}


