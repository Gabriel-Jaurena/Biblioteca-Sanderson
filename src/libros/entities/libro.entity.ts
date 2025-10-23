// src/libros/entities/libro.entity.ts
/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'; // <-- Cambia imports
import { Sagas } from '../../sagas/entities/sagas.entity';

@Entity('libros')
export class Libro {
    // --- Clave Primaria Compuesta ---
    @PrimaryColumn('int') // Columna parte de la PK, tipo entero
    sagaId: number;

    @PrimaryColumn('int') // Segunda columna parte de la PK, tipo entero
    libroNumero: number; // Este número lo generarás tú (1, 2, 3...)

    // --- Relación ManyToOne con Sagas ---
    @ManyToOne(() => Sagas, (saga) => saga.libros, {
        nullable: false, // Un libro DEBE pertenecer a una saga
        onDelete: 'CASCADE' // Opcional: Si se borra la saga, se borran sus libros
    })
    @JoinColumn({ name: 'sagaId' }) // Especifica que sagaId es la FK
    saga: Sagas;
    // --- Fin Relación ---

    @Column({ length: 255 })
    titulo: string

    @Column()
    autor: string;

    @Column('date')
    fechaEdicion: Date;

    @Column('int')
    numeroPaginas: number;

    @Column('text', { nullable: true })
    descripcion: string;
}