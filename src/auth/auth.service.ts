import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

dotenv.config();

@Injectable()
export class AuthService {
  private readonly knex: Knex;

  constructor(@InjectModel() knex: Knex) {
    this.knex = knex;
  }

  getPermissionScope() {
    // Define the user's scopes
    const scopes = ['user:update', 'user:read'];

    return scopes;
  }

  async signin(email: string, password: string) {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.knex('user').where({ email }).first();
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
      //generate api access token
      const jwt = await this.getAccessToken(user.id);

      //generate server public key
      const serPubKey = await this.getServerPublicKey();

      // Construct the response
      const response = {
        serPubKey: serPubKey, // the server's public key. remove later for security reason
        token: jwt // the JWT
      };

      // return the response
      return response;
    } catch (error) {
      // Handle the error
      throw new Error('Error signing in');
    }
  }

  async setRequestPublicKey(id: number, publicKey: string) {
    if (!id || _.isEmpty(publicKey)) {
      throw new Error('Invalid request');
    }

    try {
      const response = await this.knex('user').where({ id }).update({ public_key: publicKey });
      return response;
    } catch (err) {
      // Handle the error
      throw new Error('Error setting public key');
    }
  }

  async getServerPublicKey(): Promise<string> {
    const privateKeyData = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

    const privateKey = crypto.createPrivateKey({
      key: privateKeyData,
      format: 'pem',
      type: 'pkcs1',
    });

    const publicKey = crypto.createPublicKey(privateKey);
    return publicKey.export({ type: 'spki', format: 'pem' }).toString();
  }

  async getAccessToken(id: number) {
    // Define the expiration time for the token
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 300);
    const scopes = this.getPermissionScope();
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

    // Define the payload
    const payload = {
      id: id,
      scopes: scopes,
      iat: new Date().getTime(),
      exp: expiration.getTime()
    };

    // Generate the JWT
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    return token;
  }
}
