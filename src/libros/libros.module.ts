// src/libros/libros.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Importa TypeOrmModule
import { LibrosService } from './libros.service';
import { LibrosController } from './libros.controller';
import { Libro } from './entities/libro.entity'; // <-- Importa tu entidad

@Module({
  imports: [
    TypeOrmModule.forFeature([Libro]), // <-- Registra la entidad aquí
  ],
  controllers: [LibrosController],
  providers: [LibrosService],
})
// eslint-disable-next-line prettier/prettier
export class LibrosModule {}