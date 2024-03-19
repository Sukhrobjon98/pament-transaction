import { Module } from '@nestjs/common'
import { BankService } from './bank.service'
import { BankController } from './bank.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bank } from './entities/bank.entity'
import { Card } from './entities/card.entity'
import { UsersModule } from 'src/users/users.module'
import { MailerModule } from 'src/mailer/mailer.module'
import { Transaction } from './entities/transaction.entity'

@Module({
    controllers: [BankController],
    providers: [BankService,],
    imports: [TypeOrmModule.forFeature([Bank, Card,Transaction]), UsersModule, MailerModule],
})
export class BankModule { }
