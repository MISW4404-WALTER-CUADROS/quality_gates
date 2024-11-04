import { IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class UpdateProductoDto {    
   
    @Field()
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre: string;

    @Field()
    @IsString({message: 'El campo descripcion debe ser un string' })
    @MinLength(1,{message: 'El campo descripcion no debe estar vacío'}) 
    descripcion: string;

    @Field()
    @IsString({message: 'El campo historia debe ser un string' })
    @MinLength(1,{message: 'El campo historia no debe estar vacío'}) 
    historia: string;

    @Field()
    @IsUUID()
    @IsOptional()
    categoria: string;

}
