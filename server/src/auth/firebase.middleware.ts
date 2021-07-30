import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { AuthService } from './auth.service';

const params = {
  type: process.env.TYPE,
  projectId: process.env.PROJECT_ID,
  privateKeyId: process.env.PRIVATE_KEY_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.CLIENT_EMAIL,
  clientId: process.env.CLIENT_ID,
  authUri: process.env.AUTH_URI,
  tokenUri: process.env.TOKEN_URI,
  authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
  clientC509CertUrl: process.env.CLIENT_X509_CERT_URL,
};

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  private defaultApp: admin.app.App;
  constructor(private readonly authService: AuthService) {
    this.defaultApp = admin.initializeApp({
      credential: admin.credential.cert(params),
    });
  }
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      throw new BadRequestException('missing token');
    }
    try {
      const currentUser = await this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''));
      const user = await this.authService.getUserByEmail(currentUser.email);

      //@ts-ignore
      req.user = user;
    } catch (error) {
      this.accessDenied(req.url, res, error.errorInfo.message);
    }

    next();
  }

  private accessDenied(url: string, res: Response, message: string) {
    res.status(403).json({
      statusCode: 403,
      timeStamp: new Date().toISOString(),
      path: url,
      message: message,
    });
  }
}
