import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],  // Import TypeOrmModule with User entity
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],  
})
export class UserModule {}
