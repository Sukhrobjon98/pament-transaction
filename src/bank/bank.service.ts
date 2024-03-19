import { HttpException, Inject, Injectable } from '@nestjs/common'
import { CreateBankDto } from './dto/create-bank.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Bank } from './entities/bank.entity'
import { Between, Repository } from 'typeorm'
import { Card, UserRole } from './entities/card.entity'
import { UsersService } from 'src/users/users.service'
import { CreateCardDto } from './dto/create-card.dto'
import { MailerService } from 'src/mailer/mailer.service'
import { AddPasswordDto } from './dto/add-password.dto'
import { TransactionDto } from './dto/transaction.dto'
import * as Redis from 'ioredis'
import { Transaction } from './entities/transaction.entity'

@Injectable()
export class BankService {
    private redisClient: Redis.Redis
    constructor(
        @InjectRepository(Bank) private bankRepository: Repository<Bank>,
        @InjectRepository(Card) private cardRepository: Repository<Card>,
        @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,

        private userService: UsersService,
        private mailerService: MailerService,
    ) {
        this.redisClient = new Redis.Redis({
            port: 6379,
            host: 'localhost',
        })
    }

    async transaction(transactionDto: TransactionDto) {
        let fromCard = await this.cardRepository.findOne({ where: { card_number: transactionDto.from_card_number } })
        let toCard = await this.cardRepository.findOne({ where: { card_number: transactionDto.to_card_number } })
        if (!fromCard || !toCard) {
            throw new HttpException('Card not found', 404)
        }
        let user = await this.userService.findOne(fromCard.user_id)
        if (fromCard.balance < transactionDto.amount) {
            throw new HttpException('Insufficient funds', 400)
        }
        if (fromCard.user_role === UserRole.yuridik) {
            fromCard.balance -= +transactionDto.amount
            toCard.balance = +transactionDto.amount + parseInt(toCard.balance.toString())
            await this.cardRepository.save(fromCard)
            await this.cardRepository.save(toCard)
            this.mailerService.sendTransactionUrl(fromCard.card_number, user.email, toCard.card_number, transactionDto.amount)
            await this.transactionRepository.save({
                from_card_id: fromCard.id,
                to_card_id: toCard.id,
                amount: transactionDto.amount,
                bank_id: fromCard.bank_id,
            })
            throw new HttpException('Transaction successfully', 200)
        }
        if (fromCard.user_role === UserRole.jismoniy) {
            let uuid = await this.generatUuuid()
            let url = `http://localhost:3000/bank/confirm-transaction/${uuid}`
            await this.redisClient.set(uuid.toString(), JSON.stringify(transactionDto), 'EX', 60 * 5)
            this.mailerService.sendTransactionCode(user.email, url)
            throw new HttpException('Transaction code sent to your email', 200)
        }
    }

    async confirmTransaction(uuid: number, card_password: number) {
        let transaction = JSON.parse(await this.redisClient.get(uuid.toString())) as TransactionDto
        if (!transaction) {
            throw new HttpException('Transaction code is incorrect', 400)
        }

        let fromCard = await this.cardRepository.findOne({ where: { card_number: transaction.from_card_number } })
        let toCard = await this.cardRepository.findOne({ where: { card_number: transaction.to_card_number } })
        let user = await this.userService.findOne(fromCard.user_id)
        if (fromCard.balance < transaction.amount) {
            throw new HttpException('Insufficient funds', 400)
        }
        if (fromCard.card_password != card_password) {
            throw new HttpException('Card password is incorrect', 400)
        }
        fromCard.balance -= transaction.amount
        toCard.balance = +transaction.amount + parseInt(toCard.balance.toString())
        await this.cardRepository.save(fromCard)
        await this.cardRepository.save(toCard)
        await this.transactionRepository.save({
            from_card_id: fromCard.id,
            to_card_id: toCard.id,
            amount: transaction.amount,
            bank_id: fromCard.bank_id,
        })
        this.mailerService.sendTransactionUrl(fromCard.card_number, user.email, toCard.card_number, transaction.amount)
        this.redisClient.del(uuid.toString())
        throw new HttpException('Transaction successfully', 200)
    }

    async generatUuuid() {
        return Math.floor(100000000000 + Math.random() * 900000000000)
    }

    async confirmPassword(card_id: number, card_password: number) {
        let card = await this.cardRepository.findOne({ where: { id: card_id } })
        if (card.card_password !== card_password) {
            throw new HttpException('Card password is incorrect', 400)
        }
        return card
    }
    async deleteBank(id: number) {
        return this.bankRepository.delete(id)
    }

    async allBankCards(id: number) {
        return this.cardRepository.find({ where: { bank_id: id } })
    }

    async checkBalance(card_number: number, card_password: number) {
        let card = await this.cardRepository.findOne({ where: { card_number, card_password } })
        if (!card) {
            throw new HttpException('Card not found', 404)
        }
        return card.balance
    }

    async createBank(createBankDto: CreateBankDto) {
        let bank = await this.bankRepository.findOne({ where: { bank_account_number: createBankDto.bank_account_number } })
        if (bank) {
            throw new HttpException('Bank account number already exists', 400)
        }
        let newBank = this.bankRepository.create(createBankDto)

        return this.bankRepository.save(newBank)
    }

    async findAll() {
        return this.bankRepository.find()
    }

