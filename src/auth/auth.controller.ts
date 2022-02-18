import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { RateLimiterGuard } from 'nestjs-rate-limiter';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GetCurrentUserId } from './utils/get-user-id.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard, RateLimiterGuard)
    @Post("/login")
    login(@Request() req: any): any {
        return this.authService.login(req);
    }

    @UseGuards(LocalAuthGuard)
    @Post("/verify")
    verify(@Request() req: any, @Body() data): any {
        return this.authService.verify(req.user, data);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/create-auth-code")
    createAuthCode(@GetCurrentUserId() userId): any {
        return this.authService.createAuthCode(userId);
    }
}
