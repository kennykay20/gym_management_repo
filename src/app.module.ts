import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseSourceOptions } from './database/database.source';

@Module({
  imports: [TypeOrmModule.forRoot(databaseSourceOptions), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
