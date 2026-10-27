import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Blueprint DTO for creating a new resource.
 * Copy this template when creating new feature modules and replace fields
 * with your domain-specific validation rules.
 */
export class CreateItemDto {
  @ApiProperty({
    description: 'Unique or descriptive name of the resource',
    example: 'Sample Resource',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the resource',
    example: 'Optional metadata or description for the resource',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Indicates whether the resource is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

