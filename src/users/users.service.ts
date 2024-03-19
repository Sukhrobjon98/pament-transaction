import { HttpException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User, 'connection2')
        private userRepository: Repository<User>,
    ) { }


    async findOne(id: number) {
        let user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new HttpException('User not found', 404)
        }
        return user
    }

    async create(createUserDto: CreateUserDto) {
        let user = await this.findOneByPassport(createUserDto.passport_number)
        if (user) {
            throw new HttpException('User already exists', 404)
        }

        return this.userRepository.save(createUserDto)
    }


    async findOneByPassport(passport_number: string) {
        let user = await this.userRepository.findOne({
            where: { passport_number: passport_number },
        })
        return user
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        let user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new HttpException('User not found', 404)
        }
        return this.userRepository.update(id, updateUserDto)

    }


    async findAll() {
        return await this.userRepository.find()
    }


    async remove(id: number) {
        return await this.userRepository.delete(id)
    }



}
