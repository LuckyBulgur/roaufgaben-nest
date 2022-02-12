import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.getUserByName(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async verify(user: any, data: any) {
        const payload = { username: user.username, sub: user.id };
        if (!user.authcode) {
            return new HttpException('You dont need to verify', 401);
        }
        const verified = speakeasy.totp.verify({
            secret: user.authcode,
            encoding: 'base32',
            token: data.twoFactor
        });
        if (verified) {
            return {
                access_token: this.jwtService.sign(payload),
            };
        } else {
            return new HttpException('Falscher Verifizierungscode', 401);
        }
    }

    async createAuthCode(user: any): Promise<any> {
        const _user = await this.userService.getUser(user);
        if (_user.authcode) {
            _user.authcode = null;
            await this.userService.saveUser(_user);
            return new HttpException('Du hast Zwei Faktor erfolgreich deaktiviert', 201);
        }
        const secretCode: speakeasy.GeneratedSecret = await speakeasy.generateSecret({
            name: `ROaufgaben ${_user.username}`,
        });

        _user.authcode = secretCode.base32;
        await this.userService.saveUser(_user);

        const qr = await QRCode.toDataURL(secretCode.otpauth_url);
        return {
            qrcode: qr,
            link: secretCode.otpauth_url,
        };
    }


    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        if (user.authcode) {
            return new HttpException('You need to verify', 401);
        }
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}