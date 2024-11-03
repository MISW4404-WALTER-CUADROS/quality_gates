import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesService } from './restaurantes.service';
import { Repository } from 'typeorm';
import { Restaurante } from './entities/restaurante.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Cultura } from '../culturas/entities/cultura.entity';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('RestaurantesService', () => {
  let service: RestaurantesService;
  let repository: Repository<Restaurante>;
  let culturaRepository: Repository<Cultura>;
  let cacheManager: Cache;

  const mockRestaurante: Restaurante = {
    id: '1',
    nombre: 'vista del mar',
    estrellas: 0,
    fechasConsecucionEstrellas: undefined,
    idCiudad: '',
    culturas: []
  };

  const mockCultura: Cultura = {
    id: '1',
    nombre: 'Colombiana',
    descripcion: 'Descripción de la cultura',
    paises: [],
    restaurantes: [mockRestaurante],
    recetas: [],
    productos: []
  };


  const mockRestauranteRepository = {
    create: jest.fn().mockReturnValue(mockRestaurante),
    save: jest.fn().mockResolvedValue(mockRestaurante),
    find: jest.fn().mockResolvedValue([mockRestaurante]),
    findOne: jest.fn().mockResolvedValue(mockRestaurante),    
    findBy: jest.fn().mockResolvedValue(mockRestaurante),
    preload: jest.fn().mockResolvedValue(mockRestaurante),
    remove: jest.fn().mockResolvedValue(mockRestaurante),
  };

  const mockCulturaRepository = {
    create: jest.fn().mockReturnValue(mockCultura),
    save: jest.fn().mockResolvedValue(mockCultura),
    find: jest.fn().mockResolvedValue([mockCultura]),
    findOne: jest.fn().mockResolvedValue(mockCultura),
    findBy: jest.fn().mockResolvedValue(mockCultura),
    preload: jest.fn().mockResolvedValue(mockCultura),
    remove: jest.fn().mockResolvedValue(mockCultura),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantesService,
        { provide: getRepositoryToken(Restaurante), useValue: mockRestauranteRepository },
        { provide: getRepositoryToken(Cultura), useValue: mockCulturaRepository },
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
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
      ], // Aquí es donde estaba faltando el corchete de cierre
    }).compile();
  
    service = module.get<RestaurantesService>(RestaurantesService);
    repository = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
    culturaRepository = module.get<Repository<Cultura>>(getRepositoryToken(Cultura));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a restaurante', async () => {
      const createRestauranteDto: CreateRestauranteDto = {
        nombre: 'Test Restaurante',
        estrellas: 5,
        fechasConsecucionEstrellas: new Date('2023-01-01'),
      };
      const createdRestaurante = { id: '1', ...createRestauranteDto };
      jest.spyOn(repository, 'create').mockReturnValue(createdRestaurante as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdRestaurante as any);

      expect(await service.create(createRestauranteDto)).toEqual(createdRestaurante);
    });

    it('should throw an error if creation fails', async () => {
      const createRestauranteDto: CreateRestauranteDto = {
        nombre: 'Test Restaurante',
        estrellas: 5,
        fechasConsecucionEstrellas: new Date('2023-01-01'), 
      };
      jest.spyOn(repository, 'create').mockReturnValue({} as any);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Creation failed'));

      await expect(service.create(createRestauranteDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurantes', async () => {
      const restaurantes = [{ id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date('2023-01-01') }];
      jest.spyOn(repository, 'find').mockResolvedValue(restaurantes as any);

      expect(await service.findAll()).toEqual(restaurantes);
    });

    
  });

  describe('findOne', () => {
    it('should return a restaurante by id', async () => {
      const restaurante = { id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date('2023-01-01') };
      jest.spyOn(repository, 'findOne').mockResolvedValue(restaurante as any);

      expect(await service.findOne('1')).toEqual(restaurante);
    });

    it('should throw an error if restaurante is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update and return the restaurante', async () => {
      const updateRestauranteDto: UpdateRestauranteDto = {
        nombre: 'Updated Restaurante',
        estrellas: 4,
        fechasConsecucionEstrellas: new Date('2023-01-01'),
      };
      const updatedRestaurante = { id: '1', ...updateRestauranteDto };
      jest.spyOn(repository, 'preload').mockResolvedValue(updatedRestaurante as any);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedRestaurante as any);

      expect(await service.update('1', updateRestauranteDto)).toEqual(updatedRestaurante);
    });

    
  });

  describe('remove', () => {
    it('should remove a restaurante', async () => {
      const restaurante = { id: '1', nombre: 'Test Restaurante', estrellas: 5, fechasConsecucionEstrellas: new Date('2023-01-01') };
      jest.spyOn(service, 'findOne').mockResolvedValue(restaurante as any);
      jest.spyOn(repository, 'remove').mockResolvedValue(restaurante as any);

      await expect(service.remove('1')).resolves.not.toThrow();
    });    
  });


  //-----------------------------Cultura de un restaurante---------------------------------------------------//

  describe('agregarCulturaARestaurante', () => {
    it('debería agregar culturas a un restaurante', async () => {
      const mockRestaurante = { id: '1', culturas: [] } as Restaurante;
      const mockCulturas = [mockCultura];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(culturaRepository, 'find').mockResolvedValue(mockCulturas);
      jest.spyOn(repository, 'save').mockResolvedValue(mockRestaurante);

      const result = await service.agregarCulturaARestaurante('1', ['1']);
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si una cultura no existe', async () => {
      const mockRestaurante = { id: '1', culturas: [] } as Restaurante;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(culturaRepository, 'find').mockResolvedValue([]);

      await expect(service.agregarCulturaARestaurante('1', ['1']))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  describe('obtenerCulturasDeRestaurante', () => {
    it('debería obtener las culturas de un restaurante', async () => {
      const mockRestaurante = { id: '1', culturas: [{ id: '1' }] } as Restaurante;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante);

      const result = await service.obtenerCulturasDeRestaurante('1');
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si el restaurante no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.obtenerCulturasDeRestaurante('1'))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  describe('actualizarCulturasDeRestaurante', () => {
    it('debería actualizar las culturas de un restaurante', async () => {
      const mockRestaurante = { id: '1', culturas: [] } as Restaurante;
      const mockCulturas = [{ id: '1' } as Cultura];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue(mockCulturas);
      jest.spyOn(repository, 'save').mockResolvedValue(mockRestaurante);

      const result = await service.actualizarCulturasDeRestaurante('1', ['1']);
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si una cultura no existe', async () => {
      const mockRestaurante = { id: '1', culturas: [] } as Restaurante;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue([]);

      await expect(service.actualizarCulturasDeRestaurante('1', ['1']))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  describe('eliminarCulturaDeRestaurante', () => {
    it('debería eliminar una cultura de un restaurante', async () => {
      const restauranteConCulturas = {
        id: '1',
        culturas: [{ id: '1' }, { id: '2' }] as Cultura[],
      };
      const restauranyteSinCultura = {
        id: '1',
        culturas: [{ id: '2' }] as Cultura[],
      };
  
      jest.spyOn(repository, 'findOne').mockResolvedValue(restauranteConCulturas as any);
      jest.spyOn(repository, 'save').mockResolvedValue(restauranyteSinCultura as any);
  
      const result = await service.eliminarCulturaDeRestaurante('1', '1');
      expect(result.culturas.length).toBe(1);
      expect(result.culturas[0].id).toBe('2');
    });
  
    it('debería lanzar un error si el restaurante no existe', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  
      await expect(service.eliminarCulturaDeRestaurante('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  
    it('debería lanzar un error si el restaurante no tiene culturas asociadas', async () => {
      const restauranyteSinCulturas = { id: '1', culturas: [] } as Restaurante;
  
      jest.spyOn(repository, 'findOne').mockResolvedValue(restauranyteSinCulturas as any);
  
      await expect(service.eliminarCulturaDeRestaurante('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  
    it('debería lanzar un error si la cultura no está asociada al restaurante', async () => {
      const restauranteConCulturas = {
        id: '1',
        culturas: [{ id: '2' }] as Cultura[],
      };
  
      jest.spyOn(repository, 'findOne').mockResolvedValue(restauranteConCulturas as any);
  
      await expect(service.eliminarCulturaDeRestaurante('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

});