import { PartialType } from '@nestjs/mapped-types';
import { CreateRestauranteDto } from './create-restaurante.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateRestauranteDto extends PartialType(CreateRestauranteDto) {}
