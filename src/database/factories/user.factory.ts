import { Customer } from "src/modules/customers/entities/customer.entity";
import { DeliveryAgent } from "src/modules/delivery-agents/entities/delivery-agents.entity";
import { Merchant } from "src/modules/merchants/entities/merchants.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { User } from "src/modules/users/entities/user.entity";
import { UserType } from "src/types/user";
import { setSeederFactory } from "typeorm-extension";
import { Faker, fr } from "@faker-js/faker";

interface Context {
  merchant?: Merchant;
  deliveryAgent?: DeliveryAgent;
  serviceAgent?: ServiceAgent;
  customer?: Customer;
  password: string;
  user_type: UserType;
}

export default setSeederFactory(User, (faker, context: Context) => {
  const fakerFr = new Faker({ locale: [fr] });

  const user = new User();
  if (context.user_type === UserType.MERCHANT) {
    user.email = fakerFr.internet
      .email({
        firstName: context.merchant.first_name,
        lastName: context.merchant.last_name,
      })
      .toLowerCase();

    user.merchant = context.merchant;
  } else if (context.user_type === UserType.SERVICE_AGENT) {
    user.email = fakerFr.internet
      .email({
        firstName: context.serviceAgent.first_name,
        lastName: context.serviceAgent.last_name,
      })
      .toLowerCase();

    user.service_agent = context.serviceAgent;
  } else if (context.user_type === UserType.DELIVERY_AGENT) {
    user.email = fakerFr.internet
      .email({
        firstName: context.deliveryAgent.first_name,
        lastName: context.deliveryAgent.last_name,
      })
      .toLowerCase();

    user.delivery_agent = context.deliveryAgent;
  } else if (context.user_type === UserType.CUSTOMER) {
    user.email = fakerFr.internet
      .email({
        firstName: context.customer.first_name,
        lastName: context.customer.last_name,
      })
      .toLowerCase();

    user.customer = context.customer;
  }

  user.password = context.password;
  user.user_type = context.user_type;

  console.log(
    `➡️  Email : ${user.email} | Password : password | Type : ${user.user_type}`
  );

  return user;
});
