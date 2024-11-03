import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const categoriaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarProductosAReceta: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    controllers: [ProductosController],
    providers: [
        {
          provide: ProductosService,
          useValue: {
            create: jest.fn(), 
            findAll: jest.fn(),
            findOne: jest.fn(), 
            update: jest.fn(), 
            remove: jest.fn(), 
            agregarCategoriaAProducto: jest.fn(), 
            actualizarCategoriaEnProductos: jest.fn(), 
            eliminarCategoriaDeProducto: jest.fn(), 
          },
        },
      ],
    }).compile();
    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar a CategoriaService.create con los datos correctos', async () => {
      const createProductoDto: CreateProductoDto = {
        nombre: "Producto 1",
        descripcion:"Descripción Producto",
        historia:"historia Producto",
        categoria:"",
    };
      await controller.create(createProductoDto);
      expect(service.create).toHaveBeenCalledWith(createProductoDto);
    });
  });

  describe('findAll', () => {
    it('debería llamar a Categoria.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar a Categoria.findOne con el ID correcto', async () => {
      const id = 'uuid';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería llamar a Categoria.update con el ID y datos correctos', async () => {
      const id = 'uuid';
      const updateProductoDto:UpdateProductoDto  = { descripcion:"",nombre: 'Receta Actualizada',historia:"", categoria:"" };
      await controller.update(id, updateProductoDto);
      expect(service.update).toHaveBeenCalledWith(id, updateProductoDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a Categoria.remove con el ID correcto', async () => {
      const id = 'uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  it('debe agregar una categoría a un producto', async () => {
    const categoriaDto: CreateCategoriaDto = {
      categoriaId: '0e07e82b-0a71-465e-ad13-cdf7c8c16c40',
    };
    await controller.agregarCategoria("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",categoriaDto);

    expect(service.agregarCategoriaAProducto).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", "0e07e82b-0a71-465e-ad13-cdf7c8c16c40");

  });

  it('debería llamar a actualizarProductos con los datos correctos', async () => {
    const categoriaDto: CreateCategoriaDto = {
      categoriaId: "0e07e82b-0a71-465e-ad13-cdf7c8c16c40"
  };
    await controller.actualizarCategoria("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",categoriaDto);
    expect(service.actualizarCategoriaEnProductos).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", "0e07e82b-0a71-465e-ad13-cdf7c8c16c40");
  });
  
  it('debe eliminar la categoría asociada a un producto', async () => {
    const productoId = '456';
    jest.spyOn(service, 'eliminarCategoriaDeProducto').mockResolvedValue(undefined);
    await controller.eliminarCategoria(productoId);
  
    expect(service.eliminarCategoriaDeProducto).toHaveBeenCalledWith(productoId);
  });
  
});
