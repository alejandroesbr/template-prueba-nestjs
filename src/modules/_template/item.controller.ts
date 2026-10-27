import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';

/**
 * Presentation Layer (HTTP Controller Blueprint).
 * Handles HTTP routing, parameter extraction, status codes, and OpenAPI documentation.
 * Delegates all business and persistence logic to ItemService.
 */
@ApiTags('Template Items')
@ApiBearerAuth()
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new item' })
  @ApiCreatedResponse({
    description: 'The resource has been successfully created.',
    type: Item,
  })
  create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a paginated list of items' })
  @ApiOkResponse({
    description: 'Paginated list of resources retrieved successfully.',
    type: [Item],
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.itemService.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a single item by its UUID' })
  @ApiParam({ name: 'id', description: 'Resource UUID v4' })
  @ApiOkResponse({
    description: 'The requested resource was found.',
    type: Item,
  })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Partially update an existing item by its UUID' })
  @ApiParam({ name: 'id', description: 'Resource UUID v4' })
  @ApiOkResponse({
    description: 'The resource was updated successfully.',
    type: Item,
  })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove an item by its UUID' })
  @ApiParam({ name: 'id', description: 'Resource UUID v4' })
  @ApiNoContentResponse({
    description: 'The resource has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Resource not found.' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.itemService.remove(id);
  }
}

