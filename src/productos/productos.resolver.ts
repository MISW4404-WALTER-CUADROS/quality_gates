import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { Producto } from './entities/producto.entity';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Resolver()
export class ProductosResolver {
    constructor(private productosService: ProductosService) {}

    @Query(() => [Producto])
    productos(): Promise<Producto[]> {
        return this.productosService.findAll();
    }

    @Query(() => Producto)
    producto(@Args('id') id: string): Promise<Producto> {
        return this.productosService.findOne(id);
    }

    @Mutation(() => Producto)
    createProducto(@Args('producto') createProductoDto: CreateProductoDto ): Promise<Producto> {
        const producto = plainToInstance(Producto, createProductoDto);
        return this.productosService.create(producto);
    }

    @Mutation(() => Producto)
    updateProducto(@Args('id') id: string, @Args('producto') updateProductoDto: UpdateProductoDto): Promise<Producto> {
        const producto = plainToInstance(Producto, updateProductoDto);
        return this.productosService.update(id, producto);
    }

    @Mutation(() => String)
    deleteProducto(@Args('id') id: string) {
        this.productosService.remove(id);
        return id;
    }

    //Asociaciones de categoria producto
    
    @Query(() => Producto)
    categoriaDeProducto(@Args('id') id: string): Promise<Producto> {
        return this.productosService.obtenerCategoriaDeProducto(id);
    }

    @Mutation(() => Producto)
    agregarCategoriaAProducto(@Args('productoId') productoId: string,@Args('productoId') categoriaId: string): Promise<Producto> {
        return this.productosService.agregarCategoriaAProducto(productoId,categoriaId);
    }

    @Mutation(() => Producto)
    actualizarCategoriaEnProductos(@Args('productoId') productoId: string,@Args('productoId') categoriaId: string): Promise<Producto> {
        return this.productosService.actualizarCategoriaEnProductos(productoId, categoriaId);
    }

    @Mutation(() => String)
    eliminarCategoriaDeProducto(@Args('productoId') productoId: string) {
        this.productosService.eliminarCategoriaDeProducto(productoId);
        return productoId;
    }
    

}
