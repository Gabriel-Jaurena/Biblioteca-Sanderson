import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { libros } from 'src/base-de-datos/libros';
import { Libro } from './entities/libro.entity';
import { QueryLibrosDto } from './dto/query-libros-dto';

@Injectable()
export class LibrosService {
  // Método para filtrar libros según los criterios proporcionados en QueryLibrosDto
  filterLibros(query: QueryLibrosDto) {
    const { titulo, fechaEdicion } = query;
    const filteredLibros = libros.filter((libro) => {
      let matches = true;
      if (titulo) {
        matches =
          matches && libro.titulo.toUpperCase().includes(titulo.toUpperCase());
      }
      if (fechaEdicion) {
        matches =
          matches &&
          libro.fechaEdicion.toString().split('-')[0] ===
            fechaEdicion.toString();
      }
      return matches;
    });
    return filteredLibros;
  }

  create(createLibroDto: CreateLibroDto) {
    const libroEntity: Libro = { ...createLibroDto };
    const findindex = libros.findIndex((libro) => libro.id === libroEntity.id); // Verifica si el libro ya existe
    if (findindex !== -1) {
      throw new ConflictException('Libro with this ID already exists');
    }
    libros.push(libroEntity); // Agrega el nuevo libro a la "base de datos"
    return libroEntity;
  }

  findAll() {
    return libros;
  }

  findOne(id: number) {
    const libro = libros.find((libro) => libro.id === id);
    if (!libro) {
      throw new NotFoundException(`Libro with ID ${id} not found`);
    }
    return libro;
  }

  update(id: number, updateLibroDto: UpdateLibroDto) {
    const libroIndex = libros.findIndex((libro) => libro.id === id);
    if (libroIndex === -1) {
      throw new NotFoundException(`Libro with ID ${id} not found`);
    }
    const updatedLibro = { ...libros[libroIndex], ...updateLibroDto };
    libros[libroIndex] = updatedLibro;
    return updatedLibro;
  }

  remove(id: number) {
    const libroIndex = libros.findIndex((libro) => libro.id === id);
    if (libroIndex === -1) {
      throw new NotFoundException(`Libro with ID ${id} not found`);
    }
    libros.splice(libroIndex, 1);
    return `This action removes a #${libroIndex} libro`;
  }
}
