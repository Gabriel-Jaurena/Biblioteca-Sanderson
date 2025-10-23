import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe, // Opcional pero recomendado para validar IDs numéricos
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { QueryLibrosDto } from './dto/query-libros-dto';
import { Libro } from './entities/libro.entity';
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Post()
  async create(@Body() createLibroDto: CreateLibroDto): Promise<Libro> {
    return await this.librosService.create(createLibroDto);
  }

  @Get()
  async findAll(@Query() query: QueryLibrosDto): Promise<Libro[]> {
    if (Object.keys(query).length) {
      return await this.librosService.filterLibros(query);
    }
    return await this.librosService.findAll();
  }

  @Get(':sagaId/:libroNumero')
  async findOne(
    @Param('sagaId', ParseIntPipe) sagaId: number,
    @Param('libroNumero', ParseIntPipe) libroNumero: number,
  ): Promise<Libro> {
    return await this.librosService.findOne(sagaId, libroNumero);
  }

  @Patch(':sagaId/:libroNumero')
  async update(
    @Param('sagaId', ParseIntPipe) sagaId: number,
    @Param('libroNumero', ParseIntPipe) libroNumero: number,
    @Body() updateLibroDto: UpdateLibroDto,
  ): Promise<Libro> {
    return await this.librosService.update(sagaId, libroNumero, updateLibroDto);
  }

  @Delete(':sagaId/:libroNumero')
  async remove(
    @Param('sagaId', ParseIntPipe) sagaId: number,
    @Param('libroNumero', ParseIntPipe) libroNumero: number,
  ): Promise<void> {
    await this.librosService.remove(sagaId, libroNumero);
  }
}
