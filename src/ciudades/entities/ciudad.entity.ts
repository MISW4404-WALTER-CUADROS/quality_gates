import { Restaurante } from '../../restaurantes/entities/restaurante.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pais } from '../../paises/entities/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Ciudad {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('text')
    nombre: string;

    @Field(() => [Restaurante], { nullable: true })
    @OneToMany(() => Restaurante   , restaurante => restaurante.idCiudad)   
    restaurantes: Restaurante[];

    @Field(() => [Pais], { nullable: true })
    @ManyToOne(() => Pais, pais => pais.ciudades)
    idPais: string;
}
