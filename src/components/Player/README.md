- [ ] 多检查 Exams - ExamIndex
- [ ] 多窗口 Windows - WindowIndex
- [ ] 多序列 Series - SeriesIndex
- [ ] 同步 Sync


# 初始化

0. 拉取所有的examList
1. 创建[原子](#原子)
2. 创建[原子集合](#原子集)
3. 为初始激活的原子集合缓存dicomImage
4. 为初始激活的原子集合创建[窗口](#窗口)
5. 渲染窗口内的集合
6. 激活窗口，默认激活第一个


# 概念
## 原子

播放器内的数据最小单位是一个序列对象（DataI），内定义了一些参数表示当前序列的状态 * 首先，DataI继承了SeriesI的信息*

| Name | Type | Default | Desc |
| -- | -- | -- | -- |
| cache | csImgage[] | - | 已缓存的cornerstone的Image对象数组|
| frame | number | 0 | 序列的当前帧索引 |
| examIndex | number | 0 | 序列所在的检查的索引 |
| seriesIndex | number | 0 | 序列在检查内的索引 |

## 原子集

许多原子组合为一个原子集合（CollectionI），内定义了一些当前原子集合的状态

| Name | Type | Default | Desc |
| -- | -- | -- | -- |
| examId | string | "" | 当前原子集对应的检查id |
| patientInfo | PatientExamI | - | 当前检查的病人信息 |
| dataMap | DataMapT | - | 原子映射集 |
| seriesIndex | number | 0 | 当前的序列索引 |
| active | boolean | false | 当前原子集合是否被激活 |


# 窗口

一个窗口只能对应一个原子集，播放器只能一次激活一个窗口

| Name | Type | Default | Desc |
| -- | -- | -- | -- |
| collectionIndex | number | 0 | 当前窗口对应的原子集合索引 |
| active | boolean | false | 窗口是否被激活 |
| element | HTMLElement | - | 窗口对应的Html元素 |