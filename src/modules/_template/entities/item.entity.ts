import { ApiProperty } from '@nestjs/swagger';

/**
 * Blueprint Entity / Domain Model.
 *
 * ORM Integration Guide:
 * - For TypeORM: Decorate with `@Entity('items')`, `@PrimaryGeneratedColumn('uuid')`,
 *   `@Column()`, `@Index()`, `@CreateDateColumn()`, `@UpdateDateColumn()`.
 * - For Prisma: Reference the generated Prisma type or map fields here for Swagger serialization.
 * - For Mongoose: Decorate with `@Schema({ timestamps: true })` and `@Prop()`.
 */
export class Item {
  @ApiProperty({
    description: 'Unique identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the resource',
    example: 'Sample Resource',
  })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the resource',
    example: 'Optional metadata or description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Active status flag',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601)',
    example: '2026-10-26T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp (ISO 8601)',
    example: '2026-10-26T12:00:00.000Z',
  })
  updatedAt: Date;
}

