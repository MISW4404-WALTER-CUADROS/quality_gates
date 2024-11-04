import { Test, TestingModule } from '@nestjs/testing';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from '../paises/entities/pais.entity';
import { Restaurante } from '../restaurantes/entities/restaurante.entity';
import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { Receta } from '../recetas/entities/receta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const cultura: Cultura = {
  id: 'mock-uuid',
  nombre: 'Cultura Mock',
  descripcion: 'Descripcion Mock',
  paises: [],
  restaurantes: [],
  recetas: [
    {
      id: 'mock-uuid',
      nombre: "Paella española",
      descripcion: "La paella es un tradicional plato español originario de Valencia, famoso por su combinación de sabores mediterráneos. Se elabora con arroz como ingrediente principal, al que se añade una variedad de mariscos como gambas, mejillones y calamares, junto con pollo o conejo, verduras frescas y azafrán, que le da su característico color dorado. Cocinada a fuego lento en una sartén ancha y poco profunda, la paella es un festín que celebra la riqueza culinaria de la región.",
      foto: "https://images.pexels.com/photos/16743486/pexels-photo-16743486/free-photo-of-comida-restaurante-langosta-cocinando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      proceso: "Preparación de ingredientes: Limpia y corta los mariscos, el pollo (o conejo), y las verduras (pimiento, tomate,judías verdes). Ten listo el caldo de pescado o pollo, y disuelve el azafrán en un poco de caldo caliente.Cocción de carnes: En una paellera con aceite de oliva, dora el pollo o conejo, retíralo y resérvalo. Luego, sofríe los mariscos hasta que estén ligeramente cocidos y también resérvalos. Sofrito: En la misma paellera, añade más aceite si es necesario, sofríe el pimiento, tomate rallado y ajo hasta que estén tiernos. Añadir arroz: Incorpora el arroz al sofrito y mézclalo bien para que absorba los sabores. Añadir caldo y azafrán: Vierte el caldo caliente y el azafrán disuelto. Coloca las carnes y verduras reservadas, distribuyéndolas uniformemente. Cocina a fuego medio-alto hasta que el arroz esté tierno y el caldo se haya absorbido. Cocción final: Añade los mariscos en los últimos minutos de cocción, dejando que se terminen de cocinar sobre el arroz. Deja reposar unos minutos antes de servir.",
      video: "https://www.youtube.com/watch?v=CrMAy18VRg4",
      cultura: new Cultura,
      productos: []
    }
  ],
  productos:[
    {
      id: 'mock-uuid_producto',
      nombre: "Arroz",
      descripcion: "El arroz es un cereal básico en la dieta de muchas culturas alrededor del mundo. Es conocido por su versatilidad en la cocina, pudiéndose preparar en una amplia variedad de platos, desde acompañamientos hasta platillos principales.",
      historia: "El arroz ha sido cultivado durante más de 8,000 años, con orígenes en Asia. A lo largo de la historia, ha sido un alimento esencial para diversas civilizaciones, especialmente en Asia, donde sigue siendo un alimento primordial en la dieta diaria.",
      cultura: new Cultura,
      categoria:"mock-uuid",
      recetas: []
    }
  ]
}

