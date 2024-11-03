import { Test, TestingModule } from '@nestjs/testing';
import { CulturasResolver } from './culturas.resolver';
import { CulturasService } from './culturas.service';

describe('CulturasResolver', () => {
  let resolver: CulturasResolver;
  let culturasService: CulturasService;

  const mockCultura = {
    id: 'culturaId1',
    nombre: "Nombre cultura 1",
    descripcion:"Descripción cultura 1",
    paises: [],
    restaurantes: [],
    recetas: [],
    productos: [],
  };

  const mockCulturasArray = [
    {
        id: 'culturaId1',
        nombre: "Nombre cultura 1",
        descripcion:"Descripción cultura 1",
        paises: [],
        restaurantes: [],
        recetas: [],
        productos: [],
    },
    {
      id: 'culturaId2',
      nombre: "Nombre cultura 2",
      descripcion:"Descripción cultura 2",
      paises: [],
      restaurantes: [],
      recetas: [],
      productos: [],
    },
  ];

  const mockCulturasService = {
    findAll: jest.fn().mockResolvedValue(mockCulturasArray),
    findOne: jest.fn().mockResolvedValue(mockCultura),
    create: jest.fn().mockResolvedValue(mockCultura),
    update: jest.fn().mockResolvedValue(mockCultura),
    remove: jest.fn().mockResolvedValue(mockCultura),
    agregarRecetaACultura: jest.fn().mockResolvedValue(mockCultura),
    actualizarRecetasEnCultura: jest.fn().mockResolvedValue(mockCultura),
    eliminarRecetaDeCultura: jest.fn().mockResolvedValue(mockCultura),
    agregarPaisesACultura: jest.fn().mockResolvedValue(mockCultura),
    updatePaisesEnCulturas: jest.fn().mockResolvedValue(mockCultura),
    actualizarPaisesEnCultura: jest.fn().mockResolvedValue(mockCultura),
    removePaisesFromCultura: jest.fn().mockResolvedValue(mockCultura),
    eliminarPaisDeCultura: jest.fn().mockResolvedValue(mockCultura),
    obtenerPaisesDeCultura: jest.fn().mockResolvedValue(mockCultura),
    agregarRestaurantesACultura: jest.fn().mockResolvedValue(mockCultura), 
    actualizarRestaurantesEnCultura: jest.fn().mockResolvedValue(mockCultura),
    eliminarRestauranteDeCultura: jest.fn().mockResolvedValue(mockCultura),
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasResolver,
        {
          provide: CulturasService, 
          useValue: mockCulturasService
        },
      ],
    }).compile();

    resolver = module.get<CulturasResolver>(CulturasResolver);
    culturasService = module.get<CulturasService>(CulturasService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('culturas', () => {
    it('debería retornar todas las culturas', async () => {
      const result = await resolver.culturas();
      expect(result).toEqual(mockCulturasArray);
      expect(culturasService.findAll).toHaveBeenCalled();
    });
  });

  describe('cultura', () => {
    it('debería retornar una cultura por id', async () => {
      const result = await resolver.cultura('culturaId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.findOne).toHaveBeenCalledWith('culturaId1');
    });
  });

  describe('createCultura', () => {
    it('debería crear una nueva cultura', async () => {
      const createCulturaDto = {
        nombre: "Nombre cultura 1",
        descripcion: "Descripción cultura 1",
      };
      const result = await resolver.createCultura(createCulturaDto);
      expect(result).toEqual(mockCultura);
      expect(culturasService.create).toHaveBeenCalledWith(createCulturaDto);
    });
  });

  describe('updateCultura', () => {
    it('debería actualizar una cultura existente', async () => {
      const updateCulturaDto = {
        nombre: "Nombre cultura actualizado",
        descripcion: "Descripción cultura actualizada",
      };
      const result = await resolver.updateCultura('culturaId1', updateCulturaDto);
      expect(result).toEqual(mockCultura);
      expect(culturasService.update).toHaveBeenCalledWith('culturaId1', updateCulturaDto);
    });
  });

  describe('removeCultura', () => {
    it('debería eliminar una cultura existente', async () => {
      const result = await resolver.removeCultura('culturaId1');
      expect(result).toBe(true);
      expect(culturasService.remove).toHaveBeenCalledWith('culturaId1');
    });
  });

  describe('addRecetaToCultura', () => {
    it('debería agregar una receta a una cultura', async () => {
      const result = await resolver.agregarRecetasACultura('culturaId1', ['recetaId1']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.agregarRecetaACultura).toHaveBeenCalledWith('culturaId1', ['recetaId1']);
    });
  });

  describe('updateRecetasInCultura', () => {
    it('debería actualizar el listado de recetas en una cultura', async () => {
      const result = await resolver.updateRecetaEnCulturas('culturaId1', ['recetaId1']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.actualizarRecetasEnCultura).toHaveBeenCalledWith('culturaId1', ['recetaId1']);
    });
  });

  describe('removeRecetaFromCultura', () => {
    it('debería remover un receta de una cultura', async () => {
      const result = await resolver.removeRecetaFromCultura('culturaId1', 'recetaId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.eliminarRecetaDeCultura).toHaveBeenCalledWith('culturaId1', 'recetaId1');
    });
  });

  // -----------------------------Paises de una cultura---------------------------------------------------//

  describe('agregarPaisesACultura', () => {
    it('debería agregar países a una cultura', async () => {
      const result = await resolver.agregarPaisesACultura('culturaId1', ['paisId1', 'paisId2']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.agregarPaisesACultura).toHaveBeenCalledWith('culturaId1', ['paisId1', 'paisId2']);
    });
  });
  
  describe('updatePaisesEnCulturas', () => {
    it('debería actualizar los países en una cultura', async () => {
      const result = await resolver.updatePaisesEnCulturas('culturaId1', ['paisId1', 'paisId2']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.actualizarPaisesEnCultura).toHaveBeenCalledWith('culturaId1', ['paisId1', 'paisId2']);
    });
  });
  
  describe('removePaisesFromCultura', () => {
    it('debería eliminar un país de una cultura', async () => {
      const result = await resolver.removePaisesFromCultura('culturaId1', 'paisId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.eliminarPaisDeCultura).toHaveBeenCalledWith('culturaId1', 'paisId1');
    });
  });
  
  describe('obtenerPaisesDeCultura', () => {
    it('debería obtener los países de una cultura', async () => {
      const result = await resolver.obtenerPaisesDeCultura('culturaId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.findOne).toHaveBeenCalledWith('culturaId1');
    });
  });
  

  // -----------------------------Restaurantes de una cultura---------------------------------------------------//

  describe('agregarRestaurantesACultura', () => {
    it('debería agregar restaurantes a una cultura', async () => {
      const result = await resolver.agregarRestaurantesACultura('culturaId1', ['restauranteId1', 'restauranteId2']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.agregarRestaurantesACultura).toHaveBeenCalledWith('culturaId1', ['restauranteId1', 'restauranteId2']);
    });
  });
  
  describe('updateRestaurantesEnCulturas', () => {
    it('debería actualizar los restaurantes en una cultura', async () => {
      const result = await resolver.updateRestaurantesEnCulturas('culturaId1', ['restauranteId1', 'restauranteId2']);
      expect(result).toEqual(mockCultura);
      expect(culturasService.actualizarRestaurantesEnCultura).toHaveBeenCalledWith('culturaId1', ['restauranteId1', 'restauranteId2']);
    });
  });
  
  describe('removeRestaurantesFromCultura', () => {
    it('debería eliminar un restaurante de una cultura', async () => {
      const result = await resolver.removeRestaurantesFromCultura('culturaId1', 'restauranteId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.eliminarRestauranteDeCultura).toHaveBeenCalledWith('culturaId1', 'restauranteId1');
    });
  });
  
  describe('obtenerRestaurantesDeCultura', () => {
    it('debería obtener los restaurantes de una cultura', async () => {
      const result = await resolver.obtenerRestaurantesDeCultura('culturaId1');
      expect(result).toEqual(mockCultura);
      expect(culturasService.findOne).toHaveBeenCalledWith('culturaId1');
    });
  });
  

});
