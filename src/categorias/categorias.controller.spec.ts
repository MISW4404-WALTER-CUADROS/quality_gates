import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

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
    controllers: [CategoriasController],
    providers: [
        {
          provide: CategoriasService,
          useValue: categoriaServiceMock,
        },
      ],
    }).compile();
    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar a CategoriaService.create con los datos correctos', async () => {
      const createCategoriaDto: CreateCategoriaDto = {
        nombre: "Categoria 1",
        descripcion:"Descripción Categoria",
    };
      await controller.create(createCategoriaDto);
      expect(service.create).toHaveBeenCalledWith(createCategoriaDto);
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
      const updateCategoriaDTO:UpdateCategoriaDto  = { descripcion:"",nombre: 'Receta Actualizada' };
      await controller.update(id, updateCategoriaDTO);
      expect(service.update).toHaveBeenCalledWith(id, updateCategoriaDTO);
    });
  });

  describe('remove', () => {
    it('debería llamar a Categoria.remove con el ID correcto', async () => {
      const id = 'uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('debería llamar a Categoria.remove con el ID correcto', async () => {
      const id = 'uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

});
