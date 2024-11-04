import { IsUUID } from 'class-validator';

export class EliminarProductoDto {
  @IsUUID()
  recetaId: string;

  @IsUUID()
  productoId: string;
}