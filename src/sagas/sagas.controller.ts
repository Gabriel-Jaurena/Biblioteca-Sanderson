import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SagasService } from './sagas.service';
import { CreateSagasDto } from './dto/create-sagas.dto';
import { UpdateSagasDto } from './dto/update-sagas.dto';
import { QuerySagasDto } from './dto/query-sagas-dto';

@Controller('sagas')
export class SagasController {
  constructor(private readonly sagasService: SagasService) {}

  @Post()
  create(@Body() createSagasDto: CreateSagasDto) {
    return this.sagasService.create(createSagasDto);
  }

  @Get()
  findAll(@Query() query: QuerySagasDto) {
    if (Object.keys(query).length) {
      return this.sagasService.filterSagas(query);
    }
    return this.sagasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sagasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSagasDto: UpdateSagasDto) {
    return this.sagasService.update(+id, updateSagasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sagasService.remove(+id);
  }
}
