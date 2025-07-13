import { User } from "src/modules/users/entities/user.entity";
import { FileTargetType } from "src/types/file";
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

export const checkUserCanUpdateRegistrationFile = (id: number, file: any) => {
  if (file.target_type !== FileTargetType.REGISTRATION_REQUEST) return false;

  if (file.target_id === id) return true;

  return false;
};
