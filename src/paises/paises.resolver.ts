import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { PaisesService } from './paises.service';
import { Pais } from './entities/pais.entity';
import { CreatePaisDto } from './dto/create-pais.dto';
import { plainToInstance } from 'class-transformer';

@Resolver(() => Pais) // Asegúrate de especificar el tipo de entidad aquí
export class PaisesResolver {
    constructor(private readonly paisesService: PaisesService) {}

    @Query(() => [Pais]) // Cambiar a un arreglo de Pais
    async paises(): Promise<Pais[]> { // Asegúrate de que el retorno sea un Promise<Pais[]>
        return this.paisesService.findAll();
    }

    @Query(() => Pais) // Esta parte está bien
    async pais(@Args('id') id: string): Promise<Pais> {
        return this.paisesService.findOne(id);
    }

    @Mutation(() => Pais)
    createPais(@Args('pais') paisDto: CreatePaisDto): Promise<Pais> {
        const pais = plainToInstance(Pais, paisDto);
        return this.paisesService.create(pais);
    }

    @Mutation(() => Pais)
    updatePais(@Args('id') id: string, @Args('pais') paisDto: CreatePaisDto): Promise<Pais> {
        const pais = plainToInstance(Pais, paisDto);
        return this.paisesService.update(id, pais);
    }

    @Mutation(() => String)
    deletePais(@Args('id') id: string) {
        this.paisesService.remove(id);
        return id;
    }

    
}
