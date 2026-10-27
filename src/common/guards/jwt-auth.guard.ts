import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Authentication guard skeleton designed to remain agnostic to the chosen auth strategy.
 * Supports @Public() route exemption and provides a clean extension point for:
 * - JWT (@nestjs/jwt or Passport)
 * - Better Auth (auth.api.getSession)
 * - OAuth2 / OIDC token introspection
 * - API Gateway header forwarding
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    // -------------------------------------------------------------------------
    // EXTENSION POINT: Plug in your authentication verification logic here.
    // Example with @nestjs/jwt:
    //   const payload = await this.jwtService.verifyAsync(token);
    //   request['user'] = payload;
    //
    // Example with Better Auth:
    //   const session = await auth.api.getSession({ headers: request.headers });
    //   if (!session) throw new UnauthorizedException();
    //   request['user'] = session.user;
    // -------------------------------------------------------------------------

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

