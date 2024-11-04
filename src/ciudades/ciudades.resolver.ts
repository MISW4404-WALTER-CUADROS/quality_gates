import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';


@Resolver()
export class CiudadesResolver {

    constructor( private ciudadesService: CiudadesService){}

    @Query(() => [Ciudad])
    ciudades() {
        return this.ciudadesService.findAll();
    }

    @Query(() => Ciudad)
    ciudad(@Args('id') id: string): Promise<Ciudad> {
        return this.ciudadesService.findOne(id);
    }

    @Mutation(() => Ciudad)
    createCiudad(@Args('ciudad') ciudadDto: CreateCiudadDto): Promise<Ciudad> {
       return this.ciudadesService.create(ciudadDto);
    }

    @Mutation(() => Ciudad)
    updateCiudad(@Args('id') id: string, @Args('ciudad') ciudadDto: CreateCiudadDto): Promise<Ciudad> {
       return this.ciudadesService.update(id, ciudadDto);
    }

    @Mutation(() => Ciudad)
    deleteCiudad(@Args('id') id: string) {
       this.ciudadesService.remove(id);
       return id;
    }


//-----------------------------Restaurantes de una ciudad---------------------------------------------------//
    @Mutation(() => Ciudad)
    agregarRestauranteACiudad(@Args('id')  id: string, @Args('restauranteId') restauranteId: string): Promise<Ciudad> {
       return this.ciudadesService.asociarRestauranteACiudad(id, restauranteId);
    }

    @Mutation(() => Ciudad)
    async removeRestauranteDeCiudad(
        @Args('id') id: string,
        @Args('restauranteId') restauranteId: string
    ) {
        return this.ciudadesService.eliminarRestauranteDeCiudad(id, restauranteId);
    }

    @Query(() => [Ciudad], { name: 'getRestaurantesByCiudad' })
    async restaurantesDeCiudad(
        @Args('id') id: string
    ) {
        const ciudad = await this.ciudadesService.findOne(id);
        return ciudad.restaurantes;
    }

}
