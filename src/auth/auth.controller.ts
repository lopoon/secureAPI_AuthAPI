import { Controller, Get, Post, Put, Body, Req, Patch, Param, Delete, Headers,UseGuards, HttpException, HttpStatus  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { SetPublicKeyDto } from './dto/set-key.dto';
import { ApiResponse } from '../interfaces/api-response.interface';
import * as dotenv from 'dotenv';
import { JwtAuthGuard, ScopesGuard, Scopes } from '@lopoon/shared-auth-module'; // import JwtAuthGuard and ScopesGuardfor authorization

dotenv.config();

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() authLoginDto: AuthLoginDto): Promise<ApiResponse>  {
    const { email, password } = authLoginDto;
    try {
      const response = await this.authService.signin(email, password);
      return {
        status: 'success',
        data: response,
        message: 'Login successful',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }


  @UseGuards(JwtAuthGuard, ScopesGuard)
  @Scopes('user:update')
  @Put('publickey')
  async setPublicKey(@Req() request: any,  @Body() setPublicKeyDto: SetPublicKeyDto): Promise<ApiResponse>  {
    const { publicKey } = setPublicKeyDto;
    const id = request.jwtToken.id;
    try {
      const response = await this.authService.setRequestPublicKey(id, publicKey);
      return {
        status: 'success',
        message: 'Public key set successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
