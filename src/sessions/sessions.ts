import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sessions {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    ip: string;

    @Column()
    userAgent: string;

    @Column()
    location: string;

    @CreateDateColumn()
    reg_date: Date;
}