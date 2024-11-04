import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { CategoriasResolver } from './categorias.resolver';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasResolver],  
  imports: [TypeOrmModule.forFeature([Categoria])],
})
export class CategoriasModule {}
