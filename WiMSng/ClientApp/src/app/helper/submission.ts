export class Submission {
  formId: number;
  formNo: string;
  owner: string;
  userId: string;
  comments: string;
  stateId: number;
  rejected: boolean;
  approved: boolean = false;
  completed: boolean = false;
  constructor() { this.rejected = false; }
}
