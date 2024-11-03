
import { Cultura } from '../../culturas/entities/cultura.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Receta } from '../../recetas/entities/receta.entity';
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@ObjectType()
@Entity()
export class Producto {

    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Field()
    @Column()
    nombre: string;
    
    @Field()
    @Column()
    descripcion: string;
    
    @Field()
    @Column()
    historia: string;
    
    @Field()
    @ManyToOne(() => Categoria, categoria => categoria.productos)
    categoria: string;

    @Field(type => [Receta])
    @ManyToMany(() => Receta, (receta) => receta.productos)
    recetas: Receta[];

    @Field(type => Cultura)
    @ManyToOne(() => Cultura, cultura => cultura.productos)
    cultura: Cultura; 
 
}