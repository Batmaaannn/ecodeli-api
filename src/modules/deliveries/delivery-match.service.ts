import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { MailerService } from "@nestjs-modules/mailer";
import { sendDeliveryMatchEmail } from "src/utils/emails";
import { InjectRepository } from "@nestjs/typeorm";
import { DeliveryRequest } from "./entities/delivery.entity";
import { Trip } from "src/modules/trip/entities/trip.entity";
import { Repository } from "typeorm";

@Injectable()
export class DeliveryMatchService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(DeliveryRequest)
    private readonly deliveryRequestRepo: Repository<DeliveryRequest>,
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>
  ) {}

  @Cron("*/30 * * * * *")
  async matchTripsToDeliveries() {
    const deliveries = await this.deliveryRequestRepo.find();
    const trips = await this.tripRepo.find({ relations: ["delivery_agent"] });

    for (const delivery of deliveries) {
      const match = trips.find(
        (trip) =>
          trip.start_city === delivery.start_city &&
          trip.end_city === delivery.arrival_city
      );

      if (match) {
        console.log(delivery);
        console.log(`Sending mail to ${delivery.customer.user.email}`);
        await sendDeliveryMatchEmail(this.mailerService, {
          email: delivery.customer.user.email,
          departure: delivery.start_city,
          arrival: delivery.arrival_city,
          deliveryAgentName:
            match.delivery_agent.first_name +
            " " +
            match.delivery_agent.last_name,
        });
      }
    }
  }
}
