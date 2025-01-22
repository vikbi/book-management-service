import ConfigService from "../shared/services/config.service";

export const jwtConstants = {
    secret: ConfigService.getJwtSecret(),
    expiry: ConfigService.getJwtExpirationTime(),
};
