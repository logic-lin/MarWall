[TOC]

# 更新时间

## 2020-06-14

# 代码结构

## `userinfo`（用户信息）

+ `openid: String`（身份）
+ `avatar: String`（头像）
+ `nickname: String`（昵称）
+ `realname: String`（姓名）
+ `gender: String`（性别：可选项目为`[男, 女]`）
+ `tel: Number`（手机号）
+ `wxid: String`（微信号）
+ `qq: Number`（QQ号）
+ `campus: String`（学校：目前设置可选项目为`[河源中学]`）
+ `grade: String`（年级：目前设置可选项目为`[高一, 高二, 高三, 校友]`）
+ `register: Boolean`（注册：新用户默认为`false`）
+ `certification: Boolean`（认证：新用户默认为`false`）
+ `certificationimg: String`（认证图片：新用户默认为`null`）
+ `status: Object`（状态）
  + `view: Array<String>`（浏览：`postid`数组，新用户默认为`[]`）
  + `post: Array<String>`（评论：`postid`数组，新用户默认为`[]`）
  + `comment: Array<String>`（评论：`commentid`数组，新用户默认为`[]`）
  + `report: Array<String>`（举报：`reportid`数组，新用户默认为`[]`）
  + `feedback: Array<String>`（反馈：`feedbackid`数组，新用户默认为`[]`）
  + `check: Array<String>`（申请认证：`checkid`数组，新用户默认为`[]`）
  + `like: Object`（点赞）
    + `postlike: Array<String>`（帖子点赞：`postid`数组，新用户默认为`[]`）
    + `commentlike: Array<String>`（评论点赞：`commentid`数组，新用户默认为`[]`）

## `post`（帖子信息）

+ `postid: String`（编号：由`(new Date().getTime() + openid` 确定)
+ `type: String`（类型：目前设置可选项目为`[confession(表白墙), QA(问答墙), transaction(交易墙), help(雷锋墙), complaint(吐槽墙), community(社团墙), study(致习室), topic(话题街), message(留言巷), activity(活动站), propose(添砖瓦)]`）
+ `postedby: Object`（发布者）
  + `openid: String`（身份：便于追溯）
  + `avatar: String`（头像：便于显示）
  + `nickname: String`（昵称：便于显示）
+ `title: String`（标题，限制 14 字）
+ `label: Array<String>`（标签：可以为空，默认为`[]`）
+ `price: Number`（价格：非负整数，可以为空，必须在`[0,9999.99]`，默认为 0）
+ `content: String`（内容：限制 140 字）
+ `image: Array<String>`（配图：可以为空，最多 9 张，默认为`[]`）
+ `posttime: Number`（时间戳）
+ `anonymous: Boolean`（匿名：布尔值）
+ `status: Object`（状态）
  + `view: Array<String>`（浏览：`openid`数组，初始化为 `[]`，同一个人浏览多次仅算作一次）
  + `like: Array<String>`（点赞：`openid`数组，初始化为 `[]`，点赞可撤销）
  + `report: Array<String>`（举报：`reportid`数组，初始化为 `[]`，举报数超过 3 则不显示该帖子）
  + `comment: Array<String>`（评论：`commentid`数组，初始化为`[]`）

# `comment`（评论信息）

+ `commentid: String`（编号，由`new Date().getTime() + postid + app.globalData.userinfo.openid`确定）
+ `commentedtime: Number`（评论时间，由`new Date().getTime()`确定，需要注意的是，要在云函数确定时间戳，保持该时间戳与`commentid`的时间戳和`commenttime`的时间戳一致）
+ `commentedby: String`（评论者：`openid`）
+ `content: String`（内容：限制 140 字）
+ `image: Array<String>`（配图：可以为空，最多 9 张，默认为`[]`）
+ `anonymous: Boolean`（匿名）
+ `status: Object`（状态）
  + `like: Array<String>`（点赞，`openid`数组，初始化为`[]`）
  + `report: Array<Object>`（举报：长度超过 3 不再显示）
    + `reporter: String`（举报者：`openid`）
    + `reason: String`（举报原因：限制 140 字）
    + `reportedtime: Number`（举报时间：时间戳）

# `report`（举报类型）

+ `reportid: String`（编号：由`new Date().getTime() + commentid/postid + app.globalData.userinfo.openid`确定）
+ `reportedtime: Number`（举报时间，由`new Date().getTime()`确定，需要注意的是，要在云函数确定时间戳，保持该时间戳与`commentid/postid`的时间戳和`reportedtime`的时间戳一致））
+ `reportedby: String`（举报者：`openid`）
+ `type: String`（举报类型：目前包括`['post', 'comment']`）
+ `reportobj: String`（举报对象：目前包括`postid/commentid`）
+ `reason: String`（举报原因：限制 140 字）
+ `reply: Object`（回复）
+ `done: Boolean`（处理状态）

# `feedback`（反馈类型）
+ `feedbackid: String`（编号：由`new Date().getTime() + app.globalData.userinfo.openid`确定）
+ `feedbackedby: String`（反馈者：`openid`）
+ `type: String`（反馈类型：目前可选类型为`['意见建议', 'BUG反馈']`）
+ `content: String`（反馈内容：限制 140 字）
+ `image: Array<String>`（反馈图片，限制 9 张图片以内） 

# `community` (社团类型)

+ `presidnet: String`（社长：`openid`）
+ `admin: Array<String>`（拥有管理权限者：`openid`数组）
+ `clubname: String`（社团名称）
+ `structure: Array<String>`（社团结构：至少包含社长/成员）
+ `member: Array<Object>`（职务）
  + `openid: String`（用户 id）
  + `position: String`（职务名称：必须在`structure`内）
  + `jointime: Number`（加入时间：时间戳）

# `check`（申请类型）

+ `checkid: String`（编号：由`new Date().getTime() + app.globalData.userinfo.openid`确定）
+ `type: String`（目前包括`['userinfo', 'admin', 'joinCommunity', 'setCommunity']`）
+ `data: Object`（根据类型灵活确定结构）
+ `checkedtime: Number`（申请时间：时间戳）
+ `reply: Object`（回复内容）
+ `pass: Boolean`（通过状态）
+ `done: Boolean`（处理状态）

# `type`（发帖类型）

## 核心功能

+ `confession`（表白墙）
  + 功能列表（暂定）：包含标签`['高一', '高二', '高三', '班级', '社团', '团队']`（若选则只能选其一）
  + 功能说明：无
+ `QA`（问答墙）
  + 功能列表（暂定）：包含标签`['找组织', '寻资料']`（若选则只能选其一）
  + 功能说明（暂定）：找组织（如分班结果、兴趣爱好等）、寻资料（如段考成绩、参考答案等）
+ `transaction`（交易墙）
  + 功能列表（暂定）：包含标签`['学习类', '生活类', '租赁类', '代劳类']`（若选则只能选其一）
  + 功能说明（暂定）：代劳类（如代买东西等）
+ `help`（雷锋墙）
  + 功能列表（暂定）：包含标签`['寻物启事', '失物招领', '爱心募捐']`（若选则只能选其一）
  + 功能说明（暂定）：无
+ `complaint`（吐槽墙）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
+ `community`（社团墙）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无

## 扩展功能

+ `study`（致习室）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
+ `topic`（话题街）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
+ `message`（留言巷）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
+ `activity`（活动站）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
+ `propose`（砖瓦房）
  + 功能列表（暂定）：包含标签`[]`
  + 功能说明（暂定）：无
