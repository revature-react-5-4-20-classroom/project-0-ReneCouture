import session from 'express-session'

const sessionConfig={
    secret:     'thisIsSecret',
    cookie:     {secure:false},
    resave:     false,
    saveUninitialized:false
}

export const middlewareSession=session(sessionConfig)