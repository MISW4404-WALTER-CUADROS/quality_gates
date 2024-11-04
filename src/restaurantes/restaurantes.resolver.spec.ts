import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesResolver } from './restaurantes.resolver';
import { RestaurantesService } from './restaurantes.service';
import { Restaurante } from './entities/restaurante.entity';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { plainToInstance } from 'class-transformer';

const mockRestaurante: Restaurante = {
    id: 'mock-uuid',
    nombre: 'Restaurante de Ejemplo',
    estrellas: 5,
    fechasConsecucionEstrellas: new Date('2023-01-01'),
    culturas: [],
    idCiudad: 'ciudad-mock-uuid',
};

const mockRestaurantesService = {
    findAll: jest.fn().mockResolvedValue([mockRestaurante]),
    findOne: jest.fn().mockResolvedValue(mockRestaurante),
    create: jest.fn().mockResolvedValue(mockRestaurante),
    update: jest.fn().mockResolvedValue(mockRestaurante),
    remove: jest.fn().mockResolvedValue(undefined),
};

describe('RestaurantesResolver', () => {
    let restaurantesResolver: RestaurantesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RestaurantesResolver,
                { provide: RestaurantesService, useValue: mockRestaurantesService },
            ],
        }).compile();

        restaurantesResolver = module.get<RestaurantesResolver>(RestaurantesResolver);
    });

    it('debería estar definido', () => {
        expect(restaurantesResolver).toBeDefined();
    });

    describe('findAll', () => {
        it('debería devolver un array de restaurantes', async () => {
            const result = await restaurantesResolver.restaurantes();
            expect(result).toEqual([mockRestaurante]);
            expect(mockRestaurantesService.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('debería devolver un restaurante por ID', async () => {
            const result = await restaurantesResolver.restaurante('mock-uuid');
            expect(result).toEqual(mockRestaurante);
            expect(mockRestaurantesService.findOne).toHaveBeenCalledWith('mock-uuid');
        });
    });

    describe('createRestaurante', () => {
        it('debería crear un nuevo restaurante', async () => {
            const createRestauranteDto: CreateRestauranteDto = {
                nombre: 'Nuevo Restaurante',
                estrellas: 4,
                fechasConsecucionEstrellas: new Date('2023-01-01'),
                
            };

            const result = await restaurantesResolver.createRestaurante(createRestauranteDto);
            expect(result).toEqual(mockRestaurante);
            expect(mockRestaurantesService.create).toHaveBeenCalledWith(plainToInstance(Restaurante, createRestauranteDto));
        });
    });

    describe('updateRestaurante', () => {
        it('debería actualizar un restaurante existente', async () => {
            const updateRestauranteDto: CreateRestauranteDto = {
                nombre: 'Restaurante Actualizado',
                estrellas: 5,
                fechasConsecucionEstrellas: new Date('2023-01-01'),
                
            };

            const result = await restaurantesResolver.updateRestaurante('mock-uuid', updateRestauranteDto);
            expect(result).toEqual(mockRestaurante);
            expect(mockRestaurantesService.update).toHaveBeenCalledWith('mock-uuid', plainToInstance(Restaurante, updateRestauranteDto));
        });
    });

    describe('deleteRestaurante', () => {
        it('debería eliminar un restaurante por ID', async () => {
            const result = await restaurantesResolver.deleteRestaurante('mock-uuid');
            expect(result).toEqual('mock-uuid');
            expect(mockRestaurantesService.remove).toHaveBeenCalledWith('mock-uuid');
        });
    });
});
