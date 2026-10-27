import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

/**
 * Feature Module Blueprint (Package by Feature).
 *
 * Copy the `_template` folder to `src/modules/<feature-name>` or run:
 * `npx nest g resource modules/<feature-name> --no-spec`
 * and register the resulting module inside `AppModule`.
 */
@Module({
  imports: [
    // Example TypeORM registration: TypeOrmModule.forFeature([Item])
    // Example CQRS registration: CqrsModule
  ],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}

