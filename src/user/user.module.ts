import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
})
export class UserModule {}