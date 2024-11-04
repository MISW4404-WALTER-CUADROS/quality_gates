import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('ProductosService', () => {
  let service: ProductosService;
  let repository: Repository<Producto>;
  let repositoryCategoria: Repository<Categoria>;
  let productoRepositoryMock: jest.Mocked<Repository<Producto>>;
  let categoriaRepositoryMock: jest.Mocked<Repository<Categoria>>;
  let productosList: Producto[];
  let categoriasList: Categoria[];
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Categoria),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();
    
    service = module.get<ProductosService>(ProductosService);
    repository = module.get<Repository<Producto>>(getRepositoryToken(Producto));
    productoRepositoryMock = module.get(getRepositoryToken(Producto));
    repositoryCategoria = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    categoriaRepositoryMock = module.get(getRepositoryToken(Categoria));
    cacheManager = module.get<Cache>(CACHE_MANAGER);

    await seedDatabaseProducto();
    await seedDatabaseCategoria();
  });

  const seedDatabaseProducto = async () => {
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: Producto = await repository.save({
        nombre: "Producto Name", 
        descripcion: "descripcion", 
        historia: "Historia", 
        categoria: "categoriaId",
        recetas: []
      });
      productosList.push(producto);
    }
  };

  const seedDatabaseCategoria = async () => {
    categoriasList = [];
    for (let i = 0; i < 5; i++) {
      const categoria: Categoria = await repositoryCategoria.save({
        nombre: "Categoria Name", 
        descripcion: "descripcion"
      });
      categoriasList.push(categoria);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(productoRepositoryMock).toBeDefined();
    expect(repositoryCategoria).toBeDefined();
  });
  
  it('create retorna un producto nuevo', async () => {
    const prodMock = new Producto();
    prodMock.id = 'prodId';
    prodMock.categoria = "categoriaId"; 

    jest.spyOn(repositoryCategoria, 'findOne').mockResolvedValueOnce(categoriasList[0]);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(prodMock);

    const producto= {
      id: "",
      nombre: "Producto Name", 
      descripcion: "descripcion", 
      historia: "Historia", 
      categoria: null,
      recetas: []
    };
    
    const result = await service.create(producto);
    expect(result).toEqual(prodMock);
    
  });

  it('create un producto con id de categoria erronea', async () => {
    
    const producto = {
      nombre: "Producto Name", 
      descripcion: "descripcion", 
      historia: "Historia", 
      categoria:'0', 
      recetas:[],
      cultura: new Cultura
    }

    await expect(() => service.create(producto)).rejects.toHaveProperty("message", "No existe una categoria con ese id")

  });

  it('findAll retornar todas las categorias', async () => {
    const categorias: Producto[] = await service.findAll();
    expect(categorias).not.toBeNull();
  });

  it('findOne retorna error si un producto no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message","No existe un producto con ese id")
  });
  
  it('update debe actualizar y retornar un producto existente', async () => {
    const prodMock = new Producto();
    prodMock.id = 'prodId';
    prodMock.categoria = "categoriaId"; 
  
    jest.spyOn(repositoryCategoria, 'findOne').mockResolvedValueOnce(categoriasList[0]);
    jest.spyOn(repository, 'save').mockResolvedValueOnce(prodMock);
  
    const producto= {
      id: "",
      nombre: "Producto Name", 
      descripcion: "descripcion", 
      historia: "Historia", 
      categoria: null, 
      recetas: []
    };
    
    const productoExistente = await service.create(producto);
    const updateProductoDto = {
      ...productoExistente,
      nombre: 'Nombre Modificado',
      categoria: null 
    };
  
    productoRepositoryMock.findOne.mockResolvedValue(productoExistente);
    categoriaRepositoryMock.findOne.mockResolvedValue(categoriasList[0]);
  
    productoRepositoryMock.save.mockResolvedValue({
      ...productoExistente,
      ...updateProductoDto
    });
  
    const result = await service.update(productoExistente.id, updateProductoDto);
    expect(result).toEqual({
      ...productoExistente,
      ...updateProductoDto
    });
  
    expect(productoRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: productoExistente.id } });
    expect(productoRepositoryMock.save).toHaveBeenCalledWith(updateProductoDto);
  });
  
  it('update retorna error si no encuentra la producto modificar', async () => {
    let producto: Producto = productosList[0];
    producto = {
      ...producto, nombre: "Nombre Modificado"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });

  it('delete retorna error al elimina un producto', async () => {
    await expect(() => service.remove("0")).rejects.toHaveProperty("message", "No existe un producto con ese id")
  });

  it('agregarCategoriaAProducto retorna error si una categoria no existe', async () => {
    await expect(() => service.agregarCategoriaAProducto('productoId', 'categoriaId')).rejects.toHaveProperty("message","La categoría no existe")
  });

  it('debe asignar la categoría al producto', async () => {
    const productoId = '456';
    const categoriaId = '1';
  
    const categoria = { id: categoriaId, nombre: 'Categoría 1',descripcion:'', productos:[] };
    const producto = {
      id: productoId,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto',
      categoria: null,
      historia: 'Historia del producto',
      recetas: [],
      cultura: null
    };
  
    jest.spyOn(repositoryCategoria, 'findOne').mockResolvedValue(categoria);
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...producto,
      categoria: categoriaId
    });
  
    const result = await service.agregarCategoriaAProducto(productoId, categoriaId);
  
    expect(service.findOne).toHaveBeenCalledWith(productoId);
    expect(repository.save).toHaveBeenCalledWith({
      ...producto,
      categoria: categoriaId
    });
    expect(result.categoria).toEqual(categoriaId);
  });
  
  it('debe obtener una categoría asociada a un producto', async () => {
    const productoId = '456';
    const producto = {
      id: productoId,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto',
      categoria: '1',
      historia: 'Historia del producto',
      recetas: [],
      cultura: null
    };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);
  
    const result = await service.obtenerCategoriaDeProducto(productoId);
  
    expect(service.findOne).toHaveBeenCalledWith(productoId);
    expect(result).toEqual(producto);
  });

  it('debe actualizar la categoría de un producto', async () => {
    const productoId = '456';
    const categoriaId = '1';
    
    const producto = {
      id: productoId,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto',
      categoria: null,
      historia: 'Historia del producto',
      recetas: [],
      cultura: null
    };
  
    const nuevaCategoria = { id: categoriaId, nombre: 'Categoría Nueva', descripcion: '', productos: [] };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);
    jest.spyOn(repositoryCategoria, 'findOne').mockResolvedValue(nuevaCategoria); 
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...producto,
      categoria: categoriaId
    });
  
    const result = await service.actualizarCategoriaEnProductos(productoId, categoriaId);
    expect(service.findOne).toHaveBeenCalledWith(productoId);
    expect(repositoryCategoria.findOne).toHaveBeenCalledWith({ where: { id: categoriaId } }); 
    expect(repository.save).toHaveBeenCalledWith({
      ...producto,
      categoria: categoriaId
    });
    expect(result.categoria).toEqual(categoriaId);
  });

  it('debe lanzar un error si la nueva categoría no existe', async () => {
    const productoId = '456';
    const categoriaId = '1';
    
    const producto = {
      id: productoId,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto',
      categoria: null,
      historia: 'Historia del producto',
      recetas: [],
      cultura: null
    };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);
  
    await expect(service.actualizarCategoriaEnProductos(productoId, categoriaId))
      .rejects.toThrow("La categoría no existe");
  });
  
  it('debe eliminar la categoría de un producto', async () => {
    const productoId = '456';
    
    const producto = {
      id: productoId,
      nombre: 'Producto 1',
      descripcion: 'Descripción del producto',
      categoria: '1',
      historia: 'Historia del producto',
      recetas: [],
      cultura: null
    };
  
    jest.spyOn(service, 'findOne').mockResolvedValue(producto);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...producto,
      categoria: null
    });
  
    const result = await service.eliminarCategoriaDeProducto(productoId);
  
    expect(service.findOne).toHaveBeenCalledWith(productoId);
    expect(repository.save).toHaveBeenCalledWith({
      ...producto,
      categoria: null
    });
    expect(result.categoria).toBeNull();
  });
  
});
