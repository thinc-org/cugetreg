import { Injectable } from '@nestjs/common';
import { CreateElasticsearchInput } from './dto/create-elasticsearch.input';
import { UpdateElasticsearchInput } from './dto/update-elasticsearch.input';

@Injectable()
export class ElasticsearchService {
  create(createElasticsearchInput: CreateElasticsearchInput) {
    return 'This action adds a new elasticsearch';
  }

  findAll() {
    return `This action returns all elasticsearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elasticsearch`;
  }

  update(id: number, updateElasticsearchInput: UpdateElasticsearchInput) {
    return `This action updates a #${id} elasticsearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} elasticsearch`;
  }
}
