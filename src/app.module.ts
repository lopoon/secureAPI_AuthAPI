import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  AuthModule  from './auth/auth.module';
import { SharedAppModule }  from '@lopoon/shared-auth-module';

@Module({
  imports: [AuthModule, SharedAppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
