import { Test, TestingModule } from '@nestjs/testing';
import { CulturasController } from './culturas.controller';
import { CulturasService } from './culturas.service';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { Response } from 'express';
import { AgregarRecetasDto } from './dto/agregar-receta.dto';
import { Receta } from '../recetas/entities/receta.entity';
import { Cultura } from './entities/cultura.entity';
import { EliminarRecetaDto } from './dto/eliminar-receta.dtos';
import { ActualizarProductosDto } from './dto/actualizar-productos.dto';
import { Producto } from '../productos/entities/producto.entity';
import { plainToInstance } from 'class-transformer';

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

describe('CulturasController', () => {
  let controller: CulturasController;
  let culturaservice: CulturasService;
  let mockResponse: Partial<Response>;

  const culturaId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c45';
  const paisId = '0e07e82b-0a71-465e-ad13-cdf7c8c16c40';

  const culturaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarPaisesACultura: jest.fn(),
    obtenerPaisesDecultura: jest.fn(), 
    actualizarPaisesEnCultura: jest.fn(), 
    eliminarPaisDeCultura: jest.fn(),
    agregarRecetaACultura: jest.fn(),
    actualizarRecetasEnCultura: jest.fn(),
    obtenerRecetasDeCultura: jest.fn(),
    eliminarRecetaDeCultura: jest.fn(),
    agregarProductoAcultura: jest.fn(),
    obtenerProductoDeCultura: jest.fn(),
    obtenerTodoLosProductosDeCultura: jest.fn(),
    actualizarProductosDeLaCultura: jest.fn(),
    eliminarProductoDeCultura: jest.fn(),
  };

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CulturasController],
      providers: [{
        provide: CulturasService,
        useValue: culturaServiceMock}],
    }).compile();
    controller = module.get<CulturasController>(CulturasController);
    culturaservice = module.get<CulturasService>(CulturasService);

    controller = module.get<CulturasController>(CulturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una cultura', async () => {
      const createCulturaDto = {
        nombre: "Japonesa",
        descripcion:"La gastronomía japonesa es conocida por su equilibrio, frescura y estética. En ella se destacan ingredientes como el pescado crudo (sushi y sashimi), arroz, algas marinas, y una variedad de vegetales y salsas como la soja y el miso. Los platos japoneses tienden a estar elaborados con cuidado, buscando resaltar los sabores naturales de los ingredientes.",
    };
      await controller.create(createCulturaDto);
      expect(culturaservice.create).toHaveBeenCalledWith(createCulturaDto);
    });
  });

  describe('findAll', () => {
    it('debería llamar a CulturaService.findAll', async () => {
      await controller.findAll();
      expect(culturaservice.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar a CulturaService.findOne con el ID correcto', async () => {
      await controller.findOne(culturaId);
      expect(culturaservice.findOne).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('update', () => {
    it('debería llamar a CulturaService.update con el ID y datos correctos', async () => {
      const updateCulturaDto: UpdateCulturaDto = { nombre: 'Cultura Actualizada' };
      await controller.update(culturaId, updateCulturaDto);
      expect(culturaservice.update).toHaveBeenCalledWith(culturaId, updateCulturaDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a CulturaService.remove con el ID correcto', async () => {
      jest.spyOn(culturaservice, 'remove').mockResolvedValue(undefined);
      await controller.remove(culturaId, mockResponse as Response);
      expect(culturaservice.remove).toHaveBeenCalledWith(culturaId);
    });
  });

//-----------------------------Paises de una cultura---------------------------------------------------//

  describe('Agregar pais a una cultura', () => {
    it('debería llamar a agregarPaisesACultura con los datos correctos', async () => {
      const agregarPaisesDto: AgregarPaisesDto = {
        paisIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarPaises(paisId,agregarPaisesDto);
      expect(culturaservice.agregarPaisesACultura).toHaveBeenCalledWith( paisId, ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerPaises', () => {
    it('debería llamar a obtenerPaisesDecultura con el ID correcto', async () => {
      await controller.obtenerPaises(culturaId);
      expect(culturaservice.obtenerPaisesDecultura).toHaveBeenCalledWith(culturaId);
    });
  });

  describe('actualizarPaises', () => {
    it('debería llamar a actualizarPaisesEnCultura con los datos correctos', async () => {
      const agregarPaisesDto: AgregarPaisesDto = {
        paisIds: ['0e07e82b-0a71-465e-ad13-cdf7c8c16c40'],
      };
      await controller.actualizarPais(culturaId, agregarPaisesDto);
      expect(culturaservice.actualizarPaisesEnCultura).toHaveBeenCalledWith(
        culturaId,
        agregarPaisesDto.paisIds,
      );
    });
  });

  describe('eliminarPais', () => {
    it('debería llamar a eliminarPaisDeCultura con los IDs correctos', async () => {
      jest.spyOn(culturaservice, 'eliminarPaisDeCultura').mockResolvedValue(undefined);
      await controller.eliminarPais(culturaId, paisId, mockResponse as Response);
      expect(culturaservice.eliminarPaisDeCultura).toHaveBeenCalledWith(culturaId, paisId);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('Agregar receta a cultura', () => {
    it('debería llamar a agregarRecetasACultura con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.agregarRecetaACultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });
  
  describe('Actualizar recetas de culturas', () => {
    it('debería llamar a actualizarRecetas con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.actualizarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.actualizarRecetasEnCultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('Obtener recetas de culturas', () => {
    it('debería llamar a actualizarRecetas con los datos correctos', async () => {
      const agregarProductosDto: AgregarRecetasDto = {
        recetasId: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.actualizarRecetas("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(culturaservice.actualizarRecetasEnCultura).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });

  describe('obtenerRecetasPorCultura', () => {
    it('debe retornar un array de recetas para una cultura dada', async () => {
      jest.spyOn(culturaservice, 'obtenerRecetasDeCultura').mockResolvedValue(cultura);
      const culturas = await controller.obtenerRecetas('mock-uuid');
      expect(culturas).toEqual(cultura);
      expect(culturaservice.obtenerRecetasDeCultura).toHaveBeenCalledWith('mock-uuid');
    });

    describe('eliminarRecetaDeCultura', () => {
      it('debe eliminar una receta de una cultura dada', async () => {
        const recetaMock = new Receta();
        recetaMock.id = 'recetaId';

        const culturaMock = new Cultura();
        culturaMock.id = 'culturaId';
        culturaMock.recetas = [recetaMock];

        const removeRecetaDto: EliminarRecetaDto = { culturaId:'culturaId', recetaId:'recetaId'}
        // Llamada al controlador
        await controller.eliminarReceta(removeRecetaDto);
  
        // Aserciones
        expect(culturaservice.eliminarRecetaDeCultura).toHaveBeenCalledWith('culturaId', 'recetaId');
      });
    });
  });

  describe('agregar un producto a la cultura', () => {
    it('debería agregar un producto a la cultura', async () => {
      const culturaId ="0e07e82b-0a71-465e-ad13-cdf7c8c16c45";
      const productoId = "0e07e82b-0a71-465e-ad13-cdf7c8c16c50";
      await controller.agregarProductoAcultura(culturaId,productoId);
      expect(culturaservice.agregarProductoAcultura).toHaveBeenCalledWith(culturaId, productoId);
    });
  });

  describe('obtener un producto de la cultura', () => {
    it('debería obtener un producto de la cultura', async () => {
      const culturaId ="0e07e82b-0a71-465e-ad13-cdf7c8c16c45";
      const productoId = "0e07e82b-0a71-465e-ad13-cdf7c8c16c50";

      await controller.obtenerProductoDeCultura(culturaId, productoId);
      expect(culturaservice.obtenerProductoDeCultura).toHaveBeenCalledWith(culturaId, productoId);
    });
    
    it('debería obtener todos los productos de la cultura', async () => {
      const culturaId = 'mockCulturaId';
      const mockProductos = [{ id: 'prod1', nombre: 'Producto 1',descripcion:'',categoria:'',historia:'',recetas:[],cultura:new Cultura }, { id: 'prod2', nombre: 'Producto 2',descripcion:'',categoria:'',historia:'',recetas:[],cultura:new Cultura }];
      await controller.obtenerTodoLosProductosDeCultura(culturaId);

      expect(culturaservice.obtenerTodoLosProductosDeCultura).toHaveBeenCalledWith(culturaId);
    });

  });

  describe('actualizar los productos de la cultura', () => {
    it('debería actualizar los productos de la cultura', async () => {
      const culturaId = 'mockCulturaId';
      const actualizarProductosDto: ActualizarProductosDto = {
        productosIds: ['prod1', 'prod2'],
      };
      const productos = plainToInstance(Producto, actualizarProductosDto.productosIds);
      await controller.actualizarProductosDeLaCultura(culturaId, actualizarProductosDto);
      expect(culturaservice.actualizarProductosDeLaCultura).toHaveBeenCalledWith(culturaId, productos);
    });
  });
  
  describe('eliminar un producto de la cultura', () => {  
    it('debería eliminar un producto de la cultura', async () => {
      const culturaId = 'mockCulturaId';
      const productoId = 'mockProductoId';

      await controller.eliminarProductoDeCultura(culturaId, productoId);
      expect(culturaservice.eliminarProductoDeCultura).toHaveBeenCalledWith(culturaId, productoId);
    });
  });
});
