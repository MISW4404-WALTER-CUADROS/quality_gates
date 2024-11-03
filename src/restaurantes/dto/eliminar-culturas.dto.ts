import { Field, InputType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class EliminarCulturaDto {
    @Field()
    @IsUUID()
    restauranteId: string;
    
    @Field()
    @IsUUID()
    culturaId: string;
}