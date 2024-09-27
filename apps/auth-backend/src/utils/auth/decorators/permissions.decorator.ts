import { SetMetadata } from '@nestjs/common';

export const Permissions = (
  permissions: string[],
  isCheckCompanyPermissions?: boolean
) => SetMetadata('permissions', { permissions, isCheckCompanyPermissions });
