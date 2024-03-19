import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseInterceptors,
    Query
} from '@nestjs/common'
import { BankService } from './bank.service'
import { CreateBankDto } from './dto/create-bank.dto'
import { CreateCardDto } from './dto/create-card.dto'
import { AddPasswordDto } from './dto/add-password.dto'
import { TransactionDto } from './dto/transaction.dto'
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto'
import { ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateCardResponse } from './interface/create-card.response'
import { CreateBankResponse } from './interface/create-bank.response'
import { TrasactionHistoryDto } from './dto/transaction-history.dto'


@ApiTags('Bank')
@Controller('bank')
export class BankController {
    constructor(private readonly bankService: BankService) { }


    @ApiOperation({ summary: 'Bank kartasini yaratish' })
    @ApiResponse({ status: 200, type: CreateCardResponse })
    @Post('create-bank-card')
    createBankCard(@Body() createBankCardDto: CreateCardDto) {
        return this.bankService.createBankCard(createBankCardDto)
    }


    @ApiOperation({ summary: 'Bank yaratish' })
    @ApiResponse({ status: 200, type: CreateBankResponse })
    @Post('create-bank')
    createBank(@Body() createBankDto: CreateBankDto) {
        return this.bankService.createBank(createBankDto)
    }


    @Post('confirm-transaction/:uuid')
    confirmTransaction(@Param('uuid') uuid: number, @Body() confirmTransactionDto: ConfirmTransactionDto) {
        return this.bankService.confirmTransaction(uuid, confirmTransactionDto.card_password)
    }

    @ApiOperation({ summary: 'Bank kartasiga parol qo`shish' })
    @ApiResponse({ status: 200, type: CreateCardResponse })
    @Post('add-password/:card_id')
    addPassword(@Param('card_id') card_id: number, @Body() addPasswordDto: AddPasswordDto) {
        return this.bankService.addPassword({ ...addPasswordDto, card_id })
    }

    // Banklarni ko'rish
    @Get()
    findAll() {
        return this.bankService.findAll()
    }


    @ApiParam({ name: 'id', description: 'The bank id', example: 1 })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bankService.deleteBank(+id)
    }

    @ApiOperation({ summary: 'Bank kartasidan bank kartasiga pul o`tish' })
    @Post('transaction')
    transaction(@Body() transactionDto: TransactionDto) {
        return this.bankService.transaction(transactionDto)
    }


    @ApiOperation({ summary: 'Bank umumiy balansi' })
    @ApiResponse({ status: 200 })
    @ApiParam({ name: 'id', description: 'The bank id', example: 1 })
    @Get('bank-users-card-balace/:id')
    getBankUsers(@Param('id') id: string) {
        return this.bankService.getBankUserCards(+id)
    }


    @ApiOperation({ summary: 'Mening balansim' })
    @ApiParam({ name: 'id', description: 'The user id', example: 37 })
    @Get('my-balance/:id')
    myBalance(@Param('id') id: string) {
        return this.bankService.getMyBalance(+id)
    }




    @ApiOperation({ summary: 'Bank kartasidan pul o`tish tarixi' })
    @Get('transaction-history/:card_id')
    transactionHistory(@Query() query: TrasactionHistoryDto, @Param('card_id') card_id: number) {
        let { startDate, endDate } = query
        return this.bankService.getTransactionHistory(card_id, startDate, endDate)
    }



    @ApiOperation({ summary: 'Asosiy bank balansi' })
    @Get('main-bank-balances')
    getMainBankBalances() {
        return this.bankService.getMainBankBalance()
    }



    @ApiOperation({ summary: 'Bankdagi transaction tarixi' })
    @Get('bank-transaction-history/:bank_id')
    bankTransactionHistory(@Param('bank_id') bank_id: number, @Query() query: TrasactionHistoryDto) {
        return this.bankService.getBankTransactionHistory(bank_id, query.startDate, query.endDate)
    }


}



