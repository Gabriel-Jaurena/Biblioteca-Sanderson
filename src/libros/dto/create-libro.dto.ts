// src/libros/dto/create-libro.dto.ts
/* eslint-disable prettier/prettier */
export class CreateLibroDto {
  titulo: string
  autor: string;
  fechaEdicion: Date;
  numeroPaginas: number;
  descripcion: string;
}