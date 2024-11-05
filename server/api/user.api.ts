import type { FriendFindDocument, UserFindDocument } from '../models'
import { createRouter, eventHandler, getValidatedQuery, readValidatedBody } from 'h3'
import { number, object, string } from 'zod'
import { isObjectId, paramsError } from '../helps'
import { FriendModel, UserModel } from '../models'
import { QiniuConfig } from '../qiniu'
import { $limit, $page, $string2ObjectId, $unwind } from './pipeline'
import { $friendProject, $friendSearchProject, $userProject } from './user.pipeline'

const router = createRouter()
router.post('/user/update', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    _id: string({ required_error: '缺少id' }).refine(v => isObjectId(v)),
    account: string().optional(),
    nickname: string().optional(),
    password: string().optional(),
    avatar: string().optional(),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const { _id } = body.data
  const user = await UserModel.findByIdAndUpdate(_id, body.data)
  return {
    success: true,
    message: '修改成功',
    user: { ...user?.toObject(), password: undefined },
  }
},
))
router.post('/user/find', eventHandler(async (handler) => {
  const body = await readValidatedBody(handler, object({
    page: number().optional().default(1),
    limit: number().optional().default(10),
    query: string().optional().default(''),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const { page, limit, query } = body.data
  const { list, count } = (await UserModel.aggregate<{ list: UserFindDocument[], count: number }>([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        $or: [
          {
            account: {
              $regex: query,
              $options: 'i',
            },
          },
          {
            nickname: {
              $regex: query,
              $options: 'i',
            },
          },
        ],
        $and: [
          {
            deleted: false,
          },
        ],
      },
    },
    {
      $facet: {
        list: [
          {
            $addFields: {
              avatarUrl: {
                $concat: [QiniuConfig.cdn ?? '', '$avatar'],
              },
            },
          },
          $page(page, limit),
          $limit(limit),
          $userProject,
        ],
        count: [
          {
            $count: 'count',
          },
        ],
      },
    },

    $unwind('$count'),
    {
      $project: {
        list: '$list',
        count: '$count.count',
      },
    },
  ]))[0]
  return {
    success: true,
    message: '查询成功',
    list,
    count,
  }
}))
router.get('/user/info', eventHandler(async (handler) => {
  const query = await getValidatedQuery(handler, object({
    _id: string({ required_error: '缺少id' }).refine(v => isObjectId(v)),
  }).safeParse)
  if (!query.success) {
    throw paramsError(query)
  }
  const { _id } = query.data
  const user = await UserModel.findOne({ _id }, { password: 0 })
  return {
    success: true,
    message: '查询成功',
    user,
  }
}))
router.post('/user/search-friend', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    page: number().optional().default(1),
    limit: number().optional().default(10),
    query: string().optional().default(''),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const _id = $string2ObjectId(event.context._id)
  const { page, limit, query } = body.data
  const { list, count } = (await UserModel.aggregate<{ list: UserFindDocument[], count: number }>([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        $or: [
          {
            account: {
              $regex: query,
              $options: 'i',
            },
          },
          {
            nickname: {
              $regex: query,
              $options: 'i',
            },
          },
        ],
        $and: [
          {
            deleted: false,
          },
          {
            _id: { $ne: _id },
          },
        ],
      },
    },
    {
      $facet: {
        list: [
          {
            $lookup: {
              from: 'friend-approvals',
              let: {
                id: '$_id',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        {
                          $eq: ['$_fromId', '$$id'],
                        },
                        {
                          $eq: ['$_targetId', '$$id'],
                        },
                      ],
                    },
                  },
                },
                {
                  $match: {
                    $or: [
                      {
                        _fromId: _id,
                      },
                      {
                        _targetId: _id,
                      },
                    ],
                  },
                },
              ],
              as: 'friends',
            },
          },
          {
            $addFields: {
              added: {
                $cond: {
                  if: {
                    $eq: [
                      { $ifNull: ['$friends', []] },
                      [],
                    ],
                  },
                  then: false,
                  else: true,
                },
              },
            },
          },
          {
            $addFields: {
              avatarUrl: {
                $concat: [QiniuConfig.cdn ?? '', '$avatar'],
              },
            },
          },
          $page(page, limit),
          $limit(limit),
          $friendSearchProject,
        ],
        count: [
          {
            $count: 'count',
          },
        ],
      },
    },
    $unwind('$count'),
    {
      $project: {
        list: '$list',
        count: '$count.count',
      },
    },
  ]))[0]
  return {
    success: true,
    message: '查询成功',
    list,
    count,
  }
}))
router.post('/user/apply-friend', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    _targetId: string({ required_error: '缺少id' }).refine(v => isObjectId(v)),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const _fromId = event.context._id
  const { _targetId } = body.data
  const result = await FriendModel.create({
    _fromId,
    _targetId,
  })
  return {
    success: true,
    message: '添加成功',
    result,
  }
}))
router.post('/user/friend', eventHandler(async (event) => {
  const body = await readValidatedBody(event, object({
    page: number().optional().default(1),
    limit: number().optional().default(10),
    query: string().optional().default(''),
  }).safeParse)
  if (!body.success) {
    throw paramsError(body)
  }
  const _id = $string2ObjectId(event.context._id)

  const { page, limit, query } = body.data
  const { list, count } = (await FriendModel.aggregate<{ list: FriendFindDocument[], count: number }>([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $match: {
        $expr: {
          $or: [
            {
              _fromId: _id,
            },
            {
              _targetId: _id,
            },
          ],
        },
      },
    },
    {
      $match: {
        deleted: false,
      },
    },
    {
      $facet: {
        list: [
          {
            $lookup: {
              from: 'users',
              let: {
                fromId: '$_fromId',
                targetId: '$_targetId',
                id: _id,
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $cond: {
                        if: { $eq: ['$$id', '$$fromId'] },
                        then: {
                          $eq: ['$_id', '$$targetId'],
                        },
                        else: {
                          $cond: {
                            if: { $eq: ['$$id', '$$targetId'] },
                            then: {
                              $eq: ['$_id', '$$fromId'],
                            },
                            else: false,
                          },
                        },
                      },
                    },
                  },
                },
                {
                  $addFields: {
                    avatarUrl: {
                      $concat: [QiniuConfig.cdn ?? '', '$avatar'],
                    },
                  },
                },
                {
                  $match: {
                    $or: [
                      {
                        account: {
                          $regex: query,
                          $options: 'i',
                        },
                      },
                      {
                        nickname: {
                          $regex: query,
                          $options: 'i',
                        },
                      },
                    ],
                  },
                },
                {
                  $match: {
                    deleted: false,
                  },
                },
                $userProject,
              ],
              as: 'users',
            },
          },
          $unwind('$users'),
          {
            $match: {
              users: { $exists: true },
            },
          },
          $page(page, limit),
          $limit(limit),
          $friendProject,
        ],
        count: [
          {
            $count: 'count',
          },
        ],
      },
    },
    $unwind('$count'),
    {
      $project: {
        list: '$list',
        count: '$count.count',
      },
    },
  ]))[0]
  return {
    success: true,
    message: '查询成功',
    list,
    count,
  }
}))
export default router
