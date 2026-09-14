import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  externalId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @IsPositive()
  sourceId: number;
}
