import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUrl, MinLength } from "class-validator";

@InputType()
export class CreateRecetaDto {

    @Field()
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;

    @Field()
    @IsString({message: 'El campo descripción debe ser un string'} )
    @MinLength(1,{message: 'El campo descripción no debe estar vacío'}) 
    descripcion: string;

    @Field()
    @IsUrl()
    foto: string;

    @Field()
    @IsString({message: 'El campo proceso debe ser un texto'})
    @MinLength(5, {message: 'El campo proceso no debe estar vacío'}) 
    proceso: string;

    @Field()
    @IsUrl()
    video: string;

}
