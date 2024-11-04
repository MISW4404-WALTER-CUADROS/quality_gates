import { Producto } from '../../productos/entities/producto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Categoria {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;
     
    @Field()
    @Column()
    descripcion: string;
 
    @Field(type => [Producto])
    @OneToMany(() => Producto, producto => producto.categoria)
    productos: Producto[];    
    
}