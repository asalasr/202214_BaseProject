/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioService } from '../socio/socio.service';
import { SocioEntity } from '../socio/socio.entity';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);

    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    socioList = [];
    for(let i = 0; i < 5; i++){
      const socio: SocioEntity = await repository.save({
        id: "prueba" + i,
        nombre: faker.company.name(),
        email: faker.internet.email(), 
        fechaNacimiento: faker.date.past.toString()})
        socioList.push(socio);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*it('findAll retorna todos los socios', async () => {
    const socios: SocioEntity[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(socioList.length);
  });

  it('findOne should throw an exception for an invalid museum', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });*/


  it('create retorna un nuevo Socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.company.name(), 
      email: faker.internet.email(), 
      fechaNacimiento: faker.date.past.toString(),
      club:null
    }

    const newSocio: SocioEntity = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedClub: SocioEntity = await repository.findOne({ where: { id: newSocio.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newSocio.nombre)
    expect(storedClub.email).toEqual(newSocio.email)
    expect(storedClub.fechaNacimiento).toEqual(newSocio.fechaNacimiento)
  });



  it('findOne retorna un socio por id', async () => {
    const storedSocio: SocioEntity = socioList[0];
    const club: SocioEntity = await service.findOne(storedSocio.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedSocio.nombre)
    expect(club.email).toEqual(storedSocio.email)
    expect(club.fechaNacimiento).toEqual(storedSocio.fechaNacimiento)
  });

  it('update deberia actualizar un socio', async () => {
    const socio: SocioEntity = socioList[0];
    socio.nombre = "nuevo nombre";
    socio.email = "prueba@prueba.com";

    const updatedSocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();

    const storedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.nombre).toEqual(socio.nombre)
    expect(storedSocio.email).toEqual(socio.email)
  });

  it('delete debera eliminar un socio', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);

    const deletedSocio: SocioEntity = await repository.findOne({ where: { id: socio.id } })
    expect(deletedSocio).toBeNull();
  });

  it('update debera dar exception para un socio invalido', async () => {
    let socio: SocioEntity = socioList[0];
    socio = {
      ...socio, nombre: "nuevo nombre", email: "prueba@prueba.com"
    }
    await expect(() => service.update("0", socio)).rejects.toHaveProperty("message", "No se encontro un socio con ese id")
  });

  it('delete debera dar exception para un socio invalido', async () => {
    const socio: SocioEntity = socioList[0];
    await service.delete(socio.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontro un socio con ese id")
  });

});
