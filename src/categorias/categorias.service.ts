import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriasService {
  cacheKey: string = "categorias";

  constructor( 
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,

    @Inject(CACHE_MANAGER)
       private  cacheManager: Cache
  ){}
  create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaRepository.save(createCategoriaDto);
  }

  async findAll(): Promise<Categoria[]>  {

    try{
      const cached: Categoria[]  = await this.cacheManager.get(this.cacheKey);

      if(!cached){
        const recipes: Categoria[]  = await this.categoriaRepository.find({relations: ['productos']});
        await this.cacheManager.set(this.cacheKey, recipes, 1000*600)
        return recipes;
      }
      return cached;
    } catch(error){
      throw new BusinessLogicException('Failed to get recipes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const categoria: Categoria = await this.categoriaRepository.findOne({where: {id}, relations: ["productos"] } );
    if (!categoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);

    return categoria;  
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const existeCategoria: Categoria = await this.categoriaRepository.findOne({where:{id}});
    if (!existeCategoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);
    existeCategoria.nombre = updateCategoriaDto.nombre || existeCategoria.nombre;
    existeCategoria.descripcion = updateCategoriaDto.descripcion || existeCategoria.descripcion;

    return await this.categoriaRepository.save(existeCategoria);  
  }

  async remove(id: string) {
    const categoria: Categoria = await this.categoriaRepository.findOne({
      where: { id },  relations: ["productos"], 
    })

    if (!categoria)
      throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.NOT_FOUND);
    
    if (categoria.productos.length > 0) 
      throw new BusinessLogicException("La categoria se encuentra asociada con un producto", HttpStatus.BAD_REQUEST);
    
    await this.categoriaRepository.remove(categoria);
  }
}
