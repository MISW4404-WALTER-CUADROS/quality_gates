import { Entity,ManyToMany, OneToMany, Column, PrimaryGeneratedColumn } from "typeorm";
import { Ciudad } from "../../ciudades/entities/ciudad.entity";
import { Cultura } from "../../culturas/entities/cultura.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Pais {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('text')
    nombre: string;

    @Field(() => [Ciudad], { nullable: true })
    @OneToMany(() => Ciudad, ciudad => ciudad.idPais)
    ciudades: Ciudad[];

    @Field(() => [Cultura], { nullable: true })
    @ManyToMany(() => Cultura, cultura => cultura.paises)
    culturas: Cultura[];
}
