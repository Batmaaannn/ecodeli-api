// // prestation-registration-request.entity.ts
// import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { RegistrationRequest } from "./registration-requests.entity";
// import { Prestation } from "src/modules/prestations/entities/prestations.entity";

// @Entity({ name: "prestation_registration_requests" })
// export class PrestationRegistrationRequest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => RegistrationRequest, (request) => request.prestationLinks, {
//     onDelete: "CASCADE",
//   })
//   registrationRequest: RegistrationRequest;

//   @ManyToOne(
//     () => Prestation,
//     (prestation) => prestation.registrationRequestLinks,
//     {
//       onDelete: "CASCADE",
//     }
//   )
//   prestation: Prestation;

//   @Column("decimal", { precision: 10, scale: 2 })
//   price: number;
// }
