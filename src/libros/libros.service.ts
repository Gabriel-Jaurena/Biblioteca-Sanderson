// src/libros/libros.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <-- Importa InjectRepository
import { Repository } from 'typeorm'; // <-- Importa Repository y utilidades
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
// Ya no necesitas importar el array 'libros'
// import { libros } from 'src/base-de-datos/libros';
import { Libro } from './entities/libro.entity'; // <-- Tu entidad decorada
import { QueryLibrosDto } from './dto/query-libros-dto';

@Injectable()
export class LibrosService {
  // 1. Inyecta el Repositorio
  constructor(
    @InjectRepository(Libro) // Especifica la entidad
    private librosRepository: Repository<Libro>, // El tipo es Repository<TuEntidad>
  ) {}

  // 2. Adapta los métodos para usar el repositorio (ahora son async)

  // Método para filtrar (ejemplo básico, se puede mejorar con QueryBuilder)
  async filterLibros(query: QueryLibrosDto): Promise<Libro[]> {
    const { titulo, fechaEdicion } = query;

    // Iniciamos el QueryBuilder para la entidad Libro con el alias 'libro'
    const queryBuilder = this.librosRepository.createQueryBuilder('libro');

    // Aplicamos filtro por título si existe (búsqueda parcial insensible a mayúsculas)
    if (titulo) {
      // Usamos 'ILIKE' para PostgreSQL (case-insensitive LIKE)
      // ':titulo' es un parámetro que pasaremos después
      queryBuilder.where('libro.titulo ILIKE :titulo', {
        titulo: `%${titulo}%`,
      });
    }

    // Aplicamos filtro por año si existe
    if (fechaEdicion) {
      // Aseguramos que fechaEdicion sea tratado como número (año)
      const year = Number(fechaEdicion);
      if (!isNaN(year)) {
        // Usamos 'EXTRACT(YEAR FROM fecha_columna)' de SQL para obtener el año
        // ':year' es el parámetro con el valor del año
        // Usamos 'andWhere' para añadir esta condición si ya había una por título
        queryBuilder.andWhere('EXTRACT(YEAR FROM libro.fechaEdicion) = :year', {
          year,
        });
      } else {
        // Opcional: Manejar el caso si fechaEdicion no es un año válido
        console.warn(
          `Valor inválido para fechaEdicion: ${fechaEdicion}. Se ignorará el filtro por año.`,
        );
      }
    }

    // Ejecutamos la consulta construida y retornamos los resultados
    return queryBuilder.getMany();
  }

  async create(createLibroDto: CreateLibroDto): Promise<Libro> {
    const nuevoLibro = this.librosRepository.create(createLibroDto);
    return this.librosRepository.save(nuevoLibro);
  }

  async findAll(): Promise<Libro[]> {
    return this.librosRepository.find();
  }

  async findOne(id: number): Promise<Libro> {
    const libro = await this.librosRepository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    return libro;
  }

  async update(id: number, updateLibroDto: UpdateLibroDto): Promise<Libro> {
    // preload carga la entidad existente y fusiona los nuevos datos
    const libro = await this.librosRepository.preload({
      id: id,
      ...updateLibroDto,
    });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    // save actualiza la entidad en la BD
    return this.librosRepository.save(libro);
  }

  async remove(id: number): Promise<void> {
    // <-- Cambiado para retornar void
    const result = await this.librosRepository.delete(id);
    if (result.affected === 0) {
      // Si no afectó ninguna fila, el libro no existía
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    // No es necesario retornar nada en un DELETE exitoso
  }
}
