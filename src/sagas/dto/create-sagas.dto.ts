export class CreateSagasDto {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  era: string;
  libros: number[]; // Array de IDs de libros asociados a la saga
}
