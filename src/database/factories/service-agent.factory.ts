import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";

import { setSeederFactory } from "typeorm-extension";
import { Faker, fr } from "@faker-js/faker";

export default setSeederFactory(ServiceAgent, (faker) => {
  const fakerFr = new Faker({ locale: [fr] });

  const siret = Math.floor(Math.random() * 1000000000000).toString();
  const company_name = fakerFr.company.name();
  const company_address = fakerFr.location.streetAddress();
  const company_city = fakerFr.location.city();

  const last_name = fakerFr.person.lastName();
  const first_name = fakerFr.person.firstName();

  const telephone = fakerFr.phone.number();
  const address = fakerFr.location.streetAddress();

  const serviceAgent = new ServiceAgent();

  serviceAgent.siret = siret;
  serviceAgent.company_name = company_name;
  serviceAgent.company_address = company_address;
  serviceAgent.company_city = company_city;
  serviceAgent.last_name = last_name;
  serviceAgent.first_name = first_name;
  serviceAgent.phone_number = telephone;

  console.log(serviceAgent);
  return serviceAgent;
});
