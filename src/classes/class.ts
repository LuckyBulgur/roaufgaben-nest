import { IsString, MaxLength, MinLength } from "class-validator";
import { Task } from "src/tasks/task";
import { lowUser, User } from "src/user/user";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Class {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @MinLength(3, { message: "Der Name muss mindestens 3 Zeichen lang sein." })
    @MaxLength(10, { message: "Der Name darf nicht länger als 10 Zeichen sein." })
    name: string;

    @ManyToOne(() => User, {
        cascade: true
    })
    @JoinColumn()
    creator: lowUser;

    @ManyToMany(() => Task, {
        cascade: true
    })
    @JoinTable()
    tasks: Task[];

    @CreateDateColumn()
    reg_date: Date;
}