import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { MessageConsumer } from './message.consumer';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  providers: [MessageService, MessageResolver, MessageConsumer],
})
export class MessageModule {}
