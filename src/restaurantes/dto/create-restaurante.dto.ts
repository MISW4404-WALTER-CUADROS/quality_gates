import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsString, MinLength, IsDate } from "class-validator";

@InputType()
export class CreateRestauranteDto {

    @Field()
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre: string;

    @Field()
    @IsNumber({}, { message: 'El campo estrellas debe ser un número' })
    estrellas: number;

    @Field()
    @IsDate()
    fechasConsecucionEstrellas: Date;
}

