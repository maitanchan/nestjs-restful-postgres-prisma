import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon from 'argon2'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {

        const checkedEmailUser = await this.prisma.user.findFirst({ where: { email: registerDto.email } })

        if (checkedEmailUser) {
            throw new HttpException('Email already exist', HttpStatus.CONFLICT)
        }

        const hashedPassword = await argon.hash(registerDto.hash)

        const newUser = await this.prisma.user.create({
            data: {
                ...registerDto,
                hash: hashedPassword
            }
        })

        const { hash, ...others } = newUser

        return others

    }

    async login(loginDto: LoginDto) {

        const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } })

        if (!user) {
            throw new HttpException("Email went wrong", HttpStatus.NOT_FOUND)
        }

        const comparePassword = await argon.verify(user.hash, loginDto.hash)

        if (!comparePassword) {
            throw new HttpException('Password went wrong', HttpStatus.BAD_REQUEST)
        }

        return this.createToken(user.id, user.email)

    }

    async createToken(userId: number, email: string): Promise<{ access_token: string }> {

        const token = await this.jwtService.signAsync({ sub: userId, email })

        return { access_token: token }

    }

}
