import { IsString, MaxLength, MinLength } from 'class-validator';
import { Class } from 'src/classes/class';
import { Sessions } from 'src/sessions/sessions';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @MinLength(4, { message: 'Der Nutzername muss mindestens 4 Zeichen beinhalten.' })
    @MaxLength(20, { message: 'Der Nutzername darf nicht länger als 20 Zeichen sein.' })
    username: string;

    @Column()
    @IsString()
    @MinLength(8, { message: 'Das Passwort muss mindestens 8 Zeichen beinhalten.' })
    @MaxLength(255, { message: 'Das Passwort darf nicht länger als 255 Zeichen sein.' })
    password: string;

    @Column({
        nullable: true
    })
    authcode: string;

    @ManyToMany(() => Class, {
        cascade: true
    })
    @JoinTable()
    class: Class[];

    @ManyToMany(() => Sessions, {
        cascade: true
    })
    @JoinTable()
    sessions: Sessions[];

    @CreateDateColumn()
    reg_date: Date;

    toResponseObject(): lowUser {
        return {
            username: this.username,
            haveTwoFactor: this.authcode ? true : false,
            reg_date: this.reg_date,
        };
    }
}

export class lowUser {
    username: string;
    haveTwoFactor: boolean;
    reg_date: Date;
}