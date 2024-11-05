import qiniu from 'qiniu'

export const QiniuConfig = {
  accessKey: 'Nexbtd-8YPIFc0NdtykIGDw-FDl30w_cRAMFuDXT',
  secretKey: '-z6b6DKAmjgXr5iM_HypAWLzvwgy4E4bCVCNCk89',
  bucket: 'e-chat',
  region: 'qiniu.zone.Zone_z1',
  expires: 7200,
  publicBucketDomain: '',
  privateBucketDomain: '',
  cdn: 'http://slwbh2ys8.hb-bkt.clouddn.com/',
}
const { accessKey, secretKey, bucket, expires } = QiniuConfig

export function getUploadToken() {
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket,
    expires,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  })
  const uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}
export const uploadToken = getUploadToken()
const config = new qiniu.conf.Config()
export const formUploader = new qiniu.form_up.FormUploader(config)
export const putExtra = new qiniu.form_up.PutExtra()
