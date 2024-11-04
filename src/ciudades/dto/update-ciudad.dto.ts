import { PartialType } from '@nestjs/mapped-types';
import { CreateCiudadDto } from './create-ciudad.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCiudadDto extends PartialType(CreateCiudadDto) {}
