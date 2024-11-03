import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@InputType()
export class AgregarRestaurantesDto {

    @Field()
    @IsArray()
    @IsUUID('all', { each: true }) 
    restaurantesIds: string[];
}