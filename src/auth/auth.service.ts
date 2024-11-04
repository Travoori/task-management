import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authcredentialsDto;
    const user = this.usersRepository.create({
      username,
      password,
    });
    await this.usersRepository.save(user);
  }
  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authcredentialsDto);
  }
}
