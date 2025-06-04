import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";

import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { Merchant } from "../../modules/merchants/entities/merchants.entity";
import { DeliveryAgent } from "../../modules/delivery-agents/entities/delivery-agents.entity";
import { Customer } from "../../modules/customers/entities/customer.entity";
import { UserType } from "src/types/user";
import { User } from "../../modules/users/entities/user.entity";

export default class CreateUser implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    console.log("Creating users...");
    const serviceAgents = await factoryManager.get(ServiceAgent).saveMany(5);
    // const merchants = await factoryManager.get(Merchant).saveMany(5);
    // const deliveryAgents = await factoryManager.get(DeliveryAgent).saveMany(5);
    // const customers = await factoryManager.get(Customer).saveMany(5);
    const userFactory = factoryManager.get(User);

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash("password", salt);

    await Promise.all([
      //   serviceAgents.map(async (serviceAgent: ServiceAgent): Promise<any> => {
      //     await userFactory.save({
      //       serviceAgent,
      //       password,
      //       user_type: UserType.SERVICE_AGENT,
      //     });
      //   }),
      //   ...merchants.map(async (merchant: Merchant): Promise<any> => {
      //     await userFactory.save({
      //       merchant: merchant,
      //       password,
      //       user_type: UserType.MERCHANT,
      //     });
      //   }),
      //   ...deliveryAgents.map(
      //     async (deliveryAgent: DeliveryAgent): Promise<any> => {
      //       await userFactory.save({
      //         delivery_agent: deliveryAgent,
      //         password,
      //         user_type: UserType.DELIVERY_AGENT,
      //       });
      //     }
      //   ),
      //   ...customers.map(async (customer: Customer): Promise<any> => {
      //     await userFactory.save({
      //       customer: customer,
      //       password,
      //       user_type: UserType.CUSTOMER,
      //     });
      //   }),
    ]);
  }
}
