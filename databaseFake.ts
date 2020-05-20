import { User }             from "./models/User";
import { Reimbursement }    from "./models/Reimbursement";

export class Row{}
export const rows=[]


export const users=[
    new User(1,'A','P','FN','LN','EM',10,'finance-manager'),
    new User(2,'B','P','FN','LN','EM',20,'finance-manager'),
    new User(3,'C','P','FN','LN','EM',30,''),
]

export const reimbursements=[
    new Reimbursement(1,1,100,12345,54321,'DE',1000,11,1),
    new Reimbursement(2,1,200,12345,54321,'DE',1000,22,2),
    new Reimbursement(3,1,300,12345,54321,'DE',1000,33,3),
]