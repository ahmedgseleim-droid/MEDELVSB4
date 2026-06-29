
import * as zod from 'zod';

/**
 * Returns server health status
 * @summary Health check
 */
export const HealthCheckResponse = zod.object({
  "status": zod.string()
})

/**
 * @summary List all records
 */
export const ListRecordsResponseItem = zod.object({
  "id": zod.number(),
  "createdAt": zod.string().optional(),
  "firstResolvedAt": zod.string().nullable().optional(),
  "patientName": zod.string().optional(),
  "dob": zod.string().optional(),
  "phone": zod.string().optional(),
  "serial": zod.string().optional(),
  "implant": zod.string().optional(),
  "issueDescription": zod.string().optional(),
  "conditions": zod.string().optional(),
  "problemFirstOccurred": zod.string().optional(),
  "occurrenceFrequency": zod.string().optional(),
  "specificConditions": zod.string().optional(),
  "skin": zod.array(zod.string()).optional(),
  "visual": zod.array(zod.string()).optional(),
  "audio": zod.array(zod.string()).optional(),
  "physical": zod.array(zod.string()).optional(),
  "accessory": zod.array(zod.string()).optional(),
  "connectivity": zod.array(zod.string()).optional(),
  "steps": zod.array(zod.string()).optional(),
  "resolved": zod.string().optional(),
  "resolvedHow": zod.string().optional(),
  "nextAction": zod.string().optional(),
  "contactName": zod.string().optional(),
  "contactEmail": zod.string().optional(),
  "submittedBy": zod.string().optional()
})
export const ListRecordsResponse = zod.array(ListRecordsResponseItem)

/**
 * @summary Create a new record
 */
export const CreateRecordBody = zod.object({
  "patientName": zod.string().optional(),
  "dob": zod.string().optional(),
  "phone": zod.string().optional(),
  "serial": zod.string().optional(),
  "implant": zod.string().optional(),
  "issueDescription": zod.string().optional(),
  "conditions": zod.string().optional(),
  "problemFirstOccurred": zod.string().optional(),
  "occurrenceFrequency": zod.string().optional(),
  "specificConditions": zod.string().optional(),
  "skin": zod.array(zod.string()).optional(),
  "visual": zod.array(zod.string()).optional(),
  "audio": zod.array(zod.string()).optional(),
  "physical": zod.array(zod.string()).optional(),
  "accessory": zod.array(zod.string()).optional(),
  "connectivity": zod.array(zod.string()).optional(),
  "steps": zod.array(zod.string()).optional(),
  "resolved": zod.string().optional(),
  "resolvedHow": zod.string().optional(),
  "nextAction": zod.string().optional(),
  "contactName": zod.string().optional(),
  "contactEmail": zod.string().optional()
})

/**
 * @summary Get a record by ID
 */
export const GetRecordParams = zod.object({
  "id": zod.coerce.number()
})

export const GetRecordResponse = zod.object({
  "id": zod.number(),
  "createdAt": zod.string().optional(),
  "firstResolvedAt": zod.string().nullable().optional(),
  "patientName": zod.string().optional(),
  "dob": zod.string().optional(),
  "phone": zod.string().optional(),
  "serial": zod.string().optional(),
  "implant": zod.string().optional(),
  "issueDescription": zod.string().optional(),
  "conditions": zod.string().optional(),
  "problemFirstOccurred": zod.string().optional(),
  "occurrenceFrequency": zod.string().optional(),
  "specificConditions": zod.string().optional(),
  "skin": zod.array(zod.string()).optional(),
  "visual": zod.array(zod.string()).optional(),
  "audio": zod.array(zod.string()).optional(),
  "physical": zod.array(zod.string()).optional(),
  "accessory": zod.array(zod.string()).optional(),
  "connectivity": zod.array(zod.string()).optional(),
  "steps": zod.array(zod.string()).optional(),
  "resolved": zod.string().optional(),
  "resolvedHow": zod.string().optional(),
  "nextAction": zod.string().optional(),
  "contactName": zod.string().optional(),
  "contactEmail": zod.string().optional(),
  "submittedBy": zod.string().optional()
})

/**
 * @summary Update a record
 */
export const UpdateRecordParams = zod.object({
  "id": zod.coerce.number()
})

export const UpdateRecordBody = zod.object({
  "patientName": zod.string().optional(),
  "dob": zod.string().optional(),
  "phone": zod.string().optional(),
  "serial": zod.string().optional(),
  "implant": zod.string().optional(),
  "issueDescription": zod.string().optional(),
  "conditions": zod.string().optional(),
  "problemFirstOccurred": zod.string().optional(),
  "occurrenceFrequency": zod.string().optional(),
  "specificConditions": zod.string().optional(),
  "skin": zod.array(zod.string()).optional(),
  "visual": zod.array(zod.string()).optional(),
  "audio": zod.array(zod.string()).optional(),
  "physical": zod.array(zod.string()).optional(),
  "accessory": zod.array(zod.string()).optional(),
  "connectivity": zod.array(zod.string()).optional(),
  "steps": zod.array(zod.string()).optional(),
  "resolved": zod.string().optional(),
  "resolvedHow": zod.string().optional(),
  "nextAction": zod.string().optional(),
  "contactName": zod.string().optional(),
  "contactEmail": zod.string().optional()
})

export const UpdateRecordResponse = zod.object({
  "id": zod.number(),
  "createdAt": zod.string().optional(),
  "firstResolvedAt": zod.string().nullable().optional(),
  "patientName": zod.string().optional(),
  "dob": zod.string().optional(),
  "phone": zod.string().optional(),
  "serial": zod.string().optional(),
  "implant": zod.string().optional(),
  "issueDescription": zod.string().optional(),
  "conditions": zod.string().optional(),
  "problemFirstOccurred": zod.string().optional(),
  "occurrenceFrequency": zod.string().optional(),
  "specificConditions": zod.string().optional(),
  "skin": zod.array(zod.string()).optional(),
  "visual": zod.array(zod.string()).optional(),
  "audio": zod.array(zod.string()).optional(),
  "physical": zod.array(zod.string()).optional(),
  "accessory": zod.array(zod.string()).optional(),
  "connectivity": zod.array(zod.string()).optional(),
  "steps": zod.array(zod.string()).optional(),
  "resolved": zod.string().optional(),
  "resolvedHow": zod.string().optional(),
  "nextAction": zod.string().optional(),
  "contactName": zod.string().optional(),
  "contactEmail": zod.string().optional(),
  "submittedBy": zod.string().optional()
})

/**
 * @summary Delete a record
 */
export const DeleteRecordParams = zod.object({
  "id": zod.coerce.number()
})

export const DeleteRecordResponse = zod.object({
  "success": zod.boolean()
})

/**
 * @summary Get dashboard statistics
 */
export const GetRecordStatsResponse = zod.object({
  "total": zod.number(),
  "resolved": zod.number(),
  "unresolved": zod.number(),
  "bonebridge": zod.number(),
  "soundbridge": zod.number()
})