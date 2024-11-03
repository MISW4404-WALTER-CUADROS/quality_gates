import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateCulturaDto {
    @Field({ nullable: true }) 
    @IsOptional()
    @IsString({message: 'El campo nombre debe ser un string' })
    @MinLength(1,{message: 'El campo nombre no debe estar vacío'}) 
    nombre?: string;

    @Field({ nullable: true }) 
    @IsOptional()
    @IsString({message: 'El campo descripcion debe ser un string' })
    @MinLength(1,{message: 'El campo descripcion no debe estar vacío'}) 
    descripcion?: string;
}


