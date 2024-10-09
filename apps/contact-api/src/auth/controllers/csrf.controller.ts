import { Controller, Res, Logger, HttpStatus, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Csrf } from '../dto/csrf.dto';
@Controller('csrf-check')
export class CsrfController {
  private readonly logger = new Logger();
  private authService: AuthService;
  constructor(_authCsrf: AuthService) {
    this.authService = _authCsrf;
  }
  @Get()
  @ApiTags('csrf-check')
  @ApiBearerAuth('authorization')
  @ApiOkResponse({
    description: 'Generador Aleatorio de Token CSRF.',
    type: Csrf
  })
  @ApiOperation({ summary: 'Generate Token CSRF', description: 'Generar Token aleatorio CSRF', operationId: 'csrfToken' })
  async csrfToken(@Res() res: any): Promise<any> {
    this.logger.log(`[controller - csrfToken ] Ok`);
    try {
      const token = await this.authService.saveTokenCsrf();
      return res
        .status(HttpStatus.OK)
        .send({ code: HttpStatus.OK, payload: token });
    } catch (error) {
      this.logger.error(
        `[controller - csrToken ] Error ${JSON.stringify(error)}`
      );
      return res.status(400).send({
        time: new Date().toISOString(),
        error: {
          code: 400,
          message: error.message
        }
      });
    }
  }
}
