import { HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultura } from './entities/cultura.entity';
import { In, Repository } from 'typeorm';
import { Pais } from '../paises/entities/pais.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { Cache } from 'cache-manager';


@Injectable()
export class CulturasService {

  private readonly logger = new Logger('CulturasService');
  cacheKey: string = "cultura";

  constructor( 
    @InjectRepository(Cultura)
    private culturaRepository: Repository<Cultura>,

    @InjectRepository(Pais)
    private readonly paisRepository: Repository<Pais>,

    @InjectRepository(Restaurante)
    private readonly restauranteRepository: Repository<Restaurante>,

    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    
    @InjectRepository(Receta)
    private readonly recetaRepository: Repository<Receta>,

    @Inject(CACHE_MANAGER)
    private  cacheManager: Cache
  ){}
  
  async create(createCulturaDto: CreateCulturaDto) {
    try{
      const cultura = this.culturaRepository.create(createCulturaDto);
      await this.culturaRepository.save( cultura );
      return cultura
    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to create resource due to a server error.')
    }
  }

  async findAll() {
    try{
      const cached = await this.cacheManager.get(this.cacheKey);

      if(!cached){
        const culturas = await this.culturaRepository.find();
        await this.cacheManager.set(this.cacheKey, culturas, 1000*600)
        return culturas;
      }
      return cached;

    } catch(error){
      this.logger.error(error)
      throw new InternalServerErrorException('Failed to find a resource due to a server error.')
    }
  }

  async findOne(id:string) {
    const cultura = await this.culturaRepository.findOneBy({ id });
    if(!cultura){
      throw new NotFoundException(`The culture with the given id ${id} was not found`)
      }
    return cultura;
  }

  async update(id: string, updateCulturaDto: UpdateCulturaDto): Promise<Cultura> {
    const cultura = await this.culturaRepository.preload({
      id: id,
      ...updateCulturaDto
    });
  
    if (!cultura) {
      throw new NotFoundException(`The culture with the given id ${id} was not found`);
    }
  
    try {
      await this.culturaRepository.save(cultura);
      return cultura;
    } catch (error) {
      this.logger.error(`Failed to update culture with id ${id}:`, error);
      throw new InternalServerErrorException('Failed to update culture due to a server error.');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const cultura = await this.findOne(id);
      if (cultura) {
        await this.culturaRepository.remove(cultura);
        return;
      } else {
        throw new NotFoundException(`The culture with the given id ${id} was not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to remove culture with id ${id}:`, error);
      throw new InternalServerErrorException('Failed to remove culture due to a server error.');
    }
  }
  
  

//-----------------------------Paises de una cultura---------------------------------------------------//

  //Método para agregar paises a una cultura
  async agregarPaisesACultura(culturaId: string, paisIds: string[]) {
    const culture = await this.findOne(culturaId);
    if (!culture.paises)
      culture.paises = []
    const paises = await this.paisRepository.findBy({ id: In(paisIds) });
    this.validateArrayPaises(paises, paisIds)
    culture.paises.push(...paises);
    return await this.culturaRepository.save(culture);
  }
  

  //Método para obtener paises de una cultura
  async obtenerPaisesDecultura(culturaId: string) {
    const culture = await this.findOne(culturaId);
    return culture
  }

  //Método para actualizar el listado de paises de una cultura
  async actualizarPaisesEnCultura(culturaId: string, paisesIds: string[]): Promise<Cultura> {
    const cultura = await this.findOne(culturaId);
    const nuevosPaises = await this.paisRepository.findBy({ id: In(paisesIds) });
    this.validateArrayPaises(nuevosPaises, paisesIds);
    cultura.paises = Array.from(new Set(nuevosPaises.map(pais => pais.id)))
      .map(id => nuevosPaises.find(pais => pais.id === id));
    
    return await this.culturaRepository.save(cultura);
  }
  
  //Método para eliminar un pais de una cultura
  async eliminarPaisDeCultura(culturaId: string, paisId: string): Promise<Cultura> {
    const culture = await this.findOne(culturaId);
    
    if (!culture) {
      throw new NotFoundException(`La cultura con ID ${culturaId} no fue encontrada`);
    }
    if (!culture.paises) {
      culture.paises = [];
    }  
    culture.paises = culture.paises.filter(pais => pais.id !== paisId);
    return await this.culturaRepository.save(culture);
  }
  
  validateArrayPaises(paises, paisIds){
    if (paises.length !== paisIds.length) {
      throw new BusinessLogicException(`Alguno de los paises no existe`, HttpStatus.NOT_FOUND);
    }
  }

  

  //-----------------------------Restaurantes de una cultura---------------------------------------------------//

  //Método para agregar restaurentes a una cultura
  async agregarRestaurantesACultura(culturaId: string, restaurantesIds: string[]) {
    const cultura = await this.findOne(culturaId);
    if (!cultura.restaurantes) {
        cultura.restaurantes = []; 
    }
    const restaurantes = await this.restauranteRepository.findBy({ id: In(restaurantesIds) });
    this.validateArrayRestaurantes(restaurantes, restaurantesIds);
    cultura.restaurantes.push(...restaurantes);    
    return await this.culturaRepository.save(cultura);
}


  //Método para obtener restaurantes de una cultura
  // async obtenerRestaurantesDecultura(culturaId: string) {
  //   const culture = await this.findOne(culturaId);
  //   return culture
  // }
  async obtenerRestaurantesDecultura(culturaId: string) {
    const cultura = await this.culturaRepository.findOne({
        where: { id: culturaId },
        relations: ['restaurantes'],
    });
    if (!cultura) {
        throw new BusinessLogicException(`La cultura ingresada no existe`, HttpStatus.NOT_FOUND);
    }
    return cultura;
}


  //Método para actualizar el listado de restaurantes de una cultura
  async actualizarRestaurantesEnCultura(culturaId: string, restaurantesIds: string[]){
    const culture = await this.findOne(culturaId);
    const nuevosRestaurantes =  await this.restauranteRepository.findBy({ id: In(restaurantesIds) });
    this.validateArrayRestaurantes(nuevosRestaurantes, restaurantesIds)
    culture.restaurantes = nuevosRestaurantes;
    return await this.culturaRepository.save(culture);
  }

  
  async eliminarRestauranteDeCultura(culturaId: string, restauranteId: string) {
    const cultura = await this.obtenerRestaurantesDecultura(culturaId);
    
    // Verificar si la propiedad restaurantes está definida
    if (!cultura.restaurantes) {
        cultura.restaurantes = [];
    }

    cultura.restaurantes = cultura.restaurantes.filter(restaurante => restaurante.id !== restauranteId);
    return await this.culturaRepository.save(cultura);
  }






  validateArrayRestaurantes(restaurantes, restauranteIds){
    if (restaurantes.length !== restauranteIds.length) {
      throw new BusinessLogicException(`Alguno de los restaurantes no existe`, HttpStatus.NOT_FOUND);
    }
  }

  
   //-----------------------------Recetas de una cultura---------------------------------------------------//

   //Metodo para agregar una receta a una cultura
   async agregarRecetaACultura(culturaId: string, recetasIds: string[]) {
    const cultura = await this.obtenerRecetasDeCultura(culturaId);
    const recetas = await this.recetaRepository.findBy({ id: In(recetasIds) });
    this.validateArrayRecetas(recetas, recetasIds);
    cultura.recetas.push(...recetas);
    return await this.culturaRepository.save(cultura);
  }

  async obtenerRecetasDeCultura(culturaId: string){
    const cultura = await this.culturaRepository.findOne(
      {
        where: { id: culturaId },
        relations: ['recetas'],
      }
    );
    if(!cultura){
      throw new BusinessLogicException(`La cultura ingresada no existe`, HttpStatus.NOT_FOUND);
      }
    return cultura;
  }

  async actualizarRecetasEnCultura(culturaId: string, recetasIds: string[]){
    const cultura = await this.obtenerRecetasDeCultura(culturaId);
    const nuevasRecetas =  await this.recetaRepository.findBy({ id: In(recetasIds) });
    this.validateArrayRecetas(nuevasRecetas, recetasIds)
    cultura.recetas = nuevasRecetas;
    return await this.culturaRepository.save(cultura);
  }

  async eliminarRecetaDeCultura(culturaId: string, recetaId: string){
    const cultura = await this.obtenerRecetasDeCultura(culturaId);
    cultura.recetas = cultura.recetas.filter(receta => receta.id !== recetaId);
  }

  validateArrayRecetas(recetas, recetasIds){
    if (recetas.length !== recetasIds.length) {
      throw new BusinessLogicException(`Algunas de las recetas existe`, HttpStatus.NOT_FOUND);
    }
  }


   //-----------------------------Producto a una cultura---------------------------------------------------//

  async agregarProductoAcultura( culturaId: string, productoId: string){
    const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}});
    if (!cultura)
      throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND);
    if (!cultura.productos) {
      cultura.productos = [];
    }

    const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}}) 
    if (!producto)
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND);
  
    const productoYaEnCultura = cultura.productos.some(p => p.id === productoId);
    if (productoYaEnCultura) {
        throw new BusinessLogicException("El producto ya está asociado a esta cultura", HttpStatus.BAD_REQUEST);
    }

    cultura.productos.push(producto);
  return await this.culturaRepository.save(cultura);
}

