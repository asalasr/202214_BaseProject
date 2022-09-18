/* eslint-disable prettier/prettier */
import { Controller,UseInterceptors,Body,Delete, Get, HttpCode, Param, Post, Put   } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {SocioService} from '../socio/socio.service'
import {BusinessErrorsInterceptor} from '../shared/interceptors/business-errors.interceptor'
import {SocioDto} from '../socio/socio.dto'
import { SocioEntity } from '../socio/socio.entity';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class SocioController {

    constructor(private readonly socioService: SocioService) {}

    @Get()
    async findAll() {
        return await this.socioService.findAll();
    }

    @Get(':socio_id')
    async findOne(@Param('socio_id') socioId: string) {
        return await this.socioService.findOne(socioId);
    }

    @Post()
    async create(@Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.create(socio);
    }

    @Put(':socio_id')
    async update(@Param('socio_id') socioId: string, @Body() socioDto: SocioDto) {
        const socio: SocioEntity = plainToInstance(SocioEntity, socioDto);
        return await this.socioService.update(socioId, socio);
    }

    @Delete(':socio_id')
    @HttpCode(204)
    async delete(@Param('socio_id') socioId: string) {
        return await this.socioService.delete(socioId);
    }


}
