import { IsOptional, IsString, MinLength } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoriaDto {
    @Field()
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;
    
    @Field()
    @IsOptional()
    @IsString({message: 'El campo nombre debe ser un string' })
    descripcion: string;
}
