import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { BankModule } from './bank/bank.module'
import { User } from './users/entities/user.entity'
import { Bank } from './bank/entities/bank.entity'
import { MailerModule } from './mailer/mailer.module'
import { Card } from './bank/entities/card.entity'
import { Transaction } from './bank/entities/transaction.entity'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME1'),
                entities: [Bank, Card, Transaction],
                synchronize: true,
            }),
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            name: 'connection2',
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME2'),
                entities: [User],
                // synchronize: true,
            }),

        }),
        BankModule,
        UsersModule,
        MailerModule,
    ],
})
export class AppModule { }
