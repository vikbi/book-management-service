import {
    CanActivate,
    ExecutionContext, Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import {Logger} from "winston";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('No token found in request headers');
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: jwtConstants.secret,
                }
            );

            request['user'] = payload;
        } catch (error:any) {
            this.logger.error('Token verification failed', error.stack);
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        if (type !== 'Bearer') {
            this.logger.warn('Invalid token type');
            return undefined;
        }
        return token;
    }
}
