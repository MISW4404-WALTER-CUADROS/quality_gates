import { Injectable, HttpStatus, Logger, NotFoundException, Inject } from '@nestjs/common';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { In, Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Cultura } from '../culturas/entities/cultura.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RestaurantesService {

  cacheKey: string = "restaurantes";
  private readonly logger = new Logger('RestaurantesService')

  constructor(
    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,

    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  async create(createRestauranteDto: CreateRestauranteDto) {
    try {
      const restaurante = this.restauranteRepository.create(createRestauranteDto);
      this.restauranteRepository.save(restaurante);
      return restaurante
    } catch (error) {
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const cached = await this.cacheManager.get(this.cacheKey);
      if (!cached) {
        const restaurantes = await this.restauranteRepository.find({ relations: ['culturas'] });
        await this.cacheManager.set(this.cacheKey, restaurantes, 1000 * 600)
        return restaurantes;
      }
      return cached;
    } catch (error) {
      throw new BusinessLogicException('Failed to get restaurantes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const restaurante = await this.restauranteRepository.findOne(
      {
        where: { id: id }
      }
    );
    if (!restaurante) {
      throw new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND);
    }
    return restaurante;
  }

  async update(id: string, updateRestauranteDto: UpdateRestauranteDto) {
    const restaurante = await this.restauranteRepository.preload({
      id: id,
      ...updateRestauranteDto
    })
    if (!restaurante) {
      throw new BusinessLogicException(`The restaurante with the given id was not found`, HttpStatus.NOT_FOUND);
    }
    try {

      await this.restauranteRepository.save(restaurante);
      return restaurante;
    } catch (error) {
      throw new BusinessLogicException('Failed to update restaurant due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: string) {
    const restaurante = await this.findOne(id);
    await this.restauranteRepository.remove(restaurante);
  }

  //-----------------------------Cultura de un restaurante---------------------------------------------------//

  //Método para agregar cultura a un restaurante
  async agregarCulturaARestaurante(restauranteId: string, culturaIds: string[]) {
    const country = await this.findOne(restauranteId);
    if (!Array.isArray(country.culturas)) {
      country.culturas = [];
    }

    const culturas = await this.culturaRepository.find({
      where: { id: In(culturaIds) }
    });
    this.validateArrayCulturas(culturas, culturaIds);
    country.culturas = [...new Set([...country.culturas, ...culturas])];
    return await this.restauranteRepository.save(country);
  }

  //Método para obtener culturas de un restaurante
  async obtenerCulturasDeRestaurante(restauranteId: string) {
    const restaurante = await this.findOne(restauranteId);
    if (!restaurante) {
      throw new BusinessLogicException(`The restaurante with the given id ${restauranteId} was not found`, HttpStatus.NOT_FOUND);
    }
    return restaurante;
  }

  //Método para actualizar el listado de culturas de un restaurante
  async actualizarCulturasDeRestaurante(restauranteId: string, culturaIds: string[]) {
    const restaurante = await this.findOne(restauranteId);
    const culturas = await this.culturaRepository.findBy({ id: In(culturaIds) });
    if (culturas.length !== culturaIds.length) {
      throw new BusinessLogicException(
        'Some of the provided cultures do not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    restaurante.culturas = culturas;
    return await this.restauranteRepository.save(restaurante);
  }

  //Método para eliminar una cultura de un restaurante
  async eliminarCulturaDeRestaurante(restauranteId: string, culturaId: string): Promise<Restaurante> {
    const restaurant = await this.restauranteRepository.findOne({
      where: { id: restauranteId },
      relations: ['culturas'],
    });
    if (!restaurant) {
      throw new NotFoundException(`The restaurante with the given id ${restauranteId} was not found`);
    }
    if (!restaurant.culturas || restaurant.culturas.length === 0) {
      throw new NotFoundException(`The restaurante with id ${restauranteId} has no cultures associated`);
    }
    const cultura = restaurant.culturas.find(cultura => cultura.id === culturaId);
    if (!cultura) {
      throw new NotFoundException(`The restaurante with id ${culturaId} was not found in country with id ${restauranteId}`);
    }
    restaurant.culturas = restaurant.culturas.filter(cultura => cultura.id !== culturaId);
    return await this.restauranteRepository.save(restaurant);
  }


  validateArrayCulturas(culturas, culturaIds) {
    if (culturas.length !== culturaIds.length) {
      throw new BusinessLogicException(`Alguno de los restaurantes no existe`, HttpStatus.NOT_FOUND);
    }
  }
}