import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RestaurantesService } from './restaurantes.service';
import { Restaurante } from './entities/restaurante.entity';
import { CreateRestauranteDto } from './dto/create-restaurante.dto';
import { plainToInstance } from 'class-transformer';


@Resolver(() => Restaurante)
export class RestaurantesResolver {
    constructor(private readonly restaurantesService: RestaurantesService) {}

    @Query(() => [Restaurante])
    restaurantes() {
        return this.restaurantesService.findAll();
    }

    @Query(() => Restaurante)
    restaurante(id: string) {
        return this.restaurantesService.findOne(id);
    }

    @Mutation(() => Restaurante)
    async createRestaurante(@Args('restaurante') restauranteDto: CreateRestauranteDto): Promise<Restaurante> {
        const restaurante = plainToInstance(Restaurante, restauranteDto);
        return await this.restaurantesService.create(restaurante);
    }

    @Mutation(() => Restaurante)
    updateRestaurante(@Args('id') id: string, @Args('restaurante') restauranteDto: CreateRestauranteDto): Promise<Restaurante> {
        const restaurante = plainToInstance(Restaurante, restauranteDto);
        return this.restaurantesService.update(id, restaurante);
    }

    @Mutation(() => String)
    deleteRestaurante(@Args('id') id: string) {
        this.restaurantesService.remove(id);
        return id;
    }


}
