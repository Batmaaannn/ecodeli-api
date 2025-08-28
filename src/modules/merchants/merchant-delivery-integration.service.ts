// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { MerchantDelivery, MerchantDeliveryStatus } from "./entities/merchant-delivery.entity";
// import { DeliveryMatchService } from "../deliveries/delivery-match.service";
// import { AnnouncementsService } from "../announcements/announcements.service";
// import { DeliveriesService } from "../deliveries/deliveries.service";

// @Injectable()
// export class MerchantDeliveryIntegrationService {
//   constructor(
//     @InjectRepository(MerchantDelivery)
//     private readonly merchantDeliveryRepository: Repository<MerchantDelivery>,
//     private readonly deliveryMatchService: DeliveryMatchService,
//     private readonly announcementsService: AnnouncementsService,
//     private readonly deliveriesService: DeliveriesService,
//   ) {}

//   async createAnnouncementFromMerchantDelivery(
//     merchantDeliveryId: number
//   ) {
//     const merchantDelivery = await this.merchantDeliveryRepository.findOne({
//       where: { id: merchantDeliveryId },
//       relations: ["merchant"],
//     });

//     if (!merchantDelivery) {
//       throw new Error("Merchant delivery not found");
//     }

//     // // Create announcement for the merchant delivery
//     // const announcement = await this.announcementsService.create({
//     //   title: `Livraison ${merchantDelivery.order_reference}`,
//     //   description: merchantDelivery.description || "Livraison commerce",
//     //   pickup_address: merchantDelivery.pickup_address,
//     //   delivery_address: merchantDelivery.delivery_address,
//     //   pickup_date: merchantDelivery.preferred_delivery_date,
//     //   delivery_date: merchantDelivery.preferred_delivery_date,
//     //   price: merchantDelivery.delivery_fee,
//     //   weight: 10, // Default weight, can be made configurable
//     //   dimensions: "Standard",
//     //   contact_phone: merchantDelivery.merchant.phone_number,
//     //   user_id: merchantDelivery.merchant.user_id,
//     // });

//     // Find matching delivery agents
//     await this.deliveryMatchService.findMatchingAgents(announcement);

//     return announcement;
//   }

//   async assignDeliveryAgent(
//     merchantDeliveryId: number,
//     deliveryAgentId: number
//   ) {
//     const merchantDelivery = await this.merchantDeliveryRepository.findOne({
//       where: { id: merchantDeliveryId },
//     });

//     if (!merchantDelivery) {
//       throw new Error("Merchant delivery not found");
//     }

//     // Create delivery record
//     const delivery = await this.deliveriesService.create({
//       delivery_agent_id: deliveryAgentId,
//       announcement_id: merchantDelivery.id, // This needs proper announcement mapping
//       delivery_type: "FULL",
//     });

//     // Update merchant delivery status
//     merchantDelivery.delivery_id = delivery.id;
//     merchantDelivery.status = MerchantDeliveryStatus.ASSIGNED;
    
//     await this.merchantDeliveryRepository.save(merchantDelivery);

//     return merchantDelivery;
//   }

//   async updateDeliveryStatus(
//     merchantDeliveryId: number,
//     status: MerchantDeliveryStatus
//   ) {
//     const merchantDelivery = await this.merchantDeliveryRepository.findOne({
//       where: { id: merchantDeliveryId },
//     });

//     if (!merchantDelivery) {
//       throw new Error("Merchant delivery not found");
//     }

//     merchantDelivery.status = status;
//     return this.merchantDeliveryRepository.save(merchantDelivery);
//   }

//   async syncWithDeliveryTracking(merchantDeliveryId: number) {
//     const merchantDelivery = await this.merchantDeliveryRepository.findOne({
//       where: { id: merchantDeliveryId },
//       relations: ["delivery"],
//     });

//     if (!merchantDelivery || !merchantDelivery.delivery) {
//       return null;
//     }

//     // Map delivery status to merchant delivery status
//     const statusMapping: Record<string, MerchantDeliveryStatus> = {
//       PENDING: MerchantDeliveryStatus.PENDING,
//       ACCEPTED: MerchantDeliveryStatus.ASSIGNED,
//       PICKED_UP: MerchantDeliveryStatus.PICKED_UP,
//       IN_TRANSIT: MerchantDeliveryStatus.IN_TRANSIT,
//       DELIVERED: MerchantDeliveryStatus.DELIVERED,
//       CANCELLED: MerchantDeliveryStatus.CANCELLED,
//     };

//     const mappedStatus = statusMapping[merchantDelivery.delivery.status];
//     if (mappedStatus && mappedStatus !== merchantDelivery.status) {
//       merchantDelivery.status = mappedStatus;
//       await this.merchantDeliveryRepository.save(merchantDelivery);
//     }

//     return merchantDelivery;
//   }
// }