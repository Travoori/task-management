import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authcredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(salt);
    console.log(hashedPassword);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  async signUp(authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.createUser(authcredentialsDto);
  }
  async signIn(authcredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authcredentialsDto;
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return 'success';
    } else {
      throw new UnauthorizedException('incorrect credentials');
    }
  }
}