    async createBankCard(createBankCardDto: CreateCardDto): Promise<Card> {
        let isUser = await this.userService.findOneByPassport(createBankCardDto.passport_number)

        if (!isUser || isUser.date_of_birth !== createBankCardDto.date_of_birth) {
            throw new HttpException('User not found', 404)
        }

        let bank = await this.bankRepository.findOne({ where: { id: createBankCardDto.bank_id } })

        if (!bank) {
            throw new HttpException('Bank not found', 404)
        }

        let card = await this.cardRepository.findOne({ where: { user_id: isUser.id, bank_id: createBankCardDto.bank_id, user_role: createBankCardDto.user_role } })

        if (card && !(await this.isExipiredCard(card.id)) && card.user_role === createBankCardDto.user_role) {
            throw new HttpException('Card already exists', 400)
        }

        if (card && (await this.isExipiredCard(card.id))) {
            await this.cardRepository.delete({ user_id: isUser.id, bank_id: createBankCardDto.bank_id })
        }

        if (createBankCardDto.user_role === UserRole.jismoniy) {
            let cardNumber = await this.generateBankCardNumber(createBankCardDto.bank_id)
            let expiredTime = await this.giveExpireTime(createBankCardDto.bank_id)
            let newCard = this.cardRepository.create({
                user_id: isUser.id,
                card_number: cardNumber,
                expired_time: expiredTime,
                balance: card?.balance,
                bank_id: createBankCardDto.bank_id,
                user_role: createBankCardDto?.user_role,
            })
            let created_card = await this.cardRepository.save(newCard)
            this.mailerService.sendAddPassworUrl(isUser.email, `http://localhost:3000/bank/add-password/${created_card.id}`)
            return created_card
        }

        if (createBankCardDto.user_role === UserRole.yuridik) {
            let cardNumber = await this.generateCompanyBankCardNumber(createBankCardDto.bank_id)
            let expiredTime = await this.giveExpireTime(createBankCardDto.bank_id)
            let newCard = this.cardRepository.create({
                user_id: isUser.id,
                card_number: cardNumber,
                expired_time: expiredTime,
                balance: card?.balance,
                bank_id: createBankCardDto.bank_id,
                user_role: createBankCardDto?.user_role,
            })
            let created_card = await this.cardRepository.save(newCard)
            this.mailerService.sendAddPassworUrlCompany(isUser.email)
            return created_card
        }
    }

    async generateBankCardNumber(bank_id: number) {
        let bank = await this.bankRepository.findOne({ where: { id: bank_id } })

        let cardNumber = Math.floor(100000000000 + Math.random() * 900000000000) // le
        let card = await this.cardRepository.findOne({ where: { card_number: parseInt(bank.begin_card_number + '' + cardNumber) } })
        if (card) {
            return this.generateBankCardNumber(bank_id)
        }
        return parseInt(bank.begin_card_number + '' + cardNumber)
    }

    async generateCompanyBankCardNumber(bank_id: number) {
        let cardNumber = Math.floor(100000000000 + Math.random() * 900000000000)
        let card = await this.cardRepository.findOne({ where: { card_number: cardNumber } })
        if (card) {
            return this.generateCompanyBankCardNumber(bank_id)
        }
        return cardNumber
    }

    async giveExpireTime(bank_id: number) {
        // 01/23
        let bank = await this.bankRepository.findOne({ where: { id: bank_id } })
        let date = new Date()
        let month = date.getMonth() + 1
        let year = date.getFullYear() + bank.expired_time
        return month + '/' + year
    }

    async isExipiredCard(card_id: number) {
        let card = await this.cardRepository.findOne({ where: { id: card_id } })
        let date = new Date()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let expiredTime = card.expired_time.split('/')
        if (parseInt(expiredTime[1]) < year) {
            return true
        }
        if (parseInt(expiredTime[0]) < month) {
            return true
        }
        return false
    }

    async addPassword(createCardDto: AddPasswordDto) {
        let card = await this.cardRepository.findOne({ where: { id: createCardDto.card_id } })
        if (!card) {
            throw new HttpException('Card not found', 404)
        }
        if (card.card_password) {
            throw new HttpException('Card password already exists', 400)
        }
        card.card_password = createCardDto.card_password
        return this.cardRepository.save(card)
    }

    async getBankUserCards(bank_id: number) {
        let cards = await this.cardRepository.createQueryBuilder('card').where('card.bank_id = :bank_id', { bank_id }).select('SUM(card.balance)', 'sum').getRawOne()
        return cards
    }

    async getMyBalance(card_id: number) {
        let card = await this.cardRepository.findOne({ where: { id: card_id } })
        if (!card) {
            throw new HttpException('Card not found', 404)
        }
        return { balance: card.balance }
    }

    async getMainBankBalance() {
        let balances = await this.cardRepository.createQueryBuilder('card').select('SUM(card.balance)', 'sum').getRawOne()
        return balances
    }

    async getTransactionHistory(card_id: number, startDate: string, endDate: string) {
        let transaction = await this.transactionRepository.find({
            where: {
                from_card_id: card_id,
                created_at: Between(new Date(startDate), new Date(endDate)),
            },
        })

        return transaction
    }

    async getBankTransactionHistory(bank_id: number, startDate: string, endDate: string) {
        return await this.transactionRepository.find({
            where: {
                bank_id: bank_id,
                created_at: Between(new Date(startDate), new Date(endDate)),
            },
        })
    }
}
