import { Module } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { PaisesController } from './paises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pais } from './entities/pais.entity';
import { Ciudad } from '../ciudades/entities/ciudad.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { PaisesResolver } from './paises.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Pais, Ciudad, Cultura])],
  controllers: [PaisesController],
  providers: [PaisesService, PaisesResolver],
})
export class PaisesModule {}
