/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class ClubSocioService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,
     
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>
    ) {}

    //Asociar un socio a un grupo
    async addMemberToClub(socioId: string, clubId: string): Promise<ClubEntity> {

        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID no se encuentra", BusinessError.NOT_FOUND);
      
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socio"]})

        if (!club)
          throw new BusinessLogicException("El club con el ID no se encuentra", BusinessError.NOT_FOUND);
    
        club.socio = [...club.socio, socio];
        return await this.clubRepository.save(club);
      }

    //Obtener los socios de un grupo
    async findMembersFromClub(clubId: string): Promise<SocioEntity[]> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socio"]});
        if (!club)
          throw new BusinessLogicException("El Club con el ID no se encuentra", BusinessError.NOT_FOUND)
       
        return club.socio;
    }

    //Obtener un socio de un grupo
    async findMemberFromClub(clubId: string, socioId: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID no se encuentra", BusinessError.NOT_FOUND)
       
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socio"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID no se encuentra", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socio.find(e => e.id === socio.id);
    
        if (!clubSocio)
          throw new BusinessLogicException("El producto con el ID no esta asociado con un club", BusinessError.PRECONDITION_FAILED)
    
        return clubSocio;
    }

    //Actualizar los socios de un grupo.
    async updateMembersFromClub(clubId: string, socio: SocioEntity[]): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socio"]});
    
        if (!club)
          throw new BusinessLogicException("El club con el ID no se encuentra", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < socio.length; i++) {
          const socios: SocioEntity = await this.socioRepository.findOne({where: {id: socio[i].id}});
          if (!socios)
            throw new BusinessLogicException("El socio con el ID no se encuentra", BusinessError.NOT_FOUND)
        }
    
        club.socio = socio;
        return await this.clubRepository.save(club);
    }

    //Eliminar un socio de un grupo
    async deleteMemberFromClub(clubId: string, socioId: string){
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id: socioId}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID no se encuentra", BusinessError.NOT_FOUND)
    
        const club: ClubEntity = await this.clubRepository.findOne({where: {id: clubId}, relations: ["socio"]});
        if (!club)
          throw new BusinessLogicException("El club con el ID no se encuentra", BusinessError.NOT_FOUND)
    
        const clubSocio: SocioEntity = club.socio.find(e => e.id === socio.id);
    
        if (!clubSocio)
            throw new BusinessLogicException("El producto con el ID no esta asociado con un club", BusinessError.PRECONDITION_FAILED)
    
        club.socio = club.socio.filter(e => e.id !== socioId);
        await this.clubRepository.save(club);
    } 

}
