/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from '../club/club.entity';
import { SocioEntity } from '../socio/socio.entity';

import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;

  let club: ClubEntity;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);

    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    socioRepository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    socioList = [];
    for (let i = 0; i < 3; i++) {
      const socio: SocioEntity = await socioRepository.save({
        id: "prueba" + i,
        nombre: faker.company.name(),
        email: faker.internet.email(), 
        fechaNacimiento: faker.date.past.toString()
      })
      socioList.push(socio);
    }
    club = await clubRepository.save({
      id: "prueba",
      nombre: faker.company.name(), 
      fechaFundacion: faker.date.past.toString(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socio: socioList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub deberia asociar un socio a un club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      id: faker.lorem.word(),
      nombre: faker.company.name(),
      email: faker.internet.email(), 
      fechaNacimiento: faker.date.past.toString()
    });

    const newClub: ClubEntity = await clubRepository.save({
      id: "PRUEBA 1",
      nombre: faker.company.name(), 
      fechaFundacion: faker.date.past.toString(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence()
    })

    const result: ClubEntity = await service.addMemberToClub(newSocio.id,newClub.id);
    
    expect(result.socio.length).toBe(1);
    expect(result.socio[0]).not.toBeNull();
    expect(result.socio[0].id).toBe(newSocio.id)
    expect(result.socio[0].nombre).toBe(newSocio.nombre)
    expect(result.socio[0].email).toBe(newSocio.email)
    expect(result.socio[0].fechaNacimiento).toBe(newSocio.fechaNacimiento)
  });

  it('addMemberToClub debera dar exception para un socio invalido', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      id: "PRUEBA 2",
      nombre: faker.company.name(), 
      fechaFundacion: faker.date.past.toString(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence()
    })
    await expect(() => service.addMemberToClub("0",newClub.id)).rejects.toHaveProperty("message", "No se encontro un socio con ese id");
  });

  it('addMemberToClub debera dar exception para un club invalido', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      id: faker.lorem.word(),
      nombre: faker.company.name(),
      email: faker.internet.email(), 
      fechaNacimiento: faker.date.past.toString()
    });

    await expect(() => service.addMemberToClub(newSocio.id,"0")).rejects.toHaveProperty("message", "No se encontro un club con ese id");
  });

  it('findMembersFromClub debera retornar los socios de un club', async ()=>{
    const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
    expect(socios.length).toBe(3)
  });

  it('findMemberFromClub should return product by cultura', async () => {
    const socio: SocioEntity = socioList[0];
    const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id)
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.id).toBe(socio.id);
    expect(storedSocio.nombre).toBe(socio.nombre);
    expect(storedSocio.email).toBe(socio.email);
    expect(storedSocio.fechaNacimiento).toBe(socio.fechaNacimiento);
  });

  it('updateMembersFromClub debera actualizar los socios de un club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      id: "PRUEBA3",
      nombre: faker.company.name(),
      email: faker.internet.email(), 
      fechaNacimiento: faker.date.past.toString()
    });

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
    expect(updatedClub.socio.length).toBe(1);

    expect(updatedClub.socio[0].nombre).toBe(newSocio.nombre);
    expect(updatedClub.socio[0].email).toBe(newSocio.email);
    expect(updatedClub.socio[0].fechaNacimiento).toBe(newSocio.fechaNacimiento);
    expect(updatedClub.socio[0].id).toBe(newSocio.id);
  });

  it('deleteMemberFromClub debera remover un socio de un club', async () => {
    const socio: SocioEntity = socioList[0];
    
    await service.deleteMemberFromClub(club.id, socio.id);

    const storedClub: ClubEntity = await clubRepository.findOne({where: {id: club.id}, relations: ["socio"]});
    const deletedSocio: SocioEntity = storedClub.socio.find(a => a.id === socio.id);

    expect(deletedSocio).toBeUndefined();

  });



});
