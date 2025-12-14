//import { FindOptionsRelations } from 'typeorm';
//import { UserModel } from '../models/user';

import { NotImplementedException } from '@nestjs/common';

export class UserRelationsBuilder {
  // static build(): FindOptionsRelations<UserModel> {
  //return { project: true };
  //}

  static build(): string {
    throw new NotImplementedException('');
  }
}
