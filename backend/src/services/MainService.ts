import pool from './db.ts';
import PmNodeBService from './PmNodeB.service.ts';

const service = new PmNodeBService();

// Create
const newId = await service.create(pool, formData, uploadedFile);

// Update
const updatedId = await service.update(pool, formData, uploadedFile, 123);