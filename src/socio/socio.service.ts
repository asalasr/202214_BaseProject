/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SocioEntity } from './socio.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

    constructor(
        @InjectRepository(SocioEntity)
        private readonly socioRepository: Repository<SocioEntity>,

    ){}

    async findAll(): Promise<SocioEntity[]> {

        return await this.socioRepository.find({ relations: ["club"] });
       
    }

    async findOne(id: string): Promise<SocioEntity> {
        const socio: SocioEntity = await this.socioRepository.findOne({where: {id}, relations: ["club"] } );
        if (!socio)
          throw new BusinessLogicException("El socio con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
   
        return socio;
    }

    async create(socio: SocioEntity): Promise<SocioEntity> {
        
        if (!socio.email.includes('@'))
            throw new BusinessLogicException("El email no es valido", BusinessError.PRECONDITION_FAILED);
        
        
        return await this.socioRepository.save(socio);
    }

    async update(id: string, socio: SocioEntity): Promise<SocioEntity> {

        if (!socio.email.includes('@'))
            throw new BusinessLogicException("El email no es valido", BusinessError.PRECONDITION_FAILED);

        const persistedSocio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!persistedSocio)
          throw new BusinessLogicException("El socio con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
       
        socio.id = id; 

        return await this.socioRepository.save(socio);
    }

    async delete(id: string) {
        const socio: SocioEntity = await this.socioRepository.findOne({where:{id}});
        if (!socio)
          throw new BusinessLogicException("El socio con el ID ingresado no se encuentra", BusinessError.NOT_FOUND);
     
        await this.socioRepository.remove(socio);
    }

}
