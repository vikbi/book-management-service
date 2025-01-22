import { Controller, Post, Body, Get, Param, NotFoundException, UseGuards, ParseIntPipe, Put, HttpStatus, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUsersDTO } from './dto/create-user.dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsersDTO } from './dto/users.dto';
import { UpdateUsersDTO } from './dto/update-user.dto';
import {AuthGuard} from "../auth/auth.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: [UsersDTO] })
  @UseGuards(AuthGuard)
  @Get()
  async showAllUsers(): Promise<UsersDTO[]> {
    return this.userService.showAll();
  }

  @ApiCreatedResponse({ type: UsersDTO })
  @ApiBadRequestResponse()
  @Post('register')
  async createUser(@Body() data: CreateUsersDTO): Promise<UsersDTO> {
    
    return this.userService.register(data);
  }


  @ApiOkResponse({ type: UsersDTO })
  @ApiNotFoundResponse()
  @Get(':id')
  async readUser(@Param('id', ParseIntPipe) id: number): Promise<UsersDTO> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ApiOkResponse({ type: UsersDTO })
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() data: UpdateUsersDTO,
  ): Promise<UsersDTO> {
    return await this.userService.update(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<unknown> {
    await this.userService.destroy(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }
}
