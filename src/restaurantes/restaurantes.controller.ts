import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { RestaurantesService } from './restaurantes.service';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { UpdateRestauranteDto } from './dto/update-restaurante.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly restaurantesService: RestaurantesService) {}
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  create(@Body() createRestauranteDto: CreateRestauranteDto) {
    return this.restaurantesService.create(createRestauranteDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findAll() {
    return this.restaurantesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findOne(@Param('id') id: string) {
    return this.restaurantesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRestauranteDto: UpdateRestauranteDto) {
    return this.restaurantesService.update(id, updateRestauranteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  remove(@Param('id') id: string) {
    return this.restaurantesService.remove(id);
  }

  @Post(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() AgregarCulturasDto: AgregarCulturasDto
  ){
    return this.restaurantesService.agregarCulturaARestaurante(id, AgregarCulturasDto.culturaIds);
  }

  @Get(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  async obtenerCulturasDeRestaurante(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantesService.obtenerCulturasDeRestaurante(id);
  }

  @Put(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async actualizarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ) {
    return this.restaurantesService.actualizarCulturasDeRestaurante(id, agregarCulturasDto.culturaIds);
  }
  
  @Delete(':restauranteId/culturas/:culturaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async eliminarCultura(
    @Param('restauranteId', ParseUUIDPipe) restauranteId: string,
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.restaurantesService.eliminarCulturaDeRestaurante(restauranteId, culturaId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
