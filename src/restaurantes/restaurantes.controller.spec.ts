import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesController } from './restaurantes.controller';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { Restaurante } from './entities/restaurante.entity';
import { Cultura } from '../culturas/entities/cultura.entity';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';

describe('RestaurantesController', () => {
  let controller: RestaurantesController;
  let service: RestaurantesService;
  let mockResponse: Partial<Response>;

  const restauranteId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c45';
  const culturaId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c40';

  const mockRestaurante: Restaurante = {
    id: 'some-uuid',
    nombre: 'Restaurante El Gourmet',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
    idCiudad: 'some-city-id',
    culturas: [],
  };

  const mockCreateRestauranteDto: CreateRestauranteDto = {
    nombre: 'Restaurante El Gourmet',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
  };

  const mockUpdateRestauranteDto: UpdateRestauranteDto = {
    nombre: 'Restaurante El Gourmet Actualizado',
    estrellas: 4,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
  };

  const mockCultura: Cultura = {
    id: 'cultura-uuid',
    nombre: 'Cultura de Ejemplo',
    descripcion: 'Descripción de la cultura de ejemplo',
    paises: [],
    restaurantes: [],
    recetas: [],
    productos: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantesController],
      providers: [
        {
          provide: RestaurantesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRestaurante),
            findAll: jest.fn().mockResolvedValue([mockRestaurante]),
            findOne: jest.fn().mockResolvedValue(mockRestaurante),
            update: jest.fn().mockResolvedValue(mockRestaurante),
            remove: jest.fn().mockResolvedValue(mockRestaurante),
            agregarCulturaARestaurante: jest.fn().mockResolvedValue(mockRestaurante),
            obtenerCulturasDeRestaurante: jest.fn().mockResolvedValue([mockRestaurante]),
            actualizarCulturasDeRestaurante: jest.fn().mockResolvedValue(mockRestaurante),
            eliminarCulturaDeRestaurante: jest.fn().mockResolvedValue(undefined)
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantesController>(RestaurantesController);
    service = module.get<RestaurantesService>(RestaurantesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new restaurante', async () => {
      expect(await controller.create(mockCreateRestauranteDto)).toEqual(mockRestaurante);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurantes', async () => {
      expect(await controller.findAll()).toEqual([mockRestaurante]);
    });
  });

  describe('findOne', () => {
    it('should return a single restaurante', async () => {
      expect(await controller.findOne('some-uuid')).toEqual(mockRestaurante);
    });
  });

  describe('update', () => {
    it('should update and return the restaurante', async () => {
      expect(await controller.update('some-uuid', mockUpdateRestauranteDto)).toEqual(mockRestaurante);
    });
  });

  describe('remove', () => {
    it('should remove the restaurante', async () => {
      expect(await controller.remove('some-uuid')).toEqual(mockRestaurante);
    });
  });

  //-----------------------------Cultura de un restaurante---------------------------------------------------//

  describe('Agregar cultura a un restaurante', () => {
    it('debería llamar a agregarCulturaARestaurante con los datos correctos', async () => {
      const agregarCulturasDto: AgregarCulturasDto = {
        culturaIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarCulturas(culturaId,agregarCulturasDto);
      expect(service.agregarCulturaARestaurante).toHaveBeenCalledWith( culturaId, ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerCulturas', () => {
    it('debería llamar a obtenerCulturasDePais con el ID correcto', async () => {
      await controller.obtenerCulturasDeRestaurante(culturaId);
      expect(service.obtenerCulturasDeRestaurante).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('actualizarCulturas', () => {
    it('debería llamar a actualizarCulturasDeRestaurante con los datos correctos', async () => {
      const agregarCulturasDto: AgregarCulturasDto = {
        culturaIds: ['0e07e82b-0a71-465e-ad13-cdf7c8c16c40'],
      };
      await controller.actualizarCulturas(culturaId, agregarCulturasDto);
      expect(service.actualizarCulturasDeRestaurante).toHaveBeenCalledWith(
        culturaId,
        agregarCulturasDto.culturaIds,
      );
    });
  });

  describe('eliminarCultura', () => {
    it('debería llamar a eliminarCulturaDeRestaurante con los IDs correctos y enviar una respuesta con estado 204', async () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.eliminarCultura(culturaId, restauranteId, mockRes);

      expect(service.eliminarCulturaDeRestaurante).toHaveBeenCalledWith(culturaId, restauranteId);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });
  });

});
