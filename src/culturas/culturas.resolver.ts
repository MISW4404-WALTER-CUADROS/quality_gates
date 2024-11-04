import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CulturasService } from './culturas.service';
import { Cultura } from './entities/cultura.entity';
import { CreateCulturaDto } from './dto/create-cultura.dto';
import { UpdateCulturaDto } from './dto/update-cultura.dto';
import { Receta } from '../recetas/entities/receta.entity'; 

@Resolver(() => Cultura)
export class CulturasResolver {
    constructor(private readonly culturaService: CulturasService) {}

    @Query(() => [Cultura])
    culturas() {
        return this.culturaService.findAll();
    }

    @Query(() => Cultura)
    cultura(@Args('id') id: string) {
        return this.culturaService.findOne(id);
    }
    
    @Mutation(() => Cultura)
    createCultura(@Args('createCulturaDto') createCulturaDto: CreateCulturaDto) {
        return this.culturaService.create(createCulturaDto);
    }

    @Mutation(() => Cultura)
    async updateCultura( @Args('id') id: string, @Args('updateCulturaDto') updateCulturaDto: UpdateCulturaDto,): Promise<Cultura> {
        return this.culturaService.update(id, updateCulturaDto);
    }

    @Mutation(() => Boolean)
    async removeCultura(@Args('id') id: string) {
        await this.culturaService.remove(id);
        return true;
    }

//-----------------------------Recetas de una cultura---------------------------------------------------//
    @Mutation(() => Cultura)
    agregarRecetasACultura(@Args('id')  id: string, @Args('recetasId', { type: () => [String] }) recetasId: string[]): Promise<Cultura> {
       return this.culturaService.agregarRecetaACultura(id, recetasId);
    }

    @Mutation(() => Cultura)
    async updateRecetaEnCulturas(
        @Args('id') id: string,
        @Args('recetasId', { type: () => [String] }) recetasId: string[]
    ): Promise<Cultura> {
        return this.culturaService.actualizarRecetasEnCultura(id, recetasId);
    }

    @Mutation(() => Cultura)
    async removeRecetaFromCultura(
        @Args('culturaId') culturaId: string,
        @Args('recetaId') recetaId: string
    ) {
        return this.culturaService.eliminarRecetaDeCultura(culturaId, recetaId);
    }

    @Query(() => [Receta], { name: 'getRecetasByCultura' })
    async recetasDeCultura(
        @Args('culturaId') culturaId: string
    ): Promise<Receta[]> {
        const cultura = await this.culturaService.findOne(culturaId);
        return cultura.recetas;
    }

    @Query(() => Receta, { name: 'getRecetaByCultura' })
    async productoDeReceta(
        @Args('culturaId') culturaId: string,
        @Args('recetaId') recetaId: string
    ): Promise<Receta> {
        const cultura = await this.culturaService.findOne(culturaId);
        return cultura.recetas.find(p => p.id === recetaId);
    }

    //-----------------------------Paises de una cultura---------------------------------------------------//

    @Mutation(() => Cultura)
    agregarPaisesACultura(@Args('id')  id: string, @Args('paisesId', { type: () => [String] }) paisesId: string[]): Promise<Cultura> {
       return this.culturaService.agregarPaisesACultura(id, paisesId);
    }

    @Mutation(() => Cultura)
    async updatePaisesEnCulturas(@Args('id') id: string, @Args('paisesId', { type: () => [String] }) paisesId: string[]): Promise<Cultura> {
        return this.culturaService.actualizarPaisesEnCultura(id, paisesId);
    }

    @Mutation(() => Cultura)
    async removePaisesFromCultura(@Args('culturaId') culturaId: string,@Args('paisesId') paisesId: string) {
        return this.culturaService.eliminarPaisDeCultura(culturaId, paisesId);
    }

    @Query(() => Cultura, { name: 'obtenerPaisesDeCultura' })
    async obtenerPaisesDeCultura(@Args('culturaId') culturaId: string): Promise<Cultura> {
        const cultura = await this.culturaService.findOne(culturaId);
        return cultura;
    }

    //-----------------------------Restaurantes de una cultura---------------------------------------------------//

    @Mutation(() => Cultura)
    agregarRestaurantesACultura(@Args('id')  id: string, @Args('restaurantesId', { type: () => [String] }) restaurantesId: string[]): Promise<Cultura> {
       return this.culturaService.agregarRestaurantesACultura(id, restaurantesId);
    }

    @Mutation(() => Cultura)
    async updateRestaurantesEnCulturas(@Args('id') id: string, @Args('restaurantesId', { type: () => [String] }) restaurantesId: string[]): Promise<Cultura> {
        return this.culturaService.actualizarRestaurantesEnCultura(id, restaurantesId);
    }

    @Mutation(() => Cultura)
    async removeRestaurantesFromCultura(@Args('culturaId') culturaId: string,@Args('restauranteId') restauranteId: string) {
        return this.culturaService.eliminarRestauranteDeCultura(culturaId, restauranteId);
    }

    @Query(() => Cultura, { name: 'obtenerRestaurantesDeCultura' })
    async obtenerRestaurantesDeCultura(@Args('culturaId') culturaId: string): Promise<Cultura> {
        const cultura = await this.culturaService.findOne(culturaId);
        return cultura; 
    }

}
