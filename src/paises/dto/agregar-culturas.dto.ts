import { IsArray, IsUUID } from "class-validator";

export class AgregarCulturasDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    culturaIds: string[];
}