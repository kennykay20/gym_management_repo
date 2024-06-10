import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
import { ServiceName } from 'src/utils';

export class AddOnServiceCreateDto {
  @IsString()
  @ApiProperty()
  serviceName: ServiceName;

  @IsString()
  @ApiProperty()
  membershipId: string;

  @IsInt()
  @ApiProperty()
  monthlyAmount: number;
}
