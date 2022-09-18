/* eslint-disable prettier/prettier */
import { Column, Entity,JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import {ClubEntity} from '../club/club.entity'

@Entity()
export class SocioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  fechaNacimiento: string;

  @ManyToMany(() => ClubEntity, club => club.socio)
  club: ClubEntity[];

}
