import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { lowUser, User } from 'src/user/user';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

enum Subject {
    Deutsch = 0,
    Englisch = 1,
    Mathematik = 2,
    Musik = 3,
    Sport = 4,
    KOR = 5,
    Geselle = 6,
    Natur = 7,
    Kunst = 8,
    WPK = 9,
    AWT = 10,
}

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsEnum(Subject)
    subject: Subject;

    @Column()
    @IsString()
    @MinLength(4, { message: 'Die Aufgabe muss mindestens 4 Zeichen beinhalten.' })
    @IsNotEmpty({ message: "Die Aufgabe darf nicht leer sein" })
    task: string;

    @Column()
    @IsNotEmpty({ message: "Das Abgabedatum darf nicht leer sein" })
    submission: Date;

    @ManyToOne(() => User, {
        cascade: true
    })
    @JoinColumn()
    author: lowUser;

    @CreateDateColumn()
    reg_date: Date;
}