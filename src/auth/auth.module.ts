import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KnexModule } from 'nest-knexjs';
import dbConfig from './database/db.config';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY_PATH,
      publicKey: readFileSync(process.env.PUBLIC_KEY_PATH),
      privateKey: readFileSync(process.env.PRIVATE_KEY_PATH),
      signOptions: { algorithm: 'RS256', expiresIn: '60s' },
    }),
    KnexModule.forRoot({
      config: dbConfig,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export default class AuthModule {}
