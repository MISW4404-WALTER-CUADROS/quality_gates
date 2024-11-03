import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class EliminarRecetaDto {
  @Field()
  @IsUUID()
  culturaId: string;

  @Field()
  @IsUUID()
  recetaId: string;
}