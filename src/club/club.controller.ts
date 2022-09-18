/* eslint-disable prettier/prettier */
import { Controller,UseInterceptors,Body,Delete, Get, HttpCode, Param, Post, Put   } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClubService} from '../club/club.service'
import { BusinessErrorsInterceptor} from '../shared/interceptors/business-errors.interceptor'
import { ClubDto} from '../club/club.dto'
import { ClubEntity } from '../club/club.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {

    constructor(private readonly clubService: ClubService) {}

    @Get()
    async findAll() {
        return await this.clubService.findAll();
    }

    @Get(':club_id')
    async findOne(@Param('club_id') clubId: string) {
        return await this.clubService.findOne(clubId);
    }

    @Post()
    async create(@Body() clubDto: ClubDto) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.create(club);
    }

    @Put(':club_id')
    async update(@Param('club_id') clubId: string, @Body() clubDto: ClubDto) {
        const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
        return await this.clubService.update(clubId, club);
    }

    @Delete(':club_id')
    @HttpCode(204)
    async delete(@Param('club_id') clubId: string) {
        return await this.clubService.delete(clubId);
    }


}
