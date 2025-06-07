import { User } from "src/modules/users/entities/user.entity";
import {
  isCustomerUser,
  isDeliveryAgentUser,
  isMerchantUser,
  isServiceAgentUser,
} from "src/types/typeGuards";

//TODO: Appointment
export const checkUserCanAddReview = (
  user: User | Omit<User, "password">,
  appointment: any
) => {
  if (isServiceAgentUser(user as User)) return false;
  if (isDeliveryAgentUser(user as User)) return false;
  if (isMerchantUser(user as User)) return false;
  if (isCustomerUser(user as User))
    return user.customer_id === appointment.customer_id;
};
