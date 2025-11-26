// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { SagasModule } from './sagas/sagas.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Ya no necesitas importar las entidades aquí si usas autoLoadEntities
// import { Libro } from './libros/entities/libro.entity';
// import { Sagas } from './sagas/entities/sagas.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_URL'),
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    LibrosModule,
    SagasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
