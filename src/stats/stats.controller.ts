import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('stats')
@ApiTags('Stats')
export class StatsController {
  constructor(private statService: StatsService) {}

  @Get('home')
  async getHomePageStats() {
    return await this.statService.getHomePageStats();
  }

  @Get('home-selling-bill')
  async getHomeMonthly() {
    return await this.statService.getHomeMonthly();
  }
}
