import { Module } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { RecetasController } from './recetas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { RecetasResolver } from './recetas.resolver';

@Module({
  controllers: [RecetasController],
  providers: [RecetasService, RecetasResolver],
  imports: [
    TypeOrmModule.forFeature([ Receta, Producto, Cultura ]),
  ]
})
export class RecetasModule {}
