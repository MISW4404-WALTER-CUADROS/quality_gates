import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasResolver } from './categorias.resolver';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

describe('CategoriasResolver', () => {
  let resolver: CategoriasResolver;
  let service: CategoriasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasResolver,
        {
          provide: CategoriasService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<CategoriasResolver>(CategoriasResolver);
    service = module.get<CategoriasService>(CategoriasService);
  });

  it('debería estar definido', () => {
    expect(resolver).toBeDefined();
  });

  describe('categorias', () => {
    it('debería retornar una lista de categorías', async () => {
      const result: Categoria[] = [{ id: '1', nombre: 'Categoria 1',descripcion:'descripcion categoria', productos:[] }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.categorias()).toBe(result);
    });
  });

  describe('categoria', () => {
    it('debería retornar una categoría por ID', async () => {
      const result: Categoria = { id: '1', nombre: 'Categoria 1',descripcion:'descripcion categoria', productos:[] };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await resolver.categoria('1')).toBe(result);
    });
  });

  describe('createCategoria', () => {
    it('debería crear una nueva categoría', async () => {
      const createCategoriaDto: CreateCategoriaDto = { nombre: 'Categoria 1',descripcion:'descripcion categoria'};
      const result: Categoria ={ id: '1', nombre: 'Nueva Categoria 1',descripcion:'descripcion categoria', productos:[] };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await resolver.createCategoria(createCategoriaDto)).toBe(result);
    });
  });

  describe('updateCategoria', () => {
    it('debería actualizar una categoría', async () => {
      const updateCategoriaDto: UpdateCategoriaDto = { nombre: 'Categoria Actualizada',descripcion:'descripcion categoria' };
      const result: Categoria = { id: '1', nombre: 'Categoria Actualizada',descripcion:'descripcion categoria' , productos:[] };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await resolver.updateCategoria('1', updateCategoriaDto)).toBe(result);
    });
  });

  describe('deleteCategoria', () => {
    it('debería eliminar una categoría', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      expect(await resolver.deleteCategoria('1')).toBe('1');
    });
  });
});
