import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarksService {

    constructor(private readonly prisma: PrismaService) { }

    async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {

        const bookmark = await this.prisma.bookmark.create({ data: { ...createBookmarkDto, userId } })

        return bookmark

    }

    async updateBookmark(userId: number, bookmarkId: number, updateBookmarkDto: UpdateBookmarkDto) {

        const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } })

        if (!bookmarkId || bookmark.userId !== userId) {

            throw new HttpException("Access to resource denied", HttpStatus.FORBIDDEN)

        }

        return this.prisma.bookmark.update({ where: { id: bookmarkId }, data: { ...updateBookmarkDto } })

    }


    async getAllBookmark(userId: number) {

        return this.prisma.bookmark.findMany({ where: { userId } })

    }

    async getBookmarkById(userId: number, bookmarkId: number) {

        return this.prisma.bookmark.findFirst({ where: { userId, id: bookmarkId } })

    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {

        const bookmark = await this.prisma.bookmark.findUnique({ where: { id: bookmarkId } })

        if (!bookmarkId || bookmark.userId !== userId) {

            throw new HttpException("Access to resource denied", HttpStatus.FORBIDDEN)

        }

        await this.prisma.bookmark.delete({ where: { id: bookmarkId } })

        return 'Bookmark has been deteted'

    }

}