describe('CulturasService', () => {
  let culturaservice: CulturasService;
  let culturaRepository: jest.Mocked<Repository<Cultura>>;
  let paisRepository: jest.Mocked<Repository<Pais>>;
  let restauranteRepository: Repository<Restaurante>;
  const culturaID = 'd84d19a6-2cfd-439e-96ca-01d694920de5';
  const paisID = '03e029d1-d0b5-4623-a96c-35685fcbe944';
  let recetaRepository: Repository<Receta>
  let productoRepository: Repository<Producto>
  let cacheManager: Cache;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CulturasService,
        {
          provide: getRepositoryToken(Cultura),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Pais),
          useValue: {
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            findBy: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Receta),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Producto),
          useValue: {
            findBy: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            remove: jest.fn(),
            findOne: jest.fn(),
          }
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

    culturaservice = module.get<CulturasService>(CulturasService);
    culturaRepository = module.get(getRepositoryToken(Cultura));
    paisRepository = module.get(getRepositoryToken(Pais));
    restauranteRepository = module.get(getRepositoryToken(Restaurante));
    recetaRepository = module.get<Repository<Receta>>(getRepositoryToken(Receta));
    productoRepository = module.get(getRepositoryToken(Producto));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(culturaservice).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cultura', async () => {
      const createCulturaDto = {
        nombre: "Japonesa",
        descripcion: "La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
      };
      culturaRepository.create.mockReturnValue(createCulturaDto as any);
      culturaRepository.save.mockResolvedValue(createCulturaDto as any);
      const result = await culturaservice.create(createCulturaDto);
      expect(result).toEqual(createCulturaDto);
    });

    it('debería lanzar NotFoundException al crear mal una cultura', async () => {
      const createCulturaDto: CreateCulturaDto = {
        nombre: 'Test Cultura',
        descripcion: ''
      };
      jest.spyOn(culturaRepository, 'save').mockRejectedValue(new Error());

      await expect(culturaservice.create(createCulturaDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las culturas', async () => {
      const culturasMock = [{
        nombre: "Japonesa",
        descripcion: "La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
      }] as unknown as Cultura[];
      culturaRepository.find.mockResolvedValue(culturasMock);

      const result = await culturaservice.findAll();
      expect(result).toEqual(culturasMock);
    });

    it('debería lanzar NotFoundException al no encontrar ninguna cultura', async () => {
      jest.spyOn(culturaRepository, 'find').mockRejectedValue(new Error());

      await expect(culturaservice.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('debería retornar una cultura con id determinado', async () => {
      const cultura = new Cultura();
      cultura.id = 'uuid';
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(cultura);

      expect(await culturaservice.findOne('uuid')).toEqual(cultura);
    });

    it('debería lanzar NotFoundException al encontrar una cultura que no existe', async () => {
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(null);

      await expect(culturaservice.findOne('uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar una cultura', async () => {
      const updateCulturaDto = {
        nombre: "Japonesa Actualizada",
        descripcion: "Descripción actualizada.",
      };
      const culturaMock = { id: 'culturaId', nombre: 'Japonesa', descripcion: 'Descripción original' } as Cultura;
      const updatedCulturaMock = { id: 'culturaId', ...updateCulturaDto } as Cultura;

      culturaRepository.preload.mockResolvedValue(updatedCulturaMock);
      culturaRepository.save.mockResolvedValue(updatedCulturaMock);

      const result = await culturaservice.update('culturaId', updateCulturaDto);
      expect(result).toEqual(updatedCulturaMock);
    });

    it('debería lanzar NotFoundException al actualizar una cultura que no existe', async () => {
      const updateCulturaDto = {
        nombre: "Japonesa Actualizada",
        descripcion: "Descripción actualizada.",
      };
      culturaRepository.preload.mockResolvedValue(null);

      await expect(culturaservice.update('culturaId', updateCulturaDto))
        .rejects
        .toThrow(NotFoundException);
    });

    it('deberia dar un InternalServerErrorException error', async () => {
      jest.spyOn(culturaRepository, 'preload').mockResolvedValue(new Cultura());
      jest.spyOn(culturaRepository, 'save').mockRejectedValue(new Error());

      await expect(culturaservice.update('uuid', { nombre: 'Updated Cultura' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una cultura', async () => {
      const culturaMock = { id: 'culturaId' } as Cultura;
      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.remove.mockResolvedValue(culturaMock);
  
      const result = await culturaservice.remove('culturaId');
      expect(result).toEqual(undefined);
    });
  
    it('debería lanzar NotFoundException al eliminar una cultura que no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValue(null);
      await expect(culturaservice.remove('culturaId'))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw NotFoundException if cultura not found', async () => {
      const id = 'uuid';

      jest.spyOn(culturaservice, 'findOne').mockResolvedValue(null);

      await expect(culturaservice.remove(id)).rejects.toThrow(NotFoundException);
      expect(culturaservice.findOne).toHaveBeenCalledWith(id);
    });

    it('deberia dar un Error', async () => {
      const cultura = new Cultura();
      cultura.id = 'uuid';
      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(cultura);
      jest.spyOn(culturaRepository, 'remove').mockRejectedValue(new Error());

      await expect(culturaservice.remove('uuid')).rejects.toThrow(Error);
    });

    it('debería lanzar InternalServerErrorException', async () => {
      const id = 'uuid';
      const cultura = new Cultura();
      cultura.id = id;

      jest.spyOn(culturaservice, 'findOne').mockResolvedValue(cultura);
      jest.spyOn(culturaRepository, 'remove').mockRejectedValue(new Error('Database error'));

      await expect(culturaservice.remove(id)).rejects.toThrow(InternalServerErrorException);
      expect(culturaservice.findOne).toHaveBeenCalledWith(id);
      expect(culturaRepository.remove).toHaveBeenCalledWith(cultura);
    });
  });
  
//-----------------------------Paises de una cultura---------------------------------------------------//

  describe('agregarPaisesACultura', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValueOnce(null); 
      await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
        .rejects
        .toHaveProperty("message", `The culture with the given id culturaId was not found`);
    });

    it('debería lanzar BadRequestException si un pais no existe', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [];
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock); 
      paisRepository.findBy.mockResolvedValueOnce([]);

      await expect(culturaservice.agregarPaisesACultura('culturaId', ['paisId']))
        .rejects
        .toHaveProperty("message", `Alguno de los paises no existe`);
    });

    it('debería agregar paises a la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [];
      const paisesMock = new Pais();
      paisesMock.id = 'paisId';

      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([paisesMock]);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.agregarPaisesACultura('culturaId', ['paisId']);
      expect(result.paises).toContainEqual(paisesMock);
    });
  });

  describe('obtenerPaisesDecultura', () => {
    it('should return countries of a culture', async () => {
      const cultura = { id: culturaID, paises: [{ id: '887b4604-79fb-4f3c-bd9c-e23ac51ce0d8' }] };

      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValue(cultura as any);

      const result = await culturaservice.obtenerPaisesDecultura(culturaID);

      expect(result).toEqual(cultura);
      expect(culturaRepository.findOneBy).toHaveBeenCalledWith({ id: culturaID });
    });

    it('deberia dar NotFoundException como mensaje cuando la cultura no exista', async () => {
      culturaRepository.findOneBy.mockResolvedValue(null);
  
      await expect(culturaservice.obtenerPaisesDecultura(culturaID))
        .rejects
        .toThrowError(new NotFoundException(`The culture with the given id ${culturaID} was not found`));
    });
  });
  

  describe('actualizarPaisesEnCultura', () => {
    it('debería actualizar países en una cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const paisMock = new Pais();
      paisMock.id = 'paisId';
  
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([paisMock]);
      culturaRepository.save.mockResolvedValueOnce({...culturaMock, paises: [paisMock]});
  
      const result = await culturaservice.actualizarPaisesEnCultura('culturaId', ['paisId']);
      expect(result.paises).toEqual([paisMock]);
    });
  
    it('debería lanzar BusinessLogicException si algunos países no existen', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaRepository.findOneBy.mockResolvedValueOnce(culturaMock);
      paisRepository.findBy.mockResolvedValueOnce([]); 
  
      await expect(culturaservice.actualizarPaisesEnCultura('culturaId', ['paisId']))
        .rejects
        .toThrow(BusinessLogicException); 
    });
  });

  describe('eliminarPaisDeCultura', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      culturaRepository.findOneBy.mockResolvedValue(null);

      await expect(culturaservice.eliminarPaisDeCultura(culturaID, paisID))
        .rejects
        .toThrowError(new NotFoundException(`The culture with the given id ${culturaID} was not found`));
    });

    it('debería eliminar un país de la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const paisMock = new Pais();
      paisMock.id = 'paisId';
      culturaMock.paises = [paisMock];

      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.save.mockResolvedValue(culturaMock);

      const result = await culturaservice.eliminarPaisDeCultura('culturaId', 'paisId');
      expect(result.paises).not.toContain(paisMock);
      expect(culturaRepository.save).toHaveBeenCalledWith(culturaMock);
    });

    it('debería manejar el caso en que la cultura no tenga países', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.paises = [];

      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.save.mockResolvedValue(culturaMock);

      const result = await culturaservice.eliminarPaisDeCultura('culturaId', 'paisId');
      expect(result.paises).toEqual([]); 
      expect(culturaRepository.save).toHaveBeenCalledWith(culturaMock);
    });

    it('debería lanzar InternalServerErrorException en caso de error al guardar', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const paisMock = new Pais();
      paisMock.id = 'paisId';
      culturaMock.paises = [paisMock];

      culturaRepository.findOneBy.mockResolvedValue(culturaMock);
      culturaRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(culturaservice.eliminarPaisDeCultura('culturaId', 'paisId'))
        .rejects
        .toThrowError(new InternalServerErrorException('Database error'));
    });
  });

  describe('validateArrayPaises', () => {
    it('debería lanzar BusinessLogicException si alguno de los países no existe', () => {
      const paises = [{ id: 'paisId' }] as Pais[];
      const paisIds = ['paisId', 'nonExistingPaisId'];

      expect(() => culturaservice.validateArrayPaises(paises, paisIds))
        .toThrowError(new BusinessLogicException('Alguno de los paises no existe', HttpStatus.NOT_FOUND));
    });

    it('no debería lanzar excepción si todos los países existen', () => {
      const paises = [{ id: 'paisId' }] as Pais[];
      const paisIds = ['paisId'];

      expect(() => culturaservice.validateArrayPaises(paises, paisIds))
        .not
        .toThrow();
    });
  });


  //-----------------------------Restaurantes de una cultura---------------------------------------------------//  
  describe('AgregarRestaurantessACultura', () => {
    it('debería agregar restaurante a la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.restaurantes = [];
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restsuranteId';

      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValueOnce(culturaMock);
      jest.spyOn(restauranteRepository, 'findBy').mockResolvedValueOnce([restauranteMock]);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.agregarRestaurantesACultura('culturaId', ['restauranteId']);
      expect(result.restaurantes).toContain(restauranteMock);
    });

    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(culturaservice.agregarRestaurantesACultura('culturaId', ['restauranteId']))
      .rejects
      .toThrow(NotFoundException);
    });
  });

  describe('ActualizarRestaurantessACultura', () => {
    it('debería actualizar lista de restaurantes de una cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.restaurantes = [];
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restsuranteId';

      jest.spyOn(culturaRepository, 'findOneBy').mockResolvedValueOnce(culturaMock);
      jest.spyOn(restauranteRepository, 'findBy').mockResolvedValueOnce([restauranteMock]);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.actualizarRestaurantesEnCultura('culturaId', ['restauranteId']);
      expect(result.restaurantes).toContain(restauranteMock);
    });
  });

  describe('eliminarRestauranteDeCultura', () => {

    it('debería eliminar un restaurante de una cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      const restauranteMock = new Restaurante();
      restauranteMock.id = 'restauranteId';
      culturaMock.restaurantes = [restauranteMock];

      culturaRepository.findOne.mockResolvedValueOnce(culturaMock);
  
      culturaRepository.save.mockResolvedValueOnce({
        ...culturaMock,
        restaurantes: [] 
      });
      const result = await culturaservice.eliminarRestauranteDeCultura('culturaId', 'restauranteId');
      expect(result.restaurantes).not.toContainEqual(restauranteMock);
    });
  
    it('debería manejar la eliminación de un restaurante que no está en la cultura', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.restaurantes = []; 
      culturaRepository.findOne.mockResolvedValueOnce(culturaMock);
      culturaRepository.save.mockResolvedValueOnce(culturaMock);
      const result = await culturaservice.eliminarRestauranteDeCultura('culturaId', 'restauranteId');
      expect(result.restaurantes).toEqual([]);
    });

    it('debería lanzar una excepción si la cultura no existe', async () => {
      culturaRepository.findOne.mockResolvedValueOnce(null);
  
      await expect(culturaservice.eliminarRestauranteDeCultura('culturaId', 'restauranteId'))
        .rejects.toThrow(BusinessLogicException);
    });
  });
  
  
  
  
  
  

  describe('ObtenerRecetasDeCultura', () => {
    it('debería retornar todas las recetas de una cultura', async () => {
      culturaRepository.findOne.mockResolvedValue(cultura); // Mock del método findOneBy
      const resultado = await culturaservice.obtenerRecetasDeCultura('mock-uuid');
      expect(resultado).toEqual(cultura);
    });

    it('debería retornar error por al obtener recetas de una cultura que no existe', async () => {
      culturaRepository.findOne.mockResolvedValue(undefined); // Mock del método findOneBy
      await expect(culturaservice.obtenerRecetasDeCultura('no-existe'))
      .rejects
      .toHaveProperty("message", `La cultura ingresada no existe`)
    });
  });

  describe('AgregarRecetasACultura', () => {
    it('debería agregar recetas a la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.recetas = [];
      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(recetaRepository, 'findBy').mockResolvedValueOnce([recetaMock]);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.agregarRecetaACultura('culturaId', ['recetasId']);
      expect(result.recetas).toContain(recetaMock);
    });

    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(culturaservice.agregarRecetaACultura('culturaId', ['recetasId']))
        .rejects
        .toHaveProperty("message", `La cultura ingresada no existe`);
    });

    it('debería lanzar BadRequestException si una receta no existe', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(recetaRepository, 'findBy').mockResolvedValueOnce([]);

      await expect(culturaservice.agregarRecetaACultura('culturaId', ['recetasId']))
        .rejects
        .toHaveProperty("message", `Algunas de las recetas existe`);
    });
  });

  describe('ActualizarRecetasDeCultura', () => {
    it('debería actualizar listado de recetas de una cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.recetas = [];
      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(recetaRepository, 'findBy').mockResolvedValueOnce([recetaMock]);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.actualizarRecetasEnCultura('culturaId', ['recetasId']);
      expect(result.recetas).toContain(recetaMock);
    });
  });

  describe('eliminarRecetaDeCultura', () => {
    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(culturaservice.eliminarRecetaDeCultura('culturaId', 'recetaId'))
        .rejects
        .toHaveProperty("message", `La cultura ingresada no existe`);
    });

    it('debería eliminar una receta de una cultura correctamente', async () => {
      const recetaMock = new Receta();
      recetaMock.id = 'recetaId';

      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.recetas = [recetaMock];

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);

      const result = await culturaservice.eliminarRecetaDeCultura('culturaId', 'recetaId');
      expect(result).toBe(undefined);
    });
  });



  
  describe('Obtener producto De Cultura', () => {
    it('debería retornar todas los productos de una cultura', async () => {
      culturaRepository.findOne.mockResolvedValue(cultura);
      const resultado = await culturaservice.obtenerTodoLosProductosDeCultura('mock-uuid');
      expect(resultado).toEqual(cultura.productos);
    });

    it('debería retornar error por al obtener recetas de una cultura que no existe', async () => {
      culturaRepository.findOne.mockResolvedValue(undefined); // Mock del método findOneBy
      await expect(culturaservice.obtenerTodoLosProductosDeCultura('no-existe'))
      .rejects
      .toHaveProperty("message", `La cultura no existe con ese id`)
    });
  });

  describe('Agregar productos a cultura', () => {
    it('debería agregar productos a la cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.productos = [];
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);
      jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(productoMock);
      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(productoMock);

      const result = await culturaservice.agregarProductoAcultura('culturaId', 'productoId');
      expect(result.productos).toContain(productoMock);
    });

    it('debería lanzar NotFoundException si la cultura no existe', async () => {
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(culturaservice.agregarRecetaACultura('culturaId', ['recetasId']))
        .rejects
        .toHaveProperty("message", `La cultura ingresada no existe`);
    });

    it('debería lanzar BadRequestException si una receta no existe', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(recetaRepository, 'findBy').mockResolvedValueOnce([]);

      await expect(culturaservice.agregarRecetaACultura('culturaId', ['recetasId']))
        .rejects
        .toHaveProperty("message", `Algunas de las recetas existe`);
    });
  });

  describe('Actualizar  productos De Cultura', () => {
    it('debería actualizar listado de productos de una cultura correctamente', async () => {
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.productos = [];
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);
      jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(productoMock);
      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(productoMock);

      const result = await culturaservice.actualizarProductosDeLaCultura('culturaId', [productoMock]);
      expect(result.productos).toContain(productoMock);
    });
    
    it('debería retornar error por al actualizar productos de una cultura que no existe', async () => {
      culturaRepository.findOne.mockResolvedValue(undefined);
      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.productos = [];
      const productoMock = new Producto();
      productoMock.id = 'productoId';
      jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(productoMock);
      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(productoMock);

      await expect(culturaservice.actualizarProductosDeLaCultura('no-existe', [productoMock]))
      .rejects
      .toHaveProperty("message", `La cultura no existe con ese id`)
    });
  });

  describe('eliminar producto De Cultura', () => {
    
    it('debería eliminar un producto de una cultura correctamente', async () => {
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';
      culturaMock.productos = [productoMock];

      jest.spyOn(culturaRepository, 'findOne').mockResolvedValueOnce(culturaMock);
      jest.spyOn(culturaRepository, 'save').mockResolvedValueOnce(culturaMock);
      jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(productoMock);
      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(productoMock);

      const result = await culturaservice.eliminarProductoDeCultura('culturaId', 'productoId');
      expect(result).toBeUndefined()
    });
    
    it('debería retornar error al eliminar un producto que no existe de una cultura ', async () => {
      await expect(culturaservice.eliminarProductoDeCultura('culturaId', 'productoId_no_existe'))
      .rejects
      .toHaveProperty("message", `El producto no existe con ese id`)
    });

    it('debería retornar error al eliminar un producto  de una cultura que no existe', async () => {
      const productoMock = new Producto();
      productoMock.id = 'productoId';

      const culturaMock = new Cultura();
      culturaMock.id = 'culturaId';

      jest.spyOn(productoRepository, 'findOne').mockResolvedValueOnce(productoMock);
      jest.spyOn(productoRepository, 'save').mockResolvedValueOnce(productoMock);

      await expect(culturaservice.eliminarProductoDeCultura('culturaId', 'productoId'))
      .rejects
      .toHaveProperty("message", `La cultura no existe con ese id`)
    });

  });
});
