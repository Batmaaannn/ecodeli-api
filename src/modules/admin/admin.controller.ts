import {
  Controller,
  Get,
  Request,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { Roles } from "../auth/decorator/roles.decorator";
import { AdminService } from "./admin.service";
import { DeliveryAgent } from "../delivery-agents/entities/delivery-agents.entity";
import { Pagination } from "nestjs-typeorm-paginate";
import { DeliveryAgentsService } from "../delivery-agents/delivery-agents.service";
import { ServiceAgentsService } from "../service-agents/service-agents.service";
import { ServiceAgent } from "../service-agents/entities/service-agents.entity";

@ApiBearerAuth()
@ApiTags("admin")
@Roles(UserType.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly deliveryAgentsService: DeliveryAgentsService,
    private readonly serviceAgentsService: ServiceAgentsService
  ) {}

  @Get("delivery-agents")
  @ApiQuery({ name: "activated", required: false, type: Boolean })
  @ApiQuery({ name: "sort", required: false, type: String })
  async getPendingDeliveryAgents(
    @Query("activated") activated: boolean,
    @Query("sort") sort: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(15), ParseIntPipe) limit = 15
  ): Promise<Pagination<DeliveryAgent>> {
    limit = limit > 100 ? 100 : limit;

    return this.deliveryAgentsService.getPendingDeliveryAgents(
      { activated, sort },
      {
        page,
        limit,
        route: "/admin/delivery-agents",
      }
    );
  }

  @Get("delivery-agents/:id")
  async getDeliveryAgentDetails(@Param("id") id: number) {
    return this.deliveryAgentsService.getDeliveryAgentAndFilesById(id);
  }

  @Get("service-agents")
  @ApiQuery({ name: "activated", required: false, type: Boolean })
  @ApiQuery({ name: "sort", required: false, type: String })
  async getPendingServiceAgents(
    @Query("activated") activated: boolean,
    @Query("sort") sort: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(15), ParseIntPipe) limit = 15
  ): Promise<Pagination<ServiceAgent>> {
    limit = limit > 100 ? 100 : limit;

    return this.serviceAgentsService.getPendingServiceAgents(
      { activated, sort },
      {
        page,
        limit,
        route: "/admin/service-agents",
      }
    );
  }

  //   // ✅ VALIDER/REJETER UN DELIVERY AGENT
  //   @Put("delivery-agents/:id")
  //   async validateDeliveryAgent(
  //     @Param("id") userId: number,
  //     @Body()
  //     body: {
  //       decision: "approve" | "reject";
  //       comment?: string;
  //     },
  //     @GetUser() admin: any
  //   ) {
  //     return this.validationService.validateDeliveryAgent(
  //       userId,
  //       admin.id,
  //       body.decision,
  //       body.comment
  //     );
  //   }

  //   // ✅ LISTE DES SERVICE AGENTS EN ATTENTE
  //   @Get("service-agents")
  //   async getPendingServiceAgents(
  //     @Query("status") status?: string,
  //     @Query("page") page: number = 1,
  //     @Query("limit") limit: number = 10
  //   ) {
  //     return this.validationService.getPendingServiceAgents({
  //       status,
  //       page,
  //       limit,
  //     });
  //   }

  //   // ✅ DÉTAILS D'UN SERVICE AGENT SPÉCIFIQUE
  //   @Get("service-agents/:id")
  //   async getServiceAgentDetails(@Param("id") userId: number) {
  //     return this.validationService.getServiceAgentValidationDetails(userId);
  //   }

  //   // ✅ VALIDER/REJETER UN SERVICE AGENT
  //   @Put("service-agents/:id")
  //   async validateServiceAgent(
  //     @Param("id") userId: number,
  //     @Body()
  //     body: {
  //       decision: "approve" | "reject";
  //       comment?: string;
  //       prestationDecisions?: Array<{
  //         serviceAgentPrestationId: number;
  //         decision: "approve" | "reject" | "modify";
  //         appliedPrice?: number;
  //         comment?: string;
  //       }>;
  //     },
  //     @GetUser() admin: any
  //   ) {
  //     return this.validationService.validateServiceAgent(
  //       userId,
  //       admin.id,
  //       body.decision,
  //       body.comment,
  //       body.prestationDecisions
  //     );
  //   }
}