async obtenerProductoDeCultura(culturaId: string, productoId: string){
    const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}});
    if (!producto)
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND)
    
    const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]}); 
    if (!cultura)
      throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)

    const culturaProducto: Producto = cultura.productos.find(e => e.id === producto.id);

    if (!culturaProducto)
      throw new BusinessLogicException("El producto con ese id no se encuentra asociado a la cultura", HttpStatus.PRECONDITION_FAILED)

  return culturaProducto;
}

async obtenerTodoLosProductosDeCultura(culturaId: string){
  const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
  if (!cultura)
    throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)
    
  return cultura.productos;
}

async actualizarProductosDeLaCultura(culturaId: string, productos: Producto[]){
  const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
   
  if (!cultura)
    throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)

  const productosValidos: Producto[] = [];

  for (let produc of productos) {
    const productoExistente: Producto = await this.productoRepository.findOne({where: {id: produc.id}});
    if (!productoExistente)
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND)
    
    productosValidos.push(productoExistente)
  }

  cultura.productos = productosValidos;

  return await this.culturaRepository.save(cultura);
}

async eliminarProductoDeCultura(culturaId: string, productoId: string){
  const producto: Producto = await this.productoRepository.findOne({where: {id: productoId}});
  if (!producto)
    throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.NOT_FOUND)

  const cultura: Cultura = await this.culturaRepository.findOne({where: {id: culturaId}, relations: ["productos"]});
  if (!cultura)
    throw new BusinessLogicException("La cultura no existe con ese id", HttpStatus.NOT_FOUND)

  const culturaProducto: Producto = cultura.productos.find(e => e.id === producto.id);

  if (!culturaProducto)
      throw new BusinessLogicException("El producto con ese id no se encuentra asociado a la cultura", HttpStatus.PRECONDITION_FAILED)

  cultura.productos = cultura.productos.filter(e => e.id !== productoId);
  await this.culturaRepository.save(cultura);
}

}
