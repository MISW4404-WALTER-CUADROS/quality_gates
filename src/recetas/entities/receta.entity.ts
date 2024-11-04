import { Cultura } from "../../culturas/entities/cultura.entity";
import { Producto } from '../../productos/entities/producto.entity'; 
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Receta {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column('text')
    nombre: string;

    @Field()
    @Column('text')
    descripcion: string;

    @Field()
    @Column('text')
    foto: string;

    @Field()
    @Column('text')
    proceso: string;

    @Field()
    @Column('text')
    video: string;


    @Field(() => Cultura)
    @ManyToOne(() => Cultura, (cultura) => cultura.recetas, { onDelete: 'CASCADE' })
    cultura: Cultura;

    @Field(() => [Producto])
    @ManyToMany(() => Producto, (producto) => producto.recetas)
    @JoinTable() 
    productos: Producto[];
}
