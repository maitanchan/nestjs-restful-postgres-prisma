import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) { }

    async getUsers(users: User) {

        return users

    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto) {

        const updatedUser = await this.prisma.user.update({ where: { id: userId }, data: { ...updateUserDto } })

        delete updatedUser.hash

        return updatedUser

    }

}
