import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { RecetasService } from './recetas.service';
import { Receta } from './entities/receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { plainToInstance } from 'class-transformer';
import { Producto } from '../productos/entities/producto.entity';


@Resolver()
export class RecetasResolver {
    constructor( private recetasService: RecetasService){}

    @Query(() => [Receta])
    recetas() {
        return this.recetasService.findAll();
    }

    @Query(() => Receta)
    receta(@Args('id') id: string): Promise<Receta> {
        return this.recetasService.findOne(id);
    }

    @Mutation(() => Receta)
    createReceta(@Args('receta') recetaDto: CreateRecetaDto): Promise<Receta> {
       const receta = plainToInstance(Receta, recetaDto);
       return this.recetasService.create(receta);
    }

    @Mutation(() => Receta)
    updateReceta(@Args('id') id: string, @Args('receta') recetaDto: CreateRecetaDto): Promise<Receta> {
       const receta = plainToInstance(Receta, CreateRecetaDto);
       return this.recetasService.update(id, receta);
    }

    @Mutation(() => String)
    deleteReceta(@Args('id') id: string) {
       this.recetasService.remove(id);
       return id;
    }

    @Mutation(() => Receta)
    agregarProductoAReceta(@Args('id')  id: string, @Args('productosIds', { type: () => [String] }) productosIds: string[]): Promise<Receta> {
       return this.recetasService.agregarProductosAReceta(id, productosIds);
    }

    @Mutation(() => Receta)
    async updateProductosEnReceta(
        @Args('id') id: string,
        @Args('productosIds', { type: () => [String] }) productosIds: string[]
    ): Promise<Receta> {
        return this.recetasService.actualizarProductosEnReceta(id, productosIds);
    }

    @Mutation(() => Receta)
    async removeProductoFromReceta(
        @Args('recetaId') recetaId: string,
        @Args('productoId') productoId: string
    ) {
        return this.recetasService.eliminarProductoDeReceta(recetaId, productoId);
    }

    @Query(() => [Producto], { name: 'getProductosByReceta' })
    async productosDeReceta(
        @Args('recetaId') recetaId: string
    ): Promise<Producto[]> {
        const receta = await this.recetasService.findOne(recetaId);
        return receta.productos;
    }

    @Query(() => Producto, { name: 'getProductoByReceta' })
    async productoDeReceta(
        @Args('recetaId') recetaId: string,
        @Args('productoId') productoId: string
    ): Promise<Producto> {
        const receta = await this.recetasService.findOne(recetaId);
        return receta.productos.find(p => p.id === productoId);
    }
}
