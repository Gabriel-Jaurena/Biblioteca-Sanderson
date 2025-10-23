import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { SagasModule } from './sagas/sagas.module';

@Module({
  imports: [LibrosModule, SagasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
