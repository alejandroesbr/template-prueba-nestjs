import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';

describe('ItemService (Blueprint)', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an item from CreateItemDto', async () => {
    const result = await service.create({
      name: 'Blueprint Item',
      description: 'Test description',
      isActive: true,
    });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Blueprint Item');
    expect(result.isActive).toBe(true);
  });

  it('should return a paginated structure on findAll', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result).toHaveProperty('items');
    expect(result.meta.currentPage).toBe(1);
    expect(result.meta.itemsPerPage).toBe(10);
  });

  it('should throw NotFoundException when item does not exist', async () => {
    await expect(
      service.findOne('550e8400-e29b-41d4-a716-446655440000'),
    ).rejects.toThrow(NotFoundException);
  });
});

