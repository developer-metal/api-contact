import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { validApikey } from '../../common/helpers/validApiKey';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger();
  private readonly authService: AuthService;
    constructor(authService: AuthService) {
      this.authService = authService;
     }
  async use(req: any, _res:any, next: any) {
        const { header } = _res;
        const { headers, originalUrl } = req;
        if (validApikey(headers, originalUrl)) {
          next();
        } else {
        await this.authService.validJwt(headers);
        next();
      }
  }
}