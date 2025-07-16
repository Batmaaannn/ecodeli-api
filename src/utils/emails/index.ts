import { MailerService } from '@nestjs-modules/mailer';

export const sendDeliveryMatchEmail = async (
    mailerService: MailerService,
    data: {
        email: string;
        departure: string;
        arrival: string;
        deliveryAgentName: string;
    }
) => {
    await mailerService.sendMail({
        to: data.email,
        subject: 'Une annonce correspond à votre trajet !',
        template: 'delivery-match',
        context: {
            departure: data.departure,
            arrival: data.arrival,
            deliveryAgentName: data.deliveryAgentName,
        },
    });
};
