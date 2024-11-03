import { Test, TestingModule } from '@nestjs/testing';
import { PaisesController } from './paises.controller';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { Cultura } from '../culturas/entities/cultura.entity';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';

describe('PaisesController', () => {
  let controller: PaisesController;
  let service: PaisesService;
  let mockResponse: Partial<Response>;

  const culturaId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c45';
  const paisId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c40';

  const mockPais = {
    id: 'some-uuid',
    nombre: 'País de Ejemplo',
  };

  const mockCreatePaisDto: CreatePaisDto = {
    nombre: 'País de Ejemplo',
  };

  const mockUpdatePaisDto: UpdatePaisDto = {
    nombre: 'País de Ejemplo Actualizado',
  };

  const mockCultura: Cultura = {
    id: 'cultura-uuid',
    nombre: 'Cultura de Ejemplo',
    descripcion: 'Descripción de la cultura de ejemplo',
    paises: [],
    restaurantes: [],
    recetas: [],
    productos: [],
  };

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaisesController],
      providers: [
        {
          provide: PaisesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPais),
            findAll: jest.fn().mockResolvedValue([mockPais]),
            findOne: jest.fn().mockResolvedValue(mockPais),
            update: jest.fn().mockResolvedValue(mockPais),
            remove: jest.fn().mockResolvedValue(mockPais),
            agregarCulturaAPaises: jest.fn().mockResolvedValue(mockPais),
            obtenerCulturasDePais: jest.fn().mockResolvedValue([mockCultura]),
            actualizarCulturasDePais: jest.fn().mockResolvedValue(mockPais),
            eliminarCulturaDePais: jest.fn().mockResolvedValue(mockPais),
          },
        },
      ],
    }).compile();

    controller = module.get<PaisesController>(PaisesController);
    service = module.get<PaisesService>(PaisesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pais', async () => {
      expect(await controller.create(mockCreatePaisDto)).toEqual(mockPais);
    });
  });

  describe('findAll', () => {
    it('should return an array of paises', async () => {
      expect(await controller.findAll()).toEqual([mockPais]);
    });
  });

  describe('findOne', () => {
    it('should return a single pais', async () => {
      expect(await controller.findOne('some-uuid')).toEqual(mockPais);
    });
  });

  describe('update', () => {
    it('should update and return the pais', async () => {
      expect(await controller.update('some-uuid', mockUpdatePaisDto)).toEqual(mockPais);
    });
  });

  describe('remove', () => {
    it('should remove the pais', async () => {
      expect(await controller.remove('some-uuid')).toEqual(mockPais);
    });
  });

//-----------------------------Cultura de un pais---------------------------------------------------//

  describe('Agregar cultura a un pais', () => {
    it('debería llamar a agregarPaisesACultura con los datos correctos', async () => {
      const agregarCulturasDto: AgregarCulturasDto = {
        culturaIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarCulturas(culturaId,agregarCulturasDto);
      expect(service.agregarCulturaAPaises).toHaveBeenCalledWith( culturaId, ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerCulturas', () => {
    it('debería llamar a obtenerPaisesDecultura con el ID correcto', async () => {
      await controller.obtenerCulturasDePais(culturaId);
      expect(service.obtenerCulturasDePais).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('actualizarCulturas', () => {
    it('debería llamar a actualizarPaisesEnCultura con los datos correctos', async () => {
      const agregarCulturasDto: AgregarCulturasDto = {
        culturaIds: ['0e07e82b-0a71-465e-ad13-cdf7c8c16c40'],
      };
      await controller.actualizarCulturas(culturaId, agregarCulturasDto);
      expect(service.actualizarCulturasDePais).toHaveBeenCalledWith(
        culturaId,
        agregarCulturasDto.culturaIds,
      );
    });
  });

  describe('eliminarPais', () => {
    it('debería llamar a eliminarPaisDeCultura con los IDs correctos', async () => {
      jest.spyOn(service, 'eliminarCulturaDePais').mockResolvedValue(undefined);
      await controller.eliminarCultura(culturaId, paisId, mockResponse as Response);
      expect(service.eliminarCulturaDePais).toHaveBeenCalledWith(culturaId, paisId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });
});
