import { Test, TestingModule } from '@nestjs/testing';
import { RecetasController } from './recetas.controller';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { AgregarProductosDto } from './dto/agregar-productos.dto';

describe('RecetasController', () => {
  let controller: RecetasController;
  let service: RecetasService;

  const recetaServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    agregarProductosAReceta: jest.fn(),
    actualizarProductosEnReceta: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
    controllers: [RecetasController],
    providers: [
        {
          provide: RecetasService,
          useValue: recetaServiceMock,
        },
      ],
    }).compile();
    controller = module.get<RecetasController>(RecetasController);
    service = module.get<RecetasService>(RecetasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar a RecetaService.create con los datos correctos', async () => {
      const createRecetaDto: CreateRecetaDto = {
        nombre: "Paella española",
        descripcion:"La paella es un tradicional plato español originario de Valencia, famoso por su combinación de sabores mediterráneos. Se elabora con arroz como ingrediente principal, al que se añade una variedad de mariscos como gambas, mejillones y calamares, junto con pollo o conejo, verduras frescas y azafrán, que le da su característico color dorado. Cocinada a fuego lento en una sartén ancha y poco profunda, la paella es un festín que celebra la riqueza culinaria de la región.",
        foto:"https://images.pexels.com/photos/16743486/pexels-photo-16743486/free-photo-of-comida-restaurante-langosta-cocinando.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        proceso:"Preparación de ingredientes: Limpia y corta los mariscos, el pollo (o conejo), y las verduras (pimiento, tomate,judías verdes). Ten listo el caldo de pescado o pollo, y disuelve el azafrán en un poco de caldo caliente.Cocción de carnes: En una paellera con aceite de oliva, dora el pollo o conejo, retíralo y resérvalo. Luego, sofríe los mariscos hasta que estén ligeramente cocidos y también resérvalos. Sofrito: En la misma paellera, añade más aceite si es necesario, sofríe el pimiento, tomate rallado y ajo hasta que estén tiernos. Añadir arroz: Incorpora el arroz al sofrito y mézclalo bien para que absorba los sabores. Añadir caldo y azafrán: Vierte el caldo caliente y el azafrán disuelto. Coloca las carnes y verduras reservadas, distribuyéndolas uniformemente. Cocina a fuego medio-alto hasta que el arroz esté tierno y el caldo se haya absorbido. Cocción final: Añade los mariscos en los últimos minutos de cocción, dejando que se terminen de cocinar sobre el arroz. Deja reposar unos minutos antes de servir.",
        video: "https://www.youtube.com/watch?v=CrMAy18VRg4"
    };
      await controller.create(createRecetaDto);
      expect(service.create).toHaveBeenCalledWith(createRecetaDto);
    });
  });

  describe('findAll', () => {
    it('debería llamar a RecetaService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería llamar a RecetaService.findOne con el ID correcto', async () => {
      const id = 'uuid';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('debería llamar a RecetaService.update con el ID y datos correctos', async () => {
      const id = 'uuid';
      const updateRecetaDto: UpdateRecetaDto = { nombre: 'Receta Actualizada' };
      await controller.update(id, updateRecetaDto);
      expect(service.update).toHaveBeenCalledWith(id, updateRecetaDto);
    });
  });

  describe('remove', () => {
    it('debería llamar a RecetaService.remove con el ID correcto', async () => {
      const id = 'uuid';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('Agregar producto a receta', () => {
    it('debería llamar a agregarProductosAReceta con los datos correctos', async () => {
      const agregarProductosDto: AgregarProductosDto = {
        productoIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.agregarProductos("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(service.agregarProductosAReceta).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });


  describe('Actualizar productos', () => {
    it('debería llamar a actualizarProductos con los datos correctos', async () => {
      const agregarProductosDto: AgregarProductosDto = {
        productoIds: ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]
    };
      await controller.actualizarProductos("0e07e82b-0a71-465e-ad13-cdf7c8c16c45",agregarProductosDto);
      expect(service.actualizarProductosEnReceta).toHaveBeenCalledWith( "0e07e82b-0a71-465e-ad13-cdf7c8c16c45", ["0e07e82b-0a71-465e-ad13-cdf7c8c16c40"]);
    });
  });
});
