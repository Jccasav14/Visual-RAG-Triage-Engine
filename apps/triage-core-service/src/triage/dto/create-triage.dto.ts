import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTriageDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  imageReferenceUrl!: string;

  @IsString()
  @IsNotEmpty()
  contextId!: string;

  @IsString()
  @IsOptional()
  priority?: string;
}
