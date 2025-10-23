// src/libros/libros.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <-- Importa InjectRepository
import { Repository } from 'typeorm'; // <-- Importa Repository y utilidades
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
// Ya no necesitas importar el array 'libros'
// import { libros } from 'src/base-de-datos/libros';
import { Libro } from './entities/libro.entity'; // <-- Tu entidad decorada
import { QueryLibrosDto } from './dto/query-libros-dto';
import { Sagas } from 'src/sagas/entities/sagas.entity';

@Injectable()
export class LibrosService {
  // Repositorios inyectados (Libro y Sagas)
  constructor(
    @InjectRepository(Libro) // Especifica la entidad
    private librosRepository: Repository<Libro>, // El tipo es Repository<TuEntidad>
    @InjectRepository(Sagas) // Especifica la entidad Sagas
    private sagasRepository: Repository<Sagas>, // Reemplaza 'any' con Repository<Sagas>
  ) {}

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
    const { sagaId, ...libroData } = createLibroDto;

    // 1. Validar que la saga exista
    // Usa 'as Sagas | null' para forzar el tipo y evitar el error de ESLint
    const saga = await this.sagasRepository.findOneBy({
      id: sagaId,
    });
    if (!saga) {
      throw new NotFoundException(`Saga con ID ${sagaId} no encontrada.`);
    }
    // 2. Calcular el siguiente libroNumero para esa saga
    const ultimoLibro = await this.librosRepository.findOne({
      where: { sagaId: sagaId },
      order: { libroNumero: 'DESC' }, // Ordena descendente por libroNumero
    });

    const proximoLibroNumero = ultimoLibro ? ultimoLibro.libroNumero + 1 : 1;

    // 3. Crear la entidad Libro con los IDs compuestos y los datos
    const nuevoLibro = this.librosRepository.create({
      ...libroData,
      sagaId: sagaId, // Asigna la parte sagaId de la PK
      libroNumero: proximoLibroNumero, // Asigna la parte libroNumero CALCULADA
    });

    // 4. Guardar en la base de datos
    try {
      return await this.librosRepository.save(nuevoLibro);
    } catch (error) {
      // Manejo básico de errores (ej. race condition si dos requests calculan el mismo número)
      console.error('Error al guardar el libro:', error);
      // Podrías verificar si el error es por PK duplicada y reintentar
      throw new InternalServerErrorException('Error al crear el libro.');
    }
  }

  async findAll(): Promise<Libro[]> {
    return this.librosRepository.find();
  }

  async findOne(sagaId: number, libroNumero: number): Promise<Libro> {
    // Busca usando AMBAS partes de la clave primaria
    const libro = await this.librosRepository.findOneBy({
      sagaId,
      libroNumero,
    });
    if (!libro) {
      // Mensaje de error más claro
      throw new NotFoundException(
        `Libro ${sagaId}-${libroNumero} no encontrado`,
      );
    }
    return libro;
  }

  async update(
    sagaId: number,
    libroNumero: number,
    updateLibroDto: UpdateLibroDto,
  ): Promise<Libro> {
    // preload también necesita AMBAS partes de la clave
    const libro = await this.librosRepository.preload({
      sagaId: sagaId,
      libroNumero: libroNumero,
      ...updateLibroDto,
    });
    if (!libro) {
      throw new NotFoundException(
        `Libro ${sagaId}-${libroNumero} no encontrado`,
      );
    }
    return this.librosRepository.save(libro);
  }

  async remove(sagaId: number, libroNumero: number): Promise<void> {
    // delete también necesita AMBAS partes de la clave
    const result = await this.librosRepository.delete({ sagaId, libroNumero });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Libro ${sagaId}-${libroNumero} no encontrado`,
      );
    }
  }
}
