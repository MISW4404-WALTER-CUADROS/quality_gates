import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@InputType()
export class AgregarPaisesDto {

    @Field(() => [String])
    @IsArray()
    @IsUUID('all', { each: true }) 
    paisIds: string[];
}