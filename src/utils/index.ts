import { DocumentBuilder } from '@nestjs/swagger';
import { Response } from 'express';

const EMAIL_TOKEN_EXPIRATION_MINUTE = 10;
const EMAIL_TOKEN_EXPIRATION_HOUR = 24;
export enum MembershipType {
  ANNUAL = 'ANNUAL',
  MONTHLY = 'MONTHLY',
}

export enum ServiceName {
  PERSONAL_TRAINING = 'Personal_Training',
  TOWEL_RENTAL = 'Towel_Rentals',
}

export const expirationMinute = () => {
  return new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTE * 60 * 1000,
  );
};

export const expirationHour = () => {
  return new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_HOUR * 60 * 60 * 1000,
  );
};

export const options = new DocumentBuilder()
  .setTitle('Gym Management')
  .setDescription('The Gym Management REST API description')
  .setVersion('1.0')
  .addTag('gym')
  .addBearerAuth()
  .build();

export const success = (res: Response, data) => {
  let resp = null;
  try {
    resp = JSON.parse(JSON.stringify(data));
  } catch (e) {
    resp = data;
  }
  return res.status(200).json(resp);
};

export const error = (
  res,
  status: number,
  eMsgTitle: string,
  message: string,
) => {
  return res.status(status).json({
    error: eMsgTitle,
    code: status,
    message,
    details: [
      {
        type_url: `${res.req.headers['x-forwarded-proto']}://${res.req.headers.host}`,
        value: res.req._parsedUrl.path,
        referer: res.req.headers.referer,
      },
    ],
  });
};

export interface userInfo {
  id: string;
  email: string;
}
