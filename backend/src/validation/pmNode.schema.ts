import { z } from "zod";

export const pmNodeBSchema = z.object({
    site_id: z.string().nullable().optional().transform(val => val || ""),
    node_type: z.string().nullable().optional().transform(val => val || ""),
    round: z.string().nullable().optional().transform(val => val || ""),
    cabinet_total: z.string().nullable().optional().transform(val => val || ""),
    region: z.string().nullable().optional().transform(val => val || ""),
    datetime: z.string().nullable().optional().transform(val => val || ""),
    status: z.string().nullable().optional().transform(val => val || ""),
    planwork: z.string().nullable().optional().transform(val => val || ""),
    created_by: z.string().nullable().optional().transform(val => val || ""),
    remark: z.string().nullable().optional().transform(val => val || ""),
});

export type PmInfo = z.infer<typeof pmNodeBSchema>;
