import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, NotFoundException, UseGuards } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Role } from '../user/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../user/roles.decorator';

@Controller('ciudades')
export class CiudadesController {
  constructor(private readonly ciudadesService: CiudadesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  create(@Body() createCiudadDto: CreateCiudadDto) {
    return this.ciudadesService.create(createCiudadDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findOne(@Param('id') id: string) {
    return this.ciudadesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCiudadDto: UpdateCiudadDto) {
    return this.ciudadesService.update(id, updateCiudadDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  remove(@Param('id') id: string) {
    return this.ciudadesService.remove(id);
  }

  @Post(':ciudadId/restaurantes/:restauranteId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async asociarRestauranteACiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
  ) {
    try {
      return await this.ciudadesService.asociarRestauranteACiudad(ciudadId, restauranteId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':ciudadId/restaurantes/:restauranteId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async eliminarRestauranteDeCiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
  ) {
    try {
      await this.ciudadesService.eliminarRestauranteDeCiudad(ciudadId, restauranteId);
      return { message: `Restaurante con ID ${restauranteId} eliminado de la ciudad con ID ${ciudadId}` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get(':ciudadId/restaurantes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  async obtenerRestaurantesDeCiudad(
    @Param('ciudadId', ParseUUIDPipe) ciudadId: string,
  ) {
    return await this.ciudadesService.obtenerRestaurantesDeCiudad(ciudadId);
  }
}
