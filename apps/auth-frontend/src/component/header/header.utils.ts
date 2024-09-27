import { IconProp } from '@fortawesome/fontawesome-svg-core';
export interface MenuItem {
  link: string;
  label: string;
  icon: IconProp;
}

export interface IAuditInfo {
  deletedAt: any;
  deletedBy: any;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  updatedBy: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  auditInfo: IAuditInfo;
}

export const menuItems: MenuItem[] = [
  { link: '/home', label: 'Home', icon: 'home' },
];
