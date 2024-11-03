import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { AgregarCulturasDto } from './dto/agregar-culturas.dto';
import { Response } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';


@Controller('paises')
export class PaisesController {
  constructor(private readonly paisesService: PaisesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  create(@Body() createPaisDto: CreatePaisDto) {
    return this.paisesService.create(createPaisDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findAll() {
    return this.paisesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findOne(@Param('id') id: string) {
    return this.paisesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePaisDto: UpdatePaisDto) {
    return this.paisesService.update(id, updatePaisDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  remove(@Param('id') id: string) {
    return this.paisesService.remove(id);
  }

  @Post(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() AgregarCulturasDto: AgregarCulturasDto
  ){
    return this.paisesService.agregarCulturaAPaises(id, AgregarCulturasDto.culturaIds);
  }

  @Get(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  async obtenerCulturasDePais(@Param('id', ParseUUIDPipe) id: string) {
    return this.paisesService.obtenerCulturasDePais(id);
  }

  @Put(':id/culturas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async actualizarCulturas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarCulturasDto: AgregarCulturasDto
  ) {
    return this.paisesService.actualizarCulturasDePais(id, agregarCulturasDto.culturaIds);
  }
  
  @Delete(':paisId/culturas/:culturaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async eliminarCultura(
    @Param('paisId', ParseUUIDPipe) paisId: string,
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.paisesService.eliminarCulturaDePais(paisId, culturaId);
    res.status(HttpStatus.NO_CONTENT).send();
  }
}
