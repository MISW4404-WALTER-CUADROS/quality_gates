import { IsUUID } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoriaDto {
    @Field()
    @IsUUID()
    categoriaId: string;
}
