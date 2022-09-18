/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubEntity } from '../club/club.entity';
import { ClubService } from '../club/club.service';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
      const club: ClubEntity = await repository.save({
        id: "prueba" + i,
        nombre: faker.company.name(), 
        fechaFundacion: faker.date.past.toString(),
        imagen: faker.image.imageUrl(),
        descripcion: faker.lorem.sentence()})
        clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create retorna un nuevo Club', async () => {
    const club: ClubEntity = {
      id: '',
      nombre: faker.company.name(), 
      fechaFundacion: faker.date.past.toString(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      socio:null
    }

    const newClub: ClubEntity = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { id: newClub.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newClub.nombre)
    expect(storedClub.fechaFundacion).toEqual(newClub.fechaFundacion)
    expect(storedClub.imagen).toEqual(newClub.imagen)
    expect(storedClub.descripcion).toEqual(newClub.descripcion)
  });

  it('findAll retorna todos los clubs', async () => {
    const clubs: ClubEntity[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubList.length);
  });

  /*it('findOne retorna un club por id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
    expect(club.descripcion).toEqual(storedClub.descripcion)
  });*/

  it('update deberia actualizar un club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "nuevo nombre";
    club.descripcion = "nueva descipcion";

    const updatedClub: ClubEntity = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.descripcion).toEqual(club.descripcion)
  });

  it('delete debera eliminar un club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);

    const deletedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedClub).toBeNull();
  });

  it('update debera dar exception para un club invalido', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, nombre: "nuevo nombre", descripcion: "nueva descipcion"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "No se encontro un club con ese id")
  });

  it('delete debera dar exception para un club invalido', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "No se encontro un club con ese id")
  });





});
