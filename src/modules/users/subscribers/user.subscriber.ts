import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    if (event.entity.password) {
      const salt = await bcrypt.genSalt();
      event.entity.password = await bcrypt.hash(event.entity.password, salt);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    if (event.entity.password) {
      const salt = await bcrypt.genSalt();
      event.entity.password = await bcrypt.hash(event.entity.password, salt);
    }
  }
}
