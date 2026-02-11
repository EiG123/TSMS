import { Hono } from "hono";
import { pmDropdownService } from "../services/PmDropdown.service.js";
import pool from "../services/db.js";

const pmDropdownRouter = new Hono();

pmDropdownRouter.post("/AddDropDown", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.InsertDropDown(
        body,
        pool
    );
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmDropdownRouter.post("/AddDropDownMember", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.InsertDropDownMember(
        body,
        pool
    );
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmDropdownRouter.get("/getAllDropdown", async (c) => {
    const data = await pmDropdownService.getAllDropdown(pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmDropdownRouter.post("/getDropdownMemberById", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.getDropdownMemberById(body, pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmDropdownRouter.post("/deleteDropdownById", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.deleteDropdownById(body, pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});


pmDropdownRouter.post("/AddDropDownMemberById", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.AddDropDownMemberById(body, pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});

pmDropdownRouter.post("/deleteDropdownMemberById", async (c) => {
    const body = await c.req.json();
    const data = await pmDropdownService.deleteDropdownMemberById(body, pool);
    if (data.success) {
        return c.json({
            data: data,
            success: true
        });
    } else {
        return c.json({
            success: false
        });
    }
});



export default pmDropdownRouter;
