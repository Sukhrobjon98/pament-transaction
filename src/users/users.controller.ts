import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger'

// add swagger

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @ApiBody({ type: CreateUserDto })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto)
    }


    @Post('update/:id')
    //add default id
    @ApiParam({ name: 'id', required: true, type: 'number' })
    update(@Body() updateUserDto: CreateUserDto, @Param('id') id: number) {
        return this.usersService.update(id, updateUserDto)
    }

    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Delete('delete/:id')
    @ApiParam({ name: 'id', required: true, type: 'number' })
    remove(@Param('id') id: number) {
        return this.usersService.remove(id)
    }
}
