// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { SagasModule } from './sagas/sagas.module';
// Ya no necesitas importar las entidades aquí si usas autoLoadEntities
// import { Libro } from './libros/entities/libro.entity';
// import { Sagas } from './sagas/entities/sagas.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'sanderson',
      password: '123456789', // ¡Recuerda cambiarla!
      database: 'cosmere',

      // --- Cambios aquí ---
      // Quita la línea 'entities: [Libro, Sagas],'
      // entities: [Libro, Sagas],
      // Y añade esta línea:
      autoLoadEntities: true,
      // --- Fin Cambios ---

      synchronize: true, // ¡Solo para desarrollo!
    }),
    LibrosModule,
    SagasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
