// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <-- Importa TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { SagasModule } from './sagas/sagas.module';
// Asegúrate de importar tu entidad Libro
import { Libro } from './libros/entities/libro.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // O el host donde corre tu Docker si es diferente
      port: 5432,
      // Usa las credenciales de tu docker-compose.yml
      username: 'sanderson', // Tu usuario Postgres
      password: '123456789', // Tu contraseña Postgres (¡cámbiala!)
      database: 'cosmere', // Tu nombre de BD Postgres

      entities: [Libro], // <-- Añade tu entidad aquí directamente

      // ¡SOLO PARA DESARROLLO!
      // Sincroniza el esquema de la BD. Desactívalo en producción.
      synchronize: true,
    }),
    LibrosModule,
    SagasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
