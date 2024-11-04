import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";



@InputType()
export class CreatePaisDto {

    @Field()
    @IsString({ message: 'El campo nombre debe ser un string' })
    @MinLength(1, { message: 'El campo nombre no debe estar vacío' }) 
    nombre: string;
}
