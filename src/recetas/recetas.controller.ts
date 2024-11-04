import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { RecetasService } from './recetas.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { AgregarProductosDto } from './dto/agregar-productos.dto';
import { EliminarProductoDto } from './dto/eliminar-productos.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';

@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  create(@Body() createRecetaDto: CreateRecetaDto) {
    return this.recetasService.create(createRecetaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findAll() {
    return this.recetasService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.recetasService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRecetaDto: UpdateRecetaDto) {
    return this.recetasService.update( id, updateRecetaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.recetasService.remove(id);
  }

  @Post(':id/productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async agregarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarProductosDto: AgregarProductosDto
  ){
    return this.recetasService.agregarProductosAReceta(id, agregarProductosDto.productoIds);
  }

  @Get(':id/productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Reader, Role.Admin) 
  async obtenerProductos(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.recetasService.obtenerProductosDeReceta(id);
  }

  @Put(':id/productos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Writer, Role.Admin) 
  async actualizarProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() agregarProductosDto: AgregarProductosDto
  ){
    return this.recetasService.actualizarProductosEnReceta(id, agregarProductosDto.productoIds);
  }

  @Delete(':recetaId/productos/:productoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Eliminator, Role.Admin) 
  async eliminarProducto(
    @Param() params: EliminarProductoDto
  ){
    const {recetaId, productoId} = params
    return this.recetasService.eliminarProductoDeReceta(recetaId, productoId);
  }

}
