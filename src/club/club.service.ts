/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class ClubService {

    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>,

    ){}

    async findAll(): Promise<ClubEntity[]> {

        return await this.clubRepository.find({ relations: ["socio"] });
       
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["socio"] } );
        if (!club)
          throw new BusinessLogicException("El club con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
   
        return club;
    }

    async create(club: ClubEntity): Promise<ClubEntity> {

        if (club.descripcion.length > 100)
            throw new BusinessLogicException("La descripcion supera 100 caracteres", BusinessError.PRECONDITION_FAILED);

        return await this.clubRepository.save(club);
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {

        if (club.descripcion.length > 100)
            throw new BusinessLogicException("La descripcion supera 100 caracteres", BusinessError.PRECONDITION_FAILED);
            
        const persistedSocio: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new BusinessLogicException("El club con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
       
        club.id = id; 
        
        return await this.clubRepository.save(club);
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("El club con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
     
        await this.clubRepository.remove(club);
    }

}
