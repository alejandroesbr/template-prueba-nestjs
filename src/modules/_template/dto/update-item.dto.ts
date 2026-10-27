import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';

/**
 * Blueprint DTO for updating an existing resource.
 * Uses @nestjs/swagger PartialType to inherit all validation rules and
 * OpenAPI documentation metadata from CreateItemDto as optional properties.
 */
export class UpdateItemDto extends PartialType(CreateItemDto) {}

