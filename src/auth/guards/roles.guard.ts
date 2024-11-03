import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../user/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true; 
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user; 

        console.log('User from request:', user); 

        if (!user?.roles) {
            throw new UnauthorizedException('Usuario o roles no definidos');
        }

        const hasRole = () => user.roles.some((role) => requiredRoles.includes(role));
        if (!hasRole()) {
            throw new UnauthorizedException('No tienes permisos suficientes para realizar esta actividad');
        }

        return true;
    }
}
