import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      envFilePath: '.env'

    }),

    AuthModule,

    UsersModule,

    BookmarksModule,

    PrismaModule,

  ],

})
export class AppModule { }
