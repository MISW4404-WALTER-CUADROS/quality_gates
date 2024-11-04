import { Test, TestingModule } from '@nestjs/testing';
import { RecetasResolver } from './recetas.resolver';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';


describe('RecetasResolver', () => {
  let resolver: RecetasResolver;
  let recetasService: RecetasService;

  // Datos de prueba simulados
  const mockReceta = {
    id: 'recetaId1',
    nombre: "Nombre receta 1",
    descripcion:"Descripción receta 1",
    foto:"https://images.pexels.com/photos",
    proceso:"Proceso 1",
    video: "https://www.youtube.com/watch?v=CrMAy18VRg4",
    productos: [],
  };

  const mockRecetasArray = [
    {
        id: 'recetaId1',
        nombre: "Nombre receta 1",
        descripcion:"Descripción receta 1",
        foto:"https://images.pexels.com/photos",
        proceso:"Proceso 1",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4",
        productos: [],
    },
    {
        id: 'recetaId2',
        nombre: "Nombre receta 2",
        descripcion:"Descripción receta 2",
        foto:"https://images.pexels.com/photos",
        proceso:"Proceso 1",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4",
        productos: [],
    },
  ];

  const mockProducto = {
    id: 'productoId1',
    nombre: 'Producto 1',
  };

  const mockProductosArray = [mockProducto];

  const mockRecetasService = {
    findAll: jest.fn().mockResolvedValue(mockRecetasArray),
    findOne: jest.fn().mockResolvedValue(mockReceta),
    create: jest.fn().mockResolvedValue(mockReceta),
    update: jest.fn().mockResolvedValue(mockReceta),
    remove: jest.fn().mockResolvedValue(mockReceta),
    agregarProductosAReceta: jest.fn().mockResolvedValue(mockReceta),
    actualizarProductosEnReceta: jest.fn().mockResolvedValue(mockReceta),
    eliminarProductoDeReceta: jest.fn().mockResolvedValue(mockReceta),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecetasResolver,
        {
          provide: RecetasService,
          useValue: mockRecetasService,  // Mockeamos el servicio
        },
      ],
    }).compile();

    resolver = module.get<RecetasResolver>(RecetasResolver);
    recetasService = module.get<RecetasService>(RecetasService);
  });

  it('debería estar definido', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar una lista de recetas', async () => {
      const result = await resolver.recetas();
      expect(result).toEqual(mockRecetasArray);
      expect(recetasService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar una receta por ID', async () => {
      const result = await resolver.receta('recetaId1');
      expect(result).toEqual(mockReceta);
      expect(recetasService.findOne).toHaveBeenCalledWith('recetaId1');
    });
  });

  describe('createReceta', () => {
    it('debería crear una receta', async () => {
      const recetaDto: CreateRecetaDto = { 
        nombre: "Nombre receta 2",
        descripcion:"Descripción receta 2",
        foto:"https://images.pexels.com/photos",
        proceso:"Proceso 1",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4" };
      const result = await resolver.createReceta(recetaDto);
      expect(result).toEqual(mockReceta);
      expect(recetasService.create).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('deleteReceta', () => {
    it('debería eliminar una receta por ID', async () => {
      const result = await resolver.deleteReceta('recetaId1');
      expect(result).toEqual('recetaId1');
      expect(recetasService.remove).toHaveBeenCalledWith('recetaId1');
    });
  });

  describe('addProductoToReceta', () => {
    it('debería agregar un producto a una receta', async () => {
      const result = await resolver.agregarProductoAReceta('recetaId1', ['productoId1']);
      expect(result).toEqual(mockReceta);
      expect(recetasService.agregarProductosAReceta).toHaveBeenCalledWith('recetaId1', ['productoId1']);
    });
  });

  describe('updateProductosInReceta', () => {
    it('debería actualizar el listado de productos en una receta', async () => {
      const result = await resolver.updateProductosEnReceta('recetaId1', ['productoId1']);
      expect(result).toEqual(mockReceta);
      expect(recetasService.actualizarProductosEnReceta).toHaveBeenCalledWith('recetaId1', ['productoId1']);
    });
  });

  describe('removeProductoFromReceta', () => {
    it('debería remover un producto de una receta', async () => {
      const result = await resolver.removeProductoFromReceta('recetaId1', 'productoId1');
      expect(result).toEqual(mockReceta);
      expect(recetasService.eliminarProductoDeReceta).toHaveBeenCalledWith('recetaId1', 'productoId1');
    });
  });
});