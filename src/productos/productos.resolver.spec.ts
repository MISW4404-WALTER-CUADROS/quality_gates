import { Test, TestingModule } from '@nestjs/testing';
import { ProductosResolver } from './productos.resolver';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Cultura } from '../culturas/entities/cultura.entity';

describe('ProductosResolver', () => {
  let resolver: ProductosResolver;
  let service: ProductosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosResolver,
        {
          provide: ProductosService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            obtenerCategoriaDeProducto: jest.fn(),
            agregarCategoriaAProducto: jest.fn(),
            actualizarCategoriaEnProductos: jest.fn(),
            eliminarCategoriaDeProducto: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<ProductosResolver>(ProductosResolver);
    service = module.get<ProductosService>(ProductosService);
  });

  it('debería estar definido', () => {
    expect(resolver).toBeDefined();
  });

  describe('productos', () => {
    it('debería retornar una lista de productos', async () => {
      const result: Producto[] = [{ id: '1', nombre: 'Producto 1', descripcion:'', historia:'', categoria:'', recetas:[],cultura:new Cultura }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.productos()).toBe(result);
    });
  });

  describe('producto', () => {
    it('debería retornar un producto por ID', async () => {
      const result: Producto = { id: '1', nombre: 'Producto 1', descripcion:'', historia:'', categoria:'', recetas:[],cultura:new Cultura  };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await resolver.producto('1')).toBe(result);
    });
  });

  describe('createProducto', () => {
    it('debería crear un nuevo producto', async () => {
      const createProductoDto: CreateProductoDto = { nombre: 'Nuevo Producto', descripcion:'', historia:'', categoria:''  };
      const result: Producto = { id: '1', nombre: 'Nuevo Producto', descripcion:'', historia:'', categoria:'', recetas:[],cultura:new Cultura  };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await resolver.createProducto(createProductoDto)).toBe(result);
    });
  });

  describe('updateProducto', () => {
    it('debería actualizar un producto', async () => {
      const updateProductoDto: UpdateProductoDto = { nombre: 'Producto Actualizado', descripcion:'', historia:'', categoria:'' };
      const result: Producto = { id: '1', nombre: 'Producto Actualizado', descripcion:'', historia:'', categoria:'', recetas:[],cultura:new Cultura  };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await resolver.updateProducto('1', updateProductoDto)).toBe(result);
    });
  });

  describe('deleteProducto', () => {
    it('debería eliminar un producto', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await resolver.deleteProducto('1')).toBe('1');
    });
  });
  describe('categoriaDeProducto', () => {
    it('debería retornar la categoría de un producto por ID', async () => {
      const result: Producto = { id: '1', nombre: 'Producto 1', descripcion: '', historia: '', categoria: 'Categoria 1', recetas: [], cultura: new Cultura };
      jest.spyOn(service, 'obtenerCategoriaDeProducto').mockResolvedValue(result);

      expect(await resolver.categoriaDeProducto('1')).toBe(result);
    });
  });

  describe('agregarCategoriaAProducto', () => {
    it('debería agregar una categoría a un producto', async () => {
      const result: Producto = { id: '1', nombre: 'Producto 1', descripcion: '', historia: '', categoria: 'Nueva Categoria', recetas: [], cultura: new Cultura };
      jest.spyOn(service, 'agregarCategoriaAProducto').mockResolvedValue(result);

      expect(await resolver.agregarCategoriaAProducto('1', '1')).toBe(result);
    });
  });

  describe('actualizarCategoriaEnProductos', () => {
    it('debería actualizar la categoría de un producto', async () => {
      const result: Producto = { id: '1', nombre: 'Producto 1', descripcion: '', historia: '', categoria: 'Categoria Actualizada', recetas: [], cultura: new Cultura };
      jest.spyOn(service, 'actualizarCategoriaEnProductos').mockResolvedValue(result);

      expect(await resolver.actualizarCategoriaEnProductos('1', '1')).toBe(result);
    });
  });

});