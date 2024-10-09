import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse
} from '@nestjs/swagger';
import { Auth } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger();
  @Get()
  @ApiBearerAuth('authorization')
  @ApiOkResponse({
    description: 'Log de chequeo status API.',
    type: Auth
  })
  @ApiTags('auth')
  @ApiOperation({ summary: 'Healthcheck', description: 'Chequeo de Estado Api', operationId: 'healthcheck', tags: ['Healthcheck'] })
  async healthcheck(@Res() response: any): Promise<any[]> {
    this.logger.log(`[controller -  healthcheck ] Ok`);
    try {
      return response.status(HttpStatus.OK).send(new Auth());
    } catch (error) {
      this.logger.error(`${error.response.error}`);
      return response.status(error.response.status).send({
        time: new Date().toISOString(),
        error: {
          code: error.response.status,
          message: 'Error en la peticion.'
        }
      });
    }
  }
}
