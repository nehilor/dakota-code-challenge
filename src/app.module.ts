import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalaryModule } from './salary/salary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SalaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
