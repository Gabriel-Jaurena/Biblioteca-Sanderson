/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; // <-- Importa decoradores

@Entity('libros') // <-- Define el nombre de la tabla en la BD
export class Libro {
    @PrimaryGeneratedColumn() // <-- Define 'id' como clave primaria autoincremental
    id: number;

    @Column({ length: 255 }) // <-- Define 'titulo' como columna string con límite
    titulo: string

    @Column() // <-- Define 'autor' como columna string
    autor: string;

    @Column('date') // <-- Define 'fechaEdicion' como columna de tipo fecha
    fechaEdicion: Date;

    @Column('int') // <-- Define 'numeroPaginas' como columna de tipo entero
    numeroPaginas: number;

    @Column('text', { nullable: true }) // <-- Define 'descripcion' como texto largo (opcional)
    descripcion: string;
}