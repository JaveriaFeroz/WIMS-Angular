import { agFooter } from "../../helper/footer";
import { UserWarehouse } from './userwarehouse';
import { UserOption } from './useroption';
import { UserRole } from './userrole';

export class UserProfile {    
    userId: string;  
    userName: string;  
    branchName: string;  
    departmentName: string;  
    email:string;
    isActive: boolean;  
    options: UserOption[];    
    roles:UserRole[];
    warehouses: UserWarehouse[];
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }


}


