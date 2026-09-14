import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsUrl()
  @IsOptional()
  url?: string;
}
