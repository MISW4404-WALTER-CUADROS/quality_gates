import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriasService } from './categorias.service';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Resolver()
export class CategoriasResolver {
    constructor(private categoriasService: CategoriasService) {}

    @Query(() => [Categoria])
    categorias(): Promise<Categoria[]> {
        return this.categoriasService.findAll();
    }

    @Query(() => Categoria)
    categoria(@Args('id') id: string): Promise<Categoria> {
        return this.categoriasService.findOne(id);
    }


    @Mutation(() => Categoria)
    createCategoria(@Args('categoria') createCategoriaDto: CreateCategoriaDto ): Promise<Categoria> {
        const categoria = plainToInstance(Categoria, createCategoriaDto);
        return this.categoriasService.create(categoria);
    }

    @Mutation(() => Categoria)
    updateCategoria(@Args('id') id: string, @Args('categoria') updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria> {
        const categoria = plainToInstance(Categoria, updateCategoriaDto);
        return this.categoriasService.update(id, categoria);
    }

    @Mutation(() => String)
    deleteCategoria(@Args('id') id: string) {
        this.categoriasService.remove(id);
        return id;
    }
}
