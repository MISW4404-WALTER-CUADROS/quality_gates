import { IsArray, IsUUID } from "class-validator";


export class AgregarProductosDto {

    @IsArray()
    @IsUUID('all', { each: true }) 
    productoIds: string[];
}