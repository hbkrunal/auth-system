import { AuthDisplayModel } from '../dto/auth-display-model';
import { AuthTokensInterface } from '../services/auth.service';
import { UserMapper } from '../../user/mappers/user-mapper';
import { User } from 'apps/auth-backend/src/database/models/user.model';

export class AuthMapper {
  public static toDisplay(tokens: AuthTokensInterface, UserEntity: User) {
    const User = new AuthDisplayModel();
    User.access_token = tokens.accessToken;
    User.refresh_token = tokens.refreshToken;
    User.user = UserMapper.toDisplay(UserEntity);
    return User;
  }
}
