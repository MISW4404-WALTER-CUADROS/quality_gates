import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';
import { In, Repository } from 'typeorm';
import { Producto } from '../productos/entities/producto.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetasService {

  cacheKey: string = "recetas";
  private readonly logger = new Logger('RecetasService')

  constructor(
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) { }

  async create(createRecetaDto: CreateRecetaDto) {

    try {
      const recipe = this.recetaRepository.create(createRecetaDto);
      this.recetaRepository.save(recipe);
      return recipe
    } catch (error) {
      this.logger.error(error)
      throw new BusinessLogicException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const cached = await this.cacheManager.get(this.cacheKey);

      if (!cached) {
        const recipes = await this.recetaRepository.find({ relations: ['productos'] });
        await this.cacheManager.set(this.cacheKey, recipes, 1000 * 600)
        return recipes;
      }
      return cached;
    } catch (error) {
      this.logger.error(error)
      throw new BusinessLogicException('Failed to get recipes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {

    const recipe = await this.recetaRepository.findOne(
      {
        where: { id: id },
        relations: ['productos'],
      }
    );
    if (!recipe) {
      throw new BusinessLogicException(`The recipe with the given id was not found`, HttpStatus.NOT_FOUND);
    }
    return recipe;

  }

  async update(id: string, updateRecetaDto: UpdateRecetaDto) {

    const recipe = await this.recetaRepository.preload({
      id: id,
      ...updateRecetaDto
    })
    if (!recipe) throw new BusinessLogicException(`The recipe with the given id ${id} was not found`, HttpStatus.NOT_FOUND);
    try {
      await this.recetaRepository.save(recipe);
      return recipe;
    } catch (error) {
      this.logger.error(error)
      throw new BusinessLogicException('Failed to update recipe due to a server error.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: string) {
    const recipe = await this.findOne(id);
    await this.recetaRepository.remove(recipe);
  }

  async agregarProductosAReceta(recetaId: string, productoIds: string[]) {
    const recipe = await this.findOne(recetaId);
    const productos = await this.productoRepository.findBy({ id: In(productoIds) });
    this.validateArrayProductos(productos, productoIds)
    recipe.productos.push(...productos);
    return await this.recetaRepository.save(recipe);
  }

  async obtenerProductosDeReceta(recetaId: string) {
    const recipe = await this.findOne(recetaId);
    return recipe
  }

  async actualizarProductosEnReceta(recetaId: string, productoIds: string[]) {
    const recipe = await this.findOne(recetaId);
    const nuevosProductos = await this.productoRepository.findBy({ id: In(productoIds) });
    this.validateArrayProductos(nuevosProductos, productoIds)
    recipe.productos = nuevosProductos;
    return await this.recetaRepository.save(recipe);
  }

  async eliminarProductoDeReceta(recetaId: string, productoId: string) {
    const recipe = await this.findOne(recetaId);
    recipe.productos = recipe.productos.filter(producto => producto.id !== productoId);
    await this.recetaRepository.save(recipe);
  }


  validateArrayProductos(productos, productoIds) {
    if (productos.length !== productoIds.length) {
      throw new BusinessLogicException(`Alguno de los productos no existe`, HttpStatus.NOT_FOUND);
    }
  }



}
