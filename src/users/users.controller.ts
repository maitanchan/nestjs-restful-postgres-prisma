import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) { }

    @Get()
    getUsers(@GetUser() users: User) {

        return this.userService.getUsers(users)

    }

    @Patch(':id')
    updateUser(@GetUser('id') userId: number, @Body() updateUserDto: UpdateUserDto) {

        return this.userService.updateUser(userId, updateUserDto)

    }

}
