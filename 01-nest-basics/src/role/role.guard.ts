import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { roles } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roless = this.reflector.get(roles, context.getHandler());
    if (!roless) {
      return true;
    }

    const user = context.switchToHttp().getRequest().user;
    return roless.indexOf(user.role) !== -1;
  }
}
