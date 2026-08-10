import { IsOptional, IsString } from 'class-validator';

export class TriageQueryDto {
  @IsOptional()
  @IsString()
  status?: string;
}
