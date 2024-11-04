import { Module } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CiudadesController } from './ciudades.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Pais } from '../paises/entities/pais.entity';
import { CiudadesResolver } from './ciudades.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Ciudad, Restaurante, Pais])],
  controllers: [CiudadesController],
  providers: [CiudadesService, CiudadesResolver],
})
export class CiudadesModule {}
