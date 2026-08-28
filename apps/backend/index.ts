import express from "express";
import { prisma } from "db/client";

const app = express();

app.post("/signup", (req, res) =>{
    prisma.user.create()
})

// signup, signin, organisation, board, invite {email:"",orgId:1} --email service, accept {OrgId}, section , issue -- POST 
// boards, sections, issues, issue/:issueId,organisations   -- GET 
// issue, issue/:issueId, section, membership {userId, orgId}   --- DELETE
// board, issue, section, /issue/move    --- PUT
// comment      ---POST/DELETE/PUT
