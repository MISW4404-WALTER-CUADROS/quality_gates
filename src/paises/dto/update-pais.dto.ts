import { PartialType } from '@nestjs/mapped-types';
import { CreatePaisDto } from './create-pais.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePaisDto extends PartialType(CreatePaisDto) {}
