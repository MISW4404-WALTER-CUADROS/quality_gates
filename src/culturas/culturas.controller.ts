import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Res, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { CulturasService } from './culturas.service';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { AgregarPaisesDto } from './dto/agregar-paises.dto';
import { ActualizarProductosDto } from './dto/actualizar-productos.dto';
import { plainToInstance } from 'class-transformer';
import { Producto } from '../productos/entities/producto.entity';
import { Response } from 'express';
import { AgregarRecetasDto } from './dto/agregar-receta.dto';
import { EliminarRecetaDto } from './dto/eliminar-receta.dtos';


import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('culturas')
export class CulturasController {
  constructor(private readonly culturasService: CulturasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin)  
  create(@Body() createCulturaDto: CreateCulturaDto) {
    return this.culturasService.create(createCulturaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  findAll() {
    return this.culturasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.culturasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCulturaDto: UpdateCulturaDto) {
    return this.culturasService.update(id, updateCulturaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async remove(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response): Promise<void> {
    await this.culturasService.remove(id);
    res.status(HttpStatus.NO_CONTENT).send();
  }

  //-----------------------------Paises de una cultura---------------------------------------------------//

  @Post(':id/paises')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarPaises(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarPaisesDto: AgregarPaisesDto
  ){
    return this.culturasService.agregarPaisesACultura(id, agregarPaisesDto.paisIds);
  }

  @Get(':id/paises')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  async obtenerPaises(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.culturasService.obtenerPaisesDecultura(id);
  }

  @Put(':id/paises')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin,)  
  async actualizarPais(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarPaisesDto: AgregarPaisesDto
  ){
    return this.culturasService.actualizarPaisesEnCultura(id, agregarPaisesDto.paisIds);
  }
  
  @Delete(':culturaId/paises/:paisId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  @HttpCode(204)
  async eliminarPais(
    @Param('culturaId', ParseUUIDPipe) culturaId: string,
    @Param('paisId', ParseUUIDPipe) paisId: string,
    @Res() res: Response
  ): Promise<void> {
    await this.culturasService.eliminarPaisDeCultura(culturaId, paisId);
    res.status(HttpStatus.NO_CONTENT).send();
  }


  @Post(':id/paises')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarRestaurantes(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRecetaDto: AgregarRecetasDto
  ){
    return this.culturasService.agregarRecetaACultura(id, agregarRecetaDto.recetasId);
  }

  @Post(':id/recetas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarRecetas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRecetaDto: AgregarRecetasDto
  ){
    return this.culturasService.agregarRecetaACultura(id, agregarRecetaDto.recetasId);
  }

  @Get(':id/recetas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  async obtenerRecetas(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.culturasService.obtenerRecetasDeCultura(id);
  }

  @Put(':id/recetas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async actualizarRecetas(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarRecetasDto: AgregarRecetasDto
  ){
    return this.culturasService.actualizarRecetasEnCultura(id, agregarRecetasDto.recetasId);
  }

  @Delete(':culturaId/recetas/:recetaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async eliminarReceta(
    @Param() params: EliminarRecetaDto
  ){
    const {culturaId, recetaId} = params
    return this.culturasService.eliminarRecetaDeCultura(culturaId, recetaId);
  }

  
  @Post(':culturaId/productos/:productoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin)  
  async agregarProductoAcultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.agregarProductoAcultura(culturaId, productoId);
  }

  @Get(':culturaId/productos/:productoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  async obtenerProductoDeCultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.obtenerProductoDeCultura(culturaId, productoId);
  }

  @Get(':culturaId/productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin, Role.CultureReader) 
  async obtenerTodoLosProductosDeCultura(@Param('culturaId') culturaId: string){
      return await this.culturasService.obtenerTodoLosProductosDeCultura(culturaId);
  }

  @Put(':culturaId/productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async actualizarProductosDeLaCultura(@Param('culturaId') culturaId: string, @Body() actualizarProductosDto: ActualizarProductosDto){
    const productos = plainToInstance(Producto, actualizarProductosDto.productosIds)  
    return await this.culturasService.actualizarProductosDeLaCultura(culturaId, productos);
  }
  
  @Delete(':culturaId/productos/:productoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  @HttpCode(204)
  async eliminarProductoDeCultura(@Param('culturaId') culturaId: string, @Param('productoId') productoId: string){
      return await this.culturasService.eliminarProductoDeCultura(culturaId, productoId);
  }
  


}