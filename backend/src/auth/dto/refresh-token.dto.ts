import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: '로그인 시 발급받은 Refresh Token 문자열',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Refresh Token은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: 'Refresh Token을 입력해주세요.' })
  refreshToken: string;
}
