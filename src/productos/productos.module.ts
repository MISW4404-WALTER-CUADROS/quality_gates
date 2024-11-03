import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { ProductosResolver } from './productos.resolver';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService, ProductosResolver],
  imports: [TypeOrmModule.forFeature([Producto]),TypeOrmModule.forFeature([Categoria]) ],
})
export class ProductosModule {}
