import { IsEmail, IsString, Length } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @IsEmail(undefined, { message: 'Must be a valid email' })
  email: string;

  @IsString()
  @Length(3, 255, { message: 'Username must be at least 3 characters long' })
  username: string;

  @IsString()
  @Length(6, 255, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  token: string;

  constructor(
    email: string,
    username: string,
    password: string,
    token: string,
  ) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.token = token;
  }
}

export interface TokenPayload {
  userId: number;
}
