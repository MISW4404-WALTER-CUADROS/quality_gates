import { Test, TestingModule } from '@nestjs/testing';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CiudadesService', () => {
  let service: CiudadesService;
  let ciudadRepository: Repository<Ciudad>;
  let ciudadRepositoryMock: jest.Mocked<Repository<Ciudad>>
  let restauranteRepository: Repository<Restaurante>;
  let cacheManager: Cache;

  const mockCiudad: Ciudad = {
    id: '1',
    nombre: 'Bogotá',
    idPais: '1',
    restaurantes: [
      {
        id: 'mock:id',
        nombre: 'Nombre',
        estrellas: 5,
        fechasConsecucionEstrellas: undefined,
        culturas: [],
        idCiudad: ''
      }
    ]
  };

  const mockRestaurante: Restaurante = {
    id: '1',
    nombre: 'Restaurante Test',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
    culturas: [],
    idCiudad: '1' // Cambiado de idCiudad a ciudad
  };

  const createCiudadDto = { nombre: 'Bogotá' };
  const updatedCiudadDto = { nombre: 'Updated City' };

  const mockCiudadRepository = () => ({
    create: jest.fn().mockReturnValue(mockCiudad),
    save: jest.fn().mockResolvedValue(mockCiudad),
    find: jest.fn().mockResolvedValue([mockCiudad]),
    findOne: jest.fn().mockResolvedValue(mockCiudad),
    preload: jest.fn().mockResolvedValue(mockCiudad),
    remove: jest.fn().mockResolvedValue(mockCiudad),
  });

  const mockRestauranteRepository = {
    findOne: jest.fn().mockResolvedValue(mockRestaurante),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiudadesService,
        { provide: getRepositoryToken(Ciudad), useFactory: mockCiudadRepository },
        { provide: getRepositoryToken(Restaurante),
           useValue: mockRestauranteRepository 
        },
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            findOne: jest.fn(),
            findBy: jest.fn(),
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
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<CiudadesService>(CiudadesService);
    ciudadRepository = module.get<Repository<Ciudad>>(getRepositoryToken(Ciudad));
    ciudadRepositoryMock = module.get(getRepositoryToken(Ciudad));
    restauranteRepository = module.get<Repository<Restaurante>>(getRepositoryToken(Restaurante));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a ciudad', async () => {
      const result = await service.create(createCiudadDto);
      expect(result).toEqual(mockCiudad);
      expect(ciudadRepository.create).toHaveBeenCalledWith(createCiudadDto);
      expect(ciudadRepository.save).toHaveBeenCalledWith(mockCiudad);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(ciudadRepository, 'save').mockRejectedValue(new Error('Creation failed'));
      await expect(service.create(createCiudadDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of ciudades', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockCiudad]);
      expect(ciudadRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(ciudadRepository, 'find').mockRejectedValue(new Error('Retrieval failed'));
      await expect(service.findAll()).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findOne', () => {
    it('should return a ciudad by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockCiudad);
      expect(ciudadRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if ciudad is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update and return the ciudad', async () => {
      jest.spyOn(ciudadRepository, 'preload').mockResolvedValue(mockCiudad);
      jest.spyOn(ciudadRepository, 'save').mockResolvedValue(mockCiudad);

      const result = await service.update('1', updatedCiudadDto);
      expect(result).toEqual(mockCiudad);
      expect(ciudadRepository.preload).toHaveBeenCalledWith({ id: '1', ...updatedCiudadDto });
      expect(ciudadRepository.save).toHaveBeenCalledWith(mockCiudad);
    });

    it('should throw an error if ciudad to update is not found', async () => {
      jest.spyOn(ciudadRepository, 'preload').mockResolvedValue(null);
      await expect(service.update('1', updatedCiudadDto)).rejects.toThrow(BusinessLogicException);
    });

    it('should throw an error if update fails', async () => {
      jest.spyOn(ciudadRepository, 'preload').mockResolvedValue(mockCiudad);
      jest.spyOn(ciudadRepository, 'save').mockRejectedValue(new Error('Update failed'));
      await expect(service.update('1', updatedCiudadDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('remove', () => {
    it('should remove a ciudad', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCiudad);
      const result = await service.remove('1');
      expect(result).toEqual(mockCiudad);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(ciudadRepository.remove).toHaveBeenCalledWith(mockCiudad);
    });

    it('should throw an error if remove fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockCiudad);
      jest.spyOn(ciudadRepository, 'remove').mockRejectedValue(new Error('Remove failed'));
      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException);
    });
  });


  describe('asociarRestauranteACiudad', () => {
    it('should associate a restaurant with a city', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue({
        ...mockCiudad,
        restaurantes: []
      });
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      jest.spyOn(ciudadRepository, 'save').mockResolvedValue({
        ...mockCiudad,
        restaurantes: [mockRestaurante]
      });
      const result = await service.asociarRestauranteACiudad('1', '1');
      expect(result.restaurantes).toContain(mockRestaurante);
      expect(ciudadRepository.save).toHaveBeenCalledWith({
        ...mockCiudad,
        restaurantes: [mockRestaurante]
      });
    });

    it('should throw an error if ciudad is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      await expect(service.asociarRestauranteACiudad('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if restaurante is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(mockCiudad);
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);
      await expect(service.asociarRestauranteACiudad('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if restaurant is already associated', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue({
        ...mockCiudad,
        restaurantes: [mockRestaurante]
      });
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      await expect(service.asociarRestauranteACiudad('1', '1')).rejects.toThrow(Error);
    });
  });
  

  describe('eliminarRestauranteDeCiudad', () => {
    it('should remove a restaurant from a city', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue({
        ...mockCiudad,
        restaurantes: [mockRestaurante]
      });
      await service.eliminarRestauranteDeCiudad('1', '1');
      expect(ciudadRepository.save).toHaveBeenCalledWith({
        ...mockCiudad,
        restaurantes: []
      });
    });

    it('should throw an error if ciudad is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      await expect(service.eliminarRestauranteDeCiudad('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if restaurante is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(mockCiudad);
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(null);
      await expect(service.eliminarRestauranteDeCiudad('1', '1')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if restaurant is not associated with the city', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue({
        ...mockCiudad,
        restaurantes: []
      });
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValue(mockRestaurante);
      await expect(service.eliminarRestauranteDeCiudad('1', '1')).rejects.toThrow(Error);
    });
  });

  describe('obtenerRestaurantesDeCiudad', () => {
    it('should return a list of restaurants for a city', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(mockCiudad as any);
      
      const result = await service.obtenerRestaurantesDeCiudad('1');
      expect(result).toEqual(mockCiudad.restaurantes);
      expect(ciudadRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['restaurantes'],
      });
    });

    it('should throw NotFoundException if city is not found', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      
      await expect(service.obtenerRestaurantesDeCiudad('1')).rejects.toThrow(NotFoundException);
    });
  });

  //----------------- Pruebas Cultura - Ciudaddes ---------------------------------//

  describe('ObtenerRestaurantesDeCiudades', () => {
    it('should return a ciudad by id', async () => {
      ciudadRepositoryMock.findOne.mockResolvedValue(mockCiudad); // Mock del método findOneBy
      const resultado = await service.obtenerRestaurantesDeCiudad('1');
      expect(resultado).toEqual(mockCiudad.restaurantes);
    });

    it('debería retornar error por al obtener recetas de una cultura que no existe', async () => {
      ciudadRepositoryMock.findOne.mockResolvedValue(undefined); // Mock del método findOneBy
      await expect(service.obtenerRestaurantesDeCiudad('no-existe'))
      .rejects
      .toHaveProperty("message", `Ciudad con ID no-existe no encontrada`)
    });
  });

  describe('agregarRestaurantesACiudad', () => {
    it('debería agregar restaurantes a la ciudad correctamente', async () => {
      const ciudadMock = new Ciudad();
      ciudadMock.id = 'ciudadId';
      ciudadMock.restaurantes = [];
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';

      jest.spyOn( ciudadRepositoryMock, 'findOne').mockResolvedValueOnce(ciudadMock);
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValueOnce(restauranteMock);
      jest.spyOn(ciudadRepositoryMock, 'save').mockResolvedValueOnce(ciudadMock);

      const result = await service.asociarRestauranteACiudad('ciudadId', 'restauranteId');
      expect(result.restaurantes).toContain(restauranteMock);
    });

    it('debería dar error cuando se intente agregar un restaurante a una ciudad qe no existe', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValue(null);
      await expect(service.asociarRestauranteACiudad('no-existe', 'restauranteId'))
      .rejects
      .toThrow(NotFoundException);
    });

    it('debería dar error cuando se intente agregar un restaurante que no existe a una ciudad', async () => {
      
      const ciudadMock = new Ciudad();
      ciudadMock.id = 'ciudadId';
      ciudadMock.restaurantes = [];
    
      jest.spyOn( ciudadRepositoryMock, 'findOne').mockResolvedValueOnce(ciudadMock);
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(ciudadRepositoryMock, 'save').mockResolvedValueOnce(ciudadMock);
      
      await expect(service.asociarRestauranteACiudad('ciudadId', 'no-existe'))
      .rejects
      .toThrow(NotFoundException);
    });

    it('debería dar error cuando se intente agregar un restaurante que ya existe en una ciudad', async () => {
      
      const ciudadMock = new Ciudad();
      ciudadMock.id = 'ciudadId';
      ciudadMock.restaurantes = [];
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';

      jest.spyOn( ciudadRepositoryMock, 'findOne').mockResolvedValueOnce(ciudadMock);
      jest.spyOn(restauranteRepository, 'findOne').mockResolvedValueOnce(restauranteMock);
      jest.spyOn(ciudadRepositoryMock, 'save').mockResolvedValueOnce(ciudadMock);

      const result = await service.asociarRestauranteACiudad('ciudadId', 'restauranteId');
      await expect(service.asociarRestauranteACiudad('ciudadId', 'restauranteId'))
      .rejects
      .toThrow(Error);
    });

  });

  describe('eliminarRestauranteDeCiudad', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.eliminarRestauranteDeCiudad('ciudadId', 'restauranteId'))
        .rejects
        .toHaveProperty("message", `Ciudad con ID ciudadId no encontrada`);
    });

    it('debería eliminar una receta de una cultura correctamente', async () => {
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';

      const ciudadMock = new Ciudad();
      ciudadMock.id = 'ciudadId';
      ciudadMock.restaurantes = [restauranteMock];

      jest.spyOn(ciudadRepository, 'findOne').mockResolvedValueOnce(ciudadMock);
      jest.spyOn(ciudadRepository, 'save').mockResolvedValueOnce(ciudadMock);

      const result = await service.eliminarRestauranteDeCiudad('ciudadId', 'restauranteId');
      expect(result).toEqual(undefined);
    }); 
  });
});
