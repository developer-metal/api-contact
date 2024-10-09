import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { tokensProviders } from '../model/token.providers';
import { Model } from 'mongoose';
import { TokenList } from '../dto/tokenList.dto';
import Tokens from 'csrf';
import { throwError } from 'rxjs';
import { throws } from 'assert';
@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  private readonly tokenInst = new Tokens();
  private jwtService: JwtService;
  private tokenmodel: Model<TokenList>;
  constructor(@InjectModel(tokensProviders.name) tokenmodel: Model<TokenList>, jwtService: JwtService) {
    this.jwtService = jwtService;
    this.tokenmodel = tokenmodel;
  }
  async validJwt(headers): Promise<boolean> {
    const token = this.extractTokenFromHeader(headers);
    try {
      if (!token) {
        this.logger.log(`[service - extractTokenFromHeader -  Error]`);
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Unauthorized'
          },
          HttpStatus.UNAUTHORIZED
        );
      }
      await this.jwtService.verifyAsync(token);
    } catch (error) {
      this.logger.log(`[service - validJwt -  Error]  ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized'
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    return true;
  }

  private extractTokenFromHeader(headers: any): string {
    try {
      const { authorization } = headers;
      const [type, token] = String(authorization).split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      this.logger.log(`[service - extractTokenFromHeader -  Error]  ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Unauthorized'
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
  async validCSRF(req): Promise<void> {
    try {
      if (Object(req.headers).hasOwnProperty('csrf-token') === false)  {
        throw new Error('Error token header');
      }
      if (Object(req.headers).hasOwnProperty('csrf-token') === true) {
        const checkToken: any = await this.tokenmodel.findOne({ token: req.headers['csrf-token'] });
        if (!checkToken) {
          this.logger.log(`[Middleware - validCSRF -  Error]`);
          throw new Error('Error al validar el token.');
        }
        if (checkToken) {
          if (!this.tokenInst.verify(checkToken.secret, req.headers['csrf-token'])) {
            throw new Error('Error validation Token CSRF');
          }
            await this.tokenmodel.deleteMany({ token: req.headers['csrf-token'] });
            this.logger.log(`[Middleware - validCSRF -  Ok]`);
        }
      }
    } catch (error) {
      this.logger.log(`[Middleware - validCSRF -  Error]  ${error}`);
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Error al validar el token CSRF.'
        },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
  async saveTokenCsrf(): Promise<any> {
    const secret = this.tokenInst.secretSync();
    const tokenGenerate = this.tokenInst.create(secret);
    this.logger.log(`[service - tokenGenerate -  Ok`);
    const requestForm = { token: tokenGenerate, secret };
    const tokenWhite = new this.tokenmodel(requestForm);
    const {token} = await tokenWhite.save();
    if (!token) {
      this.logger.log(`[AuthService - saveTokenCsrf - Error ${JSON.stringify(token)}`);
      throw new Error('Error al Generar el token.');
    }
    return token;
  }
}