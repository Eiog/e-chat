import type { PipelineStage } from 'mongoose'
import { Types } from 'mongoose'

export function $timeProject(fields: { [field: string]: any }) {
  return {
    $project: {
      ...fields,
      createdAt: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: '$createdAt',
          timezone: 'Asia/Shanghai',
        },
      },
      updatedAt: {
        $dateToString: {
          format: '%Y-%m-%d %H:%M:%S',
          date: '$updatedAt',
          timezone: 'Asia/Shanghai',
        },
      },
    },
  } as PipelineStage.Project
}
export function $page(page: number, limit: number) {
  return {
    $skip: (page - 1) * limit,
  } as PipelineStage.Skip
}

export function $limit(limit: number) {
  return {
    $limit: limit,
  } as PipelineStage.Limit
}
export function $unwind(field: string, preserveNullAndEmptyArrays = true) {
  return {
    $unwind: {
      path: `${field}`,
      preserveNullAndEmptyArrays,
    },

  } as PipelineStage.Unwind
}
export function $string2ObjectId(id: string) {
  return new Types.ObjectId(id)
}
