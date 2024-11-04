import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cultura } from "../../culturas/entities/cultura.entity";
import { Ciudad } from "../../ciudades/entities/ciudad.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Restaurante {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('text')
    nombre: string;
    
    @Field()
    @Column('numeric')
    estrellas: number;

    @Field()
    @Column('date')
    fechasConsecucionEstrellas: Date;

    @Field(() => [Cultura], { nullable: true })
    @ManyToMany(()=> Cultura, (cultura) => cultura.restaurantes)
    culturas: Cultura[];

    @Field(() => Ciudad, { nullable: true })
    @ManyToOne(() => Ciudad, ciudad => ciudad.restaurantes)
    idCiudad: string;
}
