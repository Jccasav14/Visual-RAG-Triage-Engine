import { IsString, IsNotEmpty } from 'class-validator';

export class RagRequestDto {
  @IsString()
  @IsNotEmpty()
  ticketId!: string;

  @IsString()
  @IsNotEmpty()
  promptContext!: string;
}
