const typeOptions = [
  { value: 0, label: '数字' },
  { value: 1, label: '字符' },
  { value: 2, label: '文本' },
  { value: 3, label: '数组' },
  { value: 4, label: '枚举' },
  { value: 5, label: '图片' },
  { value: 6, label: '文件' },
  { value: 7, label: '富文本' },
  { value: 8, label: '单选' },
  { value: 9, label: '多选' },
  { value: 10, label: '日期' },
  { value: 11, label: '时间' },
  { value: 12, label: '颜色' }
]
const groupOptions = [
  { value: 1, label: '基础' },
  { value: 2, label: '数据' },
  { value: 3, label: '系统' },
  { value: 4, label: 'API' }

]
const textMap = {
  update: '编辑',
  create: '添加'
}
const imageMap = {
  0: '禁用',
  1: '可用'
}
export {
  typeOptions,
  groupOptions,
  textMap,
  imageMap
}
