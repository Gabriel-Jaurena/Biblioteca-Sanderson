import { Module } from '@nestjs/common';
import { SagasService } from './sagas.service';
import { SagasController } from './sagas.controller';

@Module({
  controllers: [SagasController],
  providers: [SagasService],
})
export class SagasModule {}
