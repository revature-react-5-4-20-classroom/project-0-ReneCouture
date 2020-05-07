//user
{
    userId: number, // primary key
    username: string, // not null, unique
    password: string, // not null
    firstName: string, // not null
    lastName: string, // not null
    email: string, // not null
    role: Role // not null
}

//role
{
    roleId: number, // primary key
    role: string // not null, unique
}

//reimbursement
{
    reimbursementId: number, // primary key
    author: number,  // foreign key -> User, not null
    amount: number,  // not null
    dateSubmitted: number, // not null
    dateResolved: number, // not null
    description: string, // not null
    resolver: number, // foreign key -> User
    status: number, // foreign ey -> ReimbursementStatus, not null
    type: number // foreign key -> ReimbursementType
}

//reimbersementStatus
{
    statusId: number, // primary key
    status: string // not null, unique
}

//reimbursementType
{
    typeId: number, // primary key
    type: string, // not null, unique
}

