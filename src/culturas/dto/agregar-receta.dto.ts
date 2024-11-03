import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@InputType()
export class AgregarRecetasDto {

    @Field(() => [String])
    @IsArray()
    @IsUUID('all', { each: true }) 
    recetasId: string[];
}