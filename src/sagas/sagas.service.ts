import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSagasDto } from './dto/create-sagas.dto';
import { UpdateSagasDto } from './dto/update-sagas.dto';
import { Sagas } from './entities/sagas.entity';
import { sagas } from 'src/base-de-datos/sagas';
import { QuerySagasDto } from './dto/query-sagas-dto';
import { libros } from 'src/base-de-datos/libros';

@Injectable()
export class SagasService {
  // Método para filtrar sagas según los criterios proporcionados
  filterSagas(query: QuerySagasDto) {
    const { nombre, libroTitulo } = query;
    const filteredSagas = sagas.filter((saga) => {
      let matches = true;

      // Filtrar por nombre de la saga
      if (nombre) {
        matches =
          matches && saga.nombre.toUpperCase().includes(nombre.toUpperCase());
      }

      // Filtrar por título de libro contenido en la saga
      if (libroTitulo) {
        const sagaContainsBook = saga.libros.some((libroId) => {
          const libro = libros.find((l) => l.id === libroId);
          return libro
            ? libro.titulo.toUpperCase().includes(libroTitulo.toUpperCase())
            : false;
        });
        matches = matches && sagaContainsBook;
      }
      return matches;
    });
    return filteredSagas;
  }

  create(createSagasDto: CreateSagasDto) {
    const sagasEntity: Sagas = { ...createSagasDto };
    const findIndex = sagas.findIndex((sagas) => sagas.id === sagasEntity.id);
    if (findIndex !== -1) {
      throw new ConflictException('Sagas with this ID already exists');
    }
    sagas.push(sagasEntity);
    return sagasEntity;
  }

  findAll() {
    return sagas;
  }

  findOne(id: number) {
    const saga = sagas.find((sagas) => sagas.id === id);
    if (!saga) {
      throw new NotFoundException(`Saga with ID ${id} not found`);
    }
    return `This action returns a sagas: ${JSON.stringify(saga)}`;
  }

  update(id: number, updateSagasDto: UpdateSagasDto) {
    const sagasIndex = sagas.findIndex((sagas) => sagas.id === id);
    if (sagasIndex === -1) {
      throw new NotFoundException(`Saga with ID ${id} not found`);
    }
    const updatedSagas = { ...sagas[sagasIndex], ...updateSagasDto };
    sagas[sagasIndex] = updatedSagas;
    return `This action updates a ${JSON.stringify(updatedSagas)} sagas`;
  }

  remove(id: number) {
    const sagasIndex = sagas.findIndex((sagas) => sagas.id === id);
    if (sagasIndex === -1) {
      throw new NotFoundException(`Saga with ID ${id} not found`);
    }
    sagas.splice(sagasIndex, 1);
    return `This action removes a #${sagasIndex} sagas`;
  }
}
