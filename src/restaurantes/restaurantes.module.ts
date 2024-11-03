import { Module } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { RestaurantesController } from './restaurantes.controller';
import { TypeOrmModule} from '@nestjs/typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { Ciudad } from '../ciudades/entities/ciudad.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { RestaurantesResolver } from './restaurantes.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurante, Ciudad, Cultura])],
  controllers: [RestaurantesController],
  providers: [RestaurantesService, RestaurantesResolver],
})
export class RestaurantesModule {}
