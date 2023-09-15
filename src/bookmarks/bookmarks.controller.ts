import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarksController {

    constructor(private readonly bookmarkService: BookmarksService) { }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() createBookmarkDto: CreateBookmarkDto) {

        return this.bookmarkService.createBookmark(userId, createBookmarkDto)

    }

    @Patch(':id')
    updateBookmark(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() updateBookmarkDto: UpdateBookmarkDto) {

        return this.bookmarkService.updateBookmark(userId, bookmarkId, updateBookmarkDto)

    }

    @Get()
    getAllBookmarks(@GetUser('id') userId: number) {

        return this.bookmarkService.getAllBookmark(userId)

    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        console.log(userId)
        return this.bookmarkService.getBookmarkById(userId, bookmarkId)

    }

    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {

        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)

    }

}
