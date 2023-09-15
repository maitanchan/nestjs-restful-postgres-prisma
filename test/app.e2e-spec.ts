import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { PrismaService } from '../src/prisma/prisma.service'
import * as pactum from 'pactum'
import { RegisterDto } from '../src/auth/dto/register.dto'
import { LoginDto } from '../src/auth/dto/login.dto'
import { UpdateUserDto } from 'src/users/dto/update-user.dto'
import { CreateBookmarkDto } from '../src/bookmarks/dto/create-bookmark.dto'
import { UpdateBookmarkDto } from '../src/bookmarks/dto/update-bookmark.dto'

describe('App e2e ', () => {

  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({

      imports: [AppModule]

    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

    await app.init()

    await app.listen(3333)

    prisma = app.get(PrismaService)

    await prisma.cleanDb()

    pactum.request.setBaseUrl('http://localhost:3333')

  })

  afterAll(() => {

    app.close()

  })

  it.todo('Should pass')

  describe('Auth', () => {

    const registerDto: RegisterDto = {
      email: 'test@gmail.com',
      hash: '12345678',
      firstName: 'test',
      lastName: 'e2e'
    }

    const loginDto: LoginDto = {
      email: 'test@gmail.com',
      hash: '12345678',
    }

    describe('Register', () => {

      it('Should throw if email empty', () => {

        return pactum.spec().post('/auth/register').withBody({ hash: registerDto.hash }).expectStatus(400).inspect()

      })

      it('Should throw if hash empty', () => {

        return pactum.spec().post('/auth/register').withBody({ email: registerDto.email }).expectStatus(400).inspect()

      })

      it('Should throw if no body provided', () => {

        return pactum.spec().post('/auth/register').expectStatus(400).inspect()

      })

      it('Should register', () => {

        return pactum.spec().post('/auth/register').withBody(registerDto).expectStatus(200).inspect()

      })

    })

    describe('Login', () => {

      it('Should throw if email empty', () => {

        return pactum.spec().post('/auth/login').withBody({ hash: loginDto.hash }).expectStatus(400).inspect()

      })

      it('Should throw if hash empty', () => {

        return pactum.spec().post('/auth/login').withBody({ email: loginDto.email }).expectStatus(400).inspect()

      })

      it('Should throw if no body provided', () => {

        return pactum.spec().post('/auth/login').expectStatus(400).inspect()

      })

      it('Should login', () => {

        return pactum.spec().post('/auth/login').withBody(loginDto).expectStatus(201).stores('userAt', 'access_token')
      })

    })


  })

  describe('User', () => {

    const updateUserDto: UpdateUserDto = {
      email: 'test@gmail.com',
      hash: '12345678',
      firstName: 'test',
      lastName: 'e2e'
    }

    describe('Get all users', () => {

      it('Should get all users', () => {

        return pactum.spec().get('/users').withHeaders({ Authorization: 'Bearer $S{userAt}' }).expectStatus(200).inspect()

      })

    })

    describe('Update User', () => {

      it('Should update user', () => {

        return pactum.spec().patch('/users/:id').withHeaders({ Authorization: 'Bearer $S{userAt}' }).withBody(updateUserDto).expectStatus(200).inspect()

      })

    })

  })

  describe('Bookmarks', () => {

    const createBookmarkDto: CreateBookmarkDto = {
      "title": "Tên bookmark 1",
      "description": "Mô tả 1",
      "link": "http://example.com 1"
    }

    const updateBookmarkDto: UpdateBookmarkDto = {
      "title": "Tên bookmark 1",
      "description": "Mô tả 1",
      "link": "http://example.com 1"
    }

    describe('Get empty Bookmark', () => {

      it('Should get all bookmarks', () => {

        return pactum.spec().get('/bookmarks').withHeaders({ Authorization: 'Bearer $S{userAt}' }).expectStatus(200).inspect()

      })

    })

    describe('Create bookmark', () => {

      it("Should create bookmark", () => {

        return pactum.spec().post('/bookmarks').withHeaders({ Authorization: 'Bearer $S{userAt}' }).withBody(createBookmarkDto)

      })

    })

    describe('Get Bookmark By Id', () => {

      it('Should get bookmark By Id', () => {

        return pactum.spec().get('/bookmarks/:id').withPathParams('id', '$S{bookmarkId}').withHeaders({ Authorization: 'Bearer $S{userAt}' }).expectStatus(400).inspect()

      })

    })

    describe('Update Bookmark By Id', () => {

      it('Should update bookmark by Id', () => {

        return pactum.spec().patch('/bookmarks/:id').withPathParams('id', '$S{bookmarkId}').withHeaders({ Authorization: 'Bearer $S{userAt}' }).withBody(updateBookmarkDto).expectStatus(400).inspect()

      })

    })

    describe('Delete Bookmark By Id', () => {

      it('Should delete bookmark by Id', () => {

        return pactum.spec().delete('/bookmarks/:id').withPathParams('id', '$S{bookmarkId}').withHeaders({ Authorization: 'Bearer $S{userAt}' }).expectStatus(400).inspect()

      })

    })

  })


})
