import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.authService.findUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const user = await this.authService.register(createUserDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @Post('logout')
  logout(@Request() req) {
    req.session.destroy((err) => {
      if (err) {
        throw new HttpException(
          'Could not log out',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
    return { message: 'Logout successful' };
  }
}
