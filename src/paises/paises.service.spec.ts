import { Test, TestingModule } from '@nestjs/testing';
import { PaisesService } from './paises.service';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Cultura } from '../culturas/entities/cultura.entity';
import { NotFoundException } from '@nestjs/common';

describe('PaisesService', () => {
  let service: PaisesService;
  let paisRepository: Repository<Pais>;
  let culturaRepository: Repository<Cultura>;

  const mockPais: Pais = {
    id: '1',
    nombre: 'Colombia',
    ciudades: [], 
    culturas: [] 
  };

  const mockCultura: Cultura = {
    id: '1',
    nombre: 'Colombiana',
    descripcion: 'Descripción de la cultura',
    paises: [mockPais],
    restaurantes: [],
    recetas: [],
    productos:[]
  };

  const createPaisDto = { nombre: 'Colombia' };
  const updatedPaisDto = { nombre: 'Updated Country' };

  const mockPaisRepository = {
    create: jest.fn().mockReturnValue(mockPais),
    save: jest.fn().mockResolvedValue(mockPais),
    find: jest.fn().mockResolvedValue([mockPais]),
    findOne: jest.fn().mockResolvedValue(mockPais),    
    findBy: jest.fn().mockResolvedValue(mockPais),
    preload: jest.fn().mockResolvedValue(mockPais),
    remove: jest.fn().mockResolvedValue(mockPais),
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
        PaisesService,
        { provide: getRepositoryToken(Pais), useValue: mockPaisRepository },
        { provide: getRepositoryToken(Cultura), useValue: mockCulturaRepository },
      ],
    }).compile();

    service = module.get<PaisesService>(PaisesService);
    paisRepository = module.get<Repository<Pais>>(getRepositoryToken(Pais));
    culturaRepository = module.get<Repository<Cultura>>(getRepositoryToken(Cultura));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a pais', async () => {
      const result = await service.create(createPaisDto);
      expect(result).toEqual(mockPais);
      expect(paisRepository.create).toHaveBeenCalledWith(createPaisDto);
      expect(paisRepository.save).toHaveBeenCalledWith(mockPais);
    });

    it('should throw an error if creation fails', async () => {
      jest.spyOn(paisRepository, 'save').mockRejectedValue(new Error('Creation failed'));
      await expect(service.create(createPaisDto)).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findAll', () => {
    it('should return an array of paises', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPais]);
      expect(paisRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if retrieval fails', async () => {
      jest.spyOn(paisRepository, 'find').mockRejectedValue(new Error('Retrieval failed'));
      await expect(service.findAll()).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('findOne', () => {
    it('should return a pais by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPais);
      expect(paisRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if pais is not found', async () => {
      jest.spyOn(paisRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(BusinessLogicException);
    });
  });

  describe('update', () => {
    it('should update and return the pais', async () => {
      jest.spyOn(paisRepository, 'preload').mockResolvedValue(mockPais);
      jest.spyOn(paisRepository, 'save').mockResolvedValue(mockPais);

      const result = await service.update('1', updatedPaisDto);
      expect(result).toEqual(mockPais);
      expect(paisRepository.preload).toHaveBeenCalledWith({ id: '1', ...updatedPaisDto });
      expect(paisRepository.save).toHaveBeenCalledWith(mockPais);
    });
  });

  describe('remove', () => {
    it('should remove a pais', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      const result = await service.remove('1');
      expect(result).toEqual(mockPais);
      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(paisRepository.remove).toHaveBeenCalledWith(mockPais);
    });

    it('should throw an error if remove fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(paisRepository, 'remove').mockRejectedValue(new Error('Remove failed'));
      await expect(service.remove('1')).rejects.toThrow(BusinessLogicException);
    });
  });

//-----------------------------Cultura de un pais---------------------------------------------------//

  describe('agregarCulturaAPaises', () => {
    it('debería agregar culturas a un país', async () => {
      const mockPais = { id: '1', culturas: [] } as Pais;
      const mockCulturas = [mockCultura];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(culturaRepository, 'find').mockResolvedValue(mockCulturas);
      jest.spyOn(paisRepository, 'save').mockResolvedValue(mockPais);

      const result = await service.agregarCulturaAPaises('1', ['1']);
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si una cultura no existe', async () => {
      const mockPais = { id: '1', culturas: [] } as Pais;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(culturaRepository, 'find').mockResolvedValue([]);

      await expect(service.agregarCulturaAPaises('1', ['1']))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  describe('obtenerCulturasDePais', () => {
    it('debería obtener las culturas de un país', async () => {
      const mockPais = { id: '1', culturas: [{ id: '1' }] } as Pais;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);

      const result = await service.obtenerCulturasDePais('1');
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si el país no existe', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.obtenerCulturasDePais('1'))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  describe('actualizarCulturasDePais', () => {
    it('debería actualizar las culturas de un país', async () => {
      const mockPais = { id: '1', culturas: [] } as Pais;
      const mockCulturas = [{ id: '1' } as Cultura];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue(mockCulturas);
      jest.spyOn(paisRepository, 'save').mockResolvedValue(mockPais);

      const result = await service.actualizarCulturasDePais('1', ['1']);
      expect(result.culturas.length).toBe(1);
    });

    it('debería lanzar un error si una cultura no existe', async () => {
      const mockPais = { id: '1', culturas: [] } as Pais;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPais);
      jest.spyOn(culturaRepository, 'findBy').mockResolvedValue([]);

      await expect(service.actualizarCulturasDePais('1', ['1']))
        .rejects
        .toThrow(BusinessLogicException);
    });
  });

  
  describe('eliminarCulturaDePais', () => {
    it('debería eliminar una cultura de un país', async () => {
      const paisConCulturas = {
        id: '1',
        culturas: [{ id: '1' }, { id: '2' }] as Cultura[],
      };
      const paisSinCultura = {
        id: '1',
        culturas: [{ id: '2' }] as Cultura[],
      };
  
      jest.spyOn(paisRepository, 'findOne').mockResolvedValue(paisConCulturas as any);
      jest.spyOn(paisRepository, 'save').mockResolvedValue(paisSinCultura as any);
  
      const result = await service.eliminarCulturaDePais('1', '1');
      expect(result.culturas.length).toBe(1);
      expect(result.culturas[0].id).toBe('2');
    });
  
    it('debería lanzar un error si el país no existe', async () => {
      jest.spyOn(paisRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.eliminarCulturaDePais('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  
    it('debería lanzar un error si el país no tiene culturas asociadas', async () => {
      const paisSinCulturas = { id: '1', culturas: [] } as Pais;
  
      jest.spyOn(paisRepository, 'findOne').mockResolvedValue(paisSinCulturas as any);
  
      await expect(service.eliminarCulturaDePais('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  
    it('debería lanzar un error si la cultura no está asociada al país', async () => {
      const paisConCulturas = {
        id: '1',
        culturas: [{ id: '2' }] as Cultura[],
      };
  
      jest.spyOn(paisRepository, 'findOne').mockResolvedValue(paisConCulturas as any);
  
      await expect(service.eliminarCulturaDePais('1', '1'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
  
});
