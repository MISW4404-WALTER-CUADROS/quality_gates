import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let repository: Repository<Categoria>;
  let categoriaRepositoryMock: jest.Mocked<Repository<Categoria>>;
  let categoriasList: Categoria[];
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
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

    categoriaRepositoryMock = module.get(getRepositoryToken(Categoria));
    service = module.get<CategoriasService>(CategoriasService);
    repository = module.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    cacheManager = module.get<Cache>(CACHE_MANAGER);

    await seedDatabase();

  });
  const seedDatabase = async () => {
    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: Categoria = await repository.save({
          nombre: "Categoria 1",
          descripcion: "Descripcion de Categoria" 
        })
          categoriasList.push(categoria)
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();    
  });

  
  it('create retorna una categoria nueva', async () => {
    const categoria= {
      nombre: "Nueva Categoria", 
      descripcion: "Descripción nueva categoria", 
      productos: []
    }
    
    categoriaRepositoryMock.create.mockReturnValue(categoria as any);
    categoriaRepositoryMock.save.mockResolvedValue(categoria as any);

    const result = await service.create(categoria);
    expect(result).toEqual(categoria);

  });


  it('findAll retornar todas las categorias', async () => {
    const categorias: Categoria[] = await service.findAll();
    categoriaRepositoryMock.find.mockResolvedValue(categorias);

    expect(categorias).not.toBeNull();
  });

  it('findOne retornar una categoria', async () => {
    const categorias: Categoria[] = [{ id: '1',descripcion:'', nombre: 'Categoria 1', productos: [] }];
    jest.spyOn(service, 'findAll').mockResolvedValue(categorias);
    categoriaRepositoryMock.findOne.mockResolvedValue(categorias[0]);
  
    const categoria: Categoria = await service.findOne(categorias[0].id);
  
    expect(categoria).not.toBeNull();
    expect(categoria.id).toEqual(categorias[0].id);
    expect(categoria.nombre).toEqual('Categoria 1');
    expect(categoriaRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: categorias[0].id },
      relations: ["productos"],
    });
  });

  it('findOne retorna error si una categoria no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message","No existe una categoria con ese id")
  });


  it('update retorna error si no encuentra la categoria modificar', async () => {
    let categoria: Categoria = categoriasList[0];
    categoria = {
      ...categoria, nombre: "Nombre Modificado"
    }
    await expect(() => service.update("0", categoria)).rejects.toHaveProperty("message", "No existe una categoria con ese id")
  });

  it('update debe actualizar y retornar una categoría existente', async () => {
    const categoriaExistente = categoriasList[0];
    const categoria= {
      id: "",
      nombre: "Nueva Categoria", 
      descripcion: "Descripción nueva categoria", 
      productos: []
    }
    
    categoriaRepositoryMock.create.mockReturnValue(categoria as any);
    categoriaRepositoryMock.save.mockResolvedValue(categoria as any);

    const resultCAt = await service.create(categoria);

    const updateCategoriaDto = {
      nombre: 'Nombre Modificado',
      descripcion: 'Descripción Modificada',
      id: resultCAt.id,
      productos: []
    };
  
    categoriaRepositoryMock.findOne.mockResolvedValue(resultCAt);
    categoriaRepositoryMock.save.mockResolvedValue({
      ...resultCAt,
      ...updateCategoriaDto
    });
  
    const result = await service.update(resultCAt.id, updateCategoriaDto);
    expect(result).toEqual({
      ...resultCAt,
      ...updateCategoriaDto
    });
  });


  it('debe retornar un error si la categoría no existe al eliminarla', async () => {
    categoriaRepositoryMock.findOne.mockResolvedValue(null);
    await expect(service.remove("0")).rejects.toHaveProperty("message", "No existe una categoria con ese id");

    expect(categoriaRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "0" },
      relations: ["productos"],
    });
  });

  it('debe retornar un error si la categoría tiene productos asociados', async () => {
    const categoriaConProductos: Categoria = { id: '1', nombre: 'Categoria 1',descripcion:'', productos: [{ id: 'prod1', nombre:"Prod", descripcion:"desc", historia:"hist", recetas:[],cultura:null,categoria:'1' }] };
  
    categoriaRepositoryMock.findOne.mockResolvedValue(categoriaConProductos);
    await expect(service.remove("1")).rejects.toHaveProperty("message", "La categoria se encuentra asociada con un producto");

    expect(categoriaRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
      relations: ["productos"],
    });
  });


  it('debe eliminar la categoría si no tiene productos asociados', async () => {

    const categoriaSinProductos: Categoria = { id: '2', nombre: 'Categoria 2',descripcion:'', productos: [] };
    categoriaRepositoryMock.findOne.mockResolvedValue(categoriaSinProductos);
    categoriaRepositoryMock.remove.mockResolvedValue(categoriaSinProductos);
    await service.remove("2");
    expect(categoriaRepositoryMock.remove).toHaveBeenCalledWith(categoriaSinProductos);
    expect(categoriaRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "2" },
      relations: ["productos"],
    });
  });

});
