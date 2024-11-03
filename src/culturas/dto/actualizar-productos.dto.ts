import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@InputType()
export class ActualizarProductosDto {

    @Field(() => [String])
    @IsArray()
    @IsUUID('all', { each: true }) 
    productosIds: string[];
}