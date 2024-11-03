import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Categoria } from '../categorias/entities/categoria.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductosService {
  cacheKey: string = "productos";

  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache

  ) { }

  async create(createProductoDto: CreateProductoDto) {
    const categoriaId = createProductoDto.categoria;

    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });

      if (!cate) {
        throw new BusinessLogicException("No existe una categoria con ese id", HttpStatus.BAD_REQUEST);
      }
    }

    return this.productoRepository.save(createProductoDto);
  }



  async findAll(): Promise<Producto[]> {
    try {
      const cached: Producto[] = await this.cacheManager.get(this.cacheKey);

      if (!cached) {
        const recipes: Producto[] = await this.productoRepository.find({ relations: ["categoria"] });
        this.cacheManager.set(this.cacheKey, recipes, 1000 * 600)
        return recipes;
      }
      return cached;
    } catch (error) {
      throw new BusinessLogicException('Failed to get recipes due to a server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOne({ where: { id }, relations: ["categoria"] });
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const existeProducto: Producto = await this.productoRepository.findOne({ where: { id } });
    if (!existeProducto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);

    const categoriaId = updateProductoDto.categoria;

    if (categoriaId) {
      const cate: Categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });

      if (!cate) {
        throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
      }
    }
    existeProducto.nombre = updateProductoDto.nombre;
    existeProducto.descripcion = updateProductoDto.descripcion;
    existeProducto.historia = updateProductoDto.historia;
    existeProducto.categoria = updateProductoDto.categoria;
    return await this.productoRepository.save(existeProducto);

  }

  async remove(id: string) {
    const producto: Producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto)
      throw new BusinessLogicException("No existe un producto con ese id", HttpStatus.NOT_FOUND);

    await this.productoRepository.remove(producto);
  }

  async agregarCategoriaAProducto(productoId: string, categoriaId: string) {
    const categoriaExiste: Categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });

    if (!categoriaExiste) {
      throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
    }
    const producto = await this.findOne(productoId);

    if (!producto) {
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.BAD_REQUEST);
    }
    producto.categoria = categoriaId;
    return await this.productoRepository.save(producto);
  }

  async obtenerCategoriaDeProducto(productoId: string) {
    const producto = await this.findOne(productoId);
    return producto
  }

  async actualizarCategoriaEnProductos(productoId: string, categoriaId: string) {
    const producto = await this.findOne(productoId);


    if (!producto) {
      throw new BusinessLogicException("El producto no existe con ese id", HttpStatus.BAD_REQUEST);
    }

    const categoriaExiste: Categoria = await this.categoriaRepository.findOne({ where: { id: categoriaId } });
    if (!categoriaExiste) {
      throw new BusinessLogicException("La categoría no existe", HttpStatus.BAD_REQUEST);
    }

    producto.categoria = categoriaId;
    return await this.productoRepository.save(producto);
  }

  async eliminarCategoriaDeProducto(productoId: string) {
    const producto = await this.findOne(productoId);
    producto.categoria = null;

    return await this.productoRepository.save(producto);
  }



}
