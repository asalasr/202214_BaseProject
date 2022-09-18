/* eslint-disable prettier/prettier */
import { Controller,UseInterceptors,Delete,Body, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import {ClubSocioService} from '../club-socio/club-socio.service'
import { plainToInstance } from 'class-transformer';

import {SocioDto} from '../socio/socio.dto'
import { SocioEntity } from '../socio/socio.entity';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubSocioController {

    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':club_id/members/:socio_id')
    async addMemberToClub(@Param('club_id') club_id: string, @Param('socio_id') socio_id: string){
        return await this.clubSocioService.addMemberToClub(socio_id, club_id);
    }

    @Get(':club_id/members')
    async findMembersFromClub(@Param('club_id') club_id: string){
        return await this.clubSocioService.findMembersFromClub(club_id);
    }

    @Get(':club_id/members/:socio_id')
    async findMemberFromClub(@Param('club_id') club_id: string, @Param('socio_id') socio_id: string){
        return await this.clubSocioService.findMemberFromClub(club_id, socio_id);
    }

    @Put(':club_id/members')
    async updateMembersFromClub(@Body() socioDto: SocioDto[], @Param('club_id') clubId: string){
       const artworks = plainToInstance(SocioEntity, socioDto)
       return await this.clubSocioService.updateMembersFromClub(clubId, artworks);
   }

    @Delete(':club_id/members/:socio_id')
    @HttpCode(204)
    async deleteMemberFromClub(@Param('club_id') club_id: string, @Param('socio_id') socio_id: string){
        return await this.clubSocioService.deleteMemberFromClub(club_id, socio_id);
    }

}